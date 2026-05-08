<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\Evaluacion;
use App\Models\ImagenRetina;
use App\Models\HistorialRetina;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class RetinaController extends Controller
{
    public function analizar(Request $request)
    {
        $request->validate([
            'imagen'      => 'required|image|mimes:jpg,jpeg,png|max:5120',
            'paciente_id' => 'required|integer|exists:pacientes,id',
        ]);

        $archivo  = $request->file('imagen');
        $base64   = base64_encode(file_get_contents($archivo->getRealPath()));
        $mimeType = $archivo->getMimeType();

        $prompt = <<<PROMPT
Eres un sistema experto en análisis de retinografías con capacidad de visión computacional avanzada, entrenado específicamente para detectar Retinopatía Diabética siguiendo la escala internacional ICDR.

## INSTRUCCIONES DE ANÁLISIS VISUAL

Examina la imagen pixel a pixel siguiendo este orden estricto:

### 1. PREPROCESAMIENTO VISUAL MENTAL
Antes de diagnosticar, analiza internamente:
- Ajusta mentalmente el contraste para resaltar lesiones rojas (microaneurismas, hemorragias)
- Ajusta mentalmente el brillo para detectar lesiones blancas/amarillas (exudados)
- Identifica el canal verde de la imagen (mayor contraste retinal) para buscar estructuras vasculares
- Evalúa si la imagen tiene bordes oscuros (imagen circular normal) vs imagen mal encuadrada

### 2. LOCALIZACIÓN DE ESTRUCTURAS CLAVE
Ubica con precisión:
- DISCO ÓPTICO: zona circular brillante, generalmente en lado nasal — evalúa bordes, palidez, excavación, neovascularización en disco (NVD)
- MÁCULA: zona oscura central avascular — evalúa reflejo foveal, exudados circineados, engrosamiento
- ARCADAS VASCULARES: superior e inferior — evalúa calibre, tortuosidad, cruces AV, arrosariamiento

### 3. BÚSQUEDA SISTEMÁTICA POR CUADRANTE (Superior Temporal / Inferior Temporal / Superior Nasal / Inferior Nasal)
En CADA cuadrante busca activamente:

LESIONES ROJAS (prioridad alta):
→ Microaneurismas: puntos rojos redondeados <125µm, bordes nítidos
→ Hemorragias puntiformes: similares a microaneurismas pero >125µm
→ Hemorragias en llama: forma irregular, superficiales
→ Hemorragias prerretinianas: grandes, en barca, bordes superiores horizontales

LESIONES BLANCAS/AMARILLAS:
→ Exudados duros: depósitos amarillos brillantes, bordes bien definidos, frecuentes en polo posterior
→ Exudados blandos (algodón): manchas blancas algodonosas, bordes difusos, indican isquemia
→ Neovascularización en retina (NVE): vasos finos irregulares fuera del disco

CAMBIOS VASCULARES:
→ Arrosariamiento venoso: venas con calibre irregular tipo "collar de perlas"
→ IRMA: vasos intrarretinianos anómalos, tortuosos, dentro de la retina
→ Tortuosidad vascular aumentada

### 4. CLASIFICACIÓN ICDR OBLIGATORIA
Aplica la escala con criterio estricto:
- SIN RD → No se detectan anomalías
- LEVE → Únicamente microaneurismas
- MODERADA → Más hallazgos que solo microaneurismas, pero sin cumplir criterios de severa
- SEVERA/PROLIFERATIVA → Cualquiera de: >20 hemorragias en los 4 cuadrantes, arrosariamiento venoso en 2+ cuadrantes, IRMA prominente en 1+ cuadrante, O cualquier neovascularización/hemorragia prerretiniana/vítrea

---

## REGLAS CRÍTICAS DE RESPUESTA
- Si la imagen es oscura, borrosa o de baja calidad: AUN ASÍ intenta detectar lo visible e indica limitaciones en "hallazgos"
- Ante duda entre dos categorías: clasifica la MÁS SEVERA (principio de seguridad clínica)
- NO escribas texto fuera del JSON
- NO uses bloques markdown ni comillas adicionales
- Los valores booleanos deben ser true/false (sin comillas)
- Los valores de clasificacion DEBEN ser exactamente: Sin RD, Leve, Moderada, o Severa/Proliferativa
- Los valores de nivel_confianza DEBEN ser exactamente: Alto, Medio, o Bajo
- Los valores de urgencia DEBEN ser exactamente: Rutina, Prioridad, o Urgente

Responde ÚNICAMENTE en este formato JSON exacto, sin texto adicional:
{
  "clasificacion": "Sin RD | Leve | Moderada | Severa/Proliferativa",
  "nivel_confianza": "Alto | Medio | Bajo",
  "hallazgos": ["hallazgo 1", "hallazgo 2", "hallazgo 3"],
  "signos_rd": {
    "microaneurismas": false,
    "hemorragias": false,
    "exudados_duros": false,
    "exudados_blandos": false,
    "neovascularizacion": false,
    "edema_macular": false
  },
  "recomendacion": "texto de recomendación para el especialista",
  "urgencia": "Rutina | Prioridad | Urgente"
}
PROMPT;

        $apiKey = config('services.gemini.key');

        $response = Http::timeout(60)->post(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={$apiKey}",
            [
                'contents' => [[
                    'parts' => [
                        [
                            'inline_data' => [
                                'mime_type' => $mimeType,
                                'data'      => $base64,
                            ]
                        ],
                        ['text' => $prompt]
                    ]
                ]],
                'generationConfig' => [
                    'temperature'     => 0.1,
                    'maxOutputTokens' => 3000,
                ]
            ]
        );

        if (!$response->successful()) {
            Log::error('Gemini error', [
                'status' => $response->status(),
                'body'   => $response->body()
            ]);

            return response()->json([
                'error'   => 'Error al conectar con Gemini',
                'status'  => $response->status(),
                'detalle' => $response->json()
            ], 500)->header('Access-Control-Allow-Origin', '*');
        }

        $texto = $response->json('candidates.0.content.parts.0.text', '');

        $texto = preg_replace('/```json\s*/i', '', $texto);
        $texto = preg_replace('/```\s*/i', '', $texto);
        $texto = trim($texto);

        if (preg_match('/\{.*\}/s', $texto, $matches)) {
            $texto = $matches[0];
        }

        $reporte = json_decode($texto, true);

        if (!$reporte) {
            Log::warning('IA devolvió JSON incompleto', [
                'raw'        => $texto,
                'json_error' => json_last_error_msg()
            ]);

            $reporte = [
                "clasificacion"   => "Sin RD",
                "nivel_confianza" => "Bajo",
                "hallazgos"       => ["No se pudo analizar completamente la imagen"],
                "signos_rd"       => [
                    "microaneurismas"    => false,
                    "hemorragias"        => false,
                    "exudados_duros"     => false,
                    "exudados_blandos"   => false,
                    "neovascularizacion" => false,
                    "edema_macular"      => false
                ],
                "recomendacion" => "Repetir el análisis con una imagen más clara.",
                "urgencia"      => "Rutina"
            ];
        }

        $usuarioId = $request->user()?->id;
        if (!$usuarioId) {
            return response()->json([
                'message' => 'Usuario no autenticado.'
            ], 401);
        }

        $nombreArchivo = Str::uuid() . '.' . $archivo->getClientOriginalExtension();
        $rutaImagen = null;
        $evaluacion = null;
        $imagenRetina = null;

        try {
            // Guardar imagen en storage
            $rutaImagen = $archivo->storeAs('retinas', $nombreArchivo, 'public');

            DB::transaction(function () use (
                $request,
                $usuarioId,
                $rutaImagen,
                $nombreArchivo,
                $mimeType,
                $reporte,
                &$evaluacion,
                &$imagenRetina
            ) {
                // Crear evaluación — tabla: evaluaciones_retina
                $evaluacion = Evaluacion::create([
                    'paciente_id'   => $request->paciente_id,
                    'usuario_id'    => $usuarioId,
                    'observaciones' => null,
                ]);

                // Guardar imagen con reporte — tabla: imagenes_retina
                $imagenRetina = ImagenRetina::create([
                    'evaluacion_id'   => $evaluacion->id,
                    'paciente_id'     => $request->paciente_id,
                    'ruta_imagen'     => $rutaImagen,
                    'nombre_archivo'  => $nombreArchivo,
                    'mime_type'       => $mimeType,
                    // Persistimos la imagen en DB para que el PDF siga mostrando
                    // la evidencia incluso si el disco efimero de Render se limpia.
                    'imagen_base64'   => $base64,
                    'clasificacion'   => $reporte['clasificacion'],
                    'nivel_confianza' => $reporte['nivel_confianza'],
                    'urgencia'        => $reporte['urgencia'],
                    // Se guarda como array nativo para evitar doble codificacion JSON.
                    'hallazgos'       => $reporte['hallazgos'] ?? [],
                    'signos_rd'       => $reporte['signos_rd'] ?? [],
                    'recomendacion'   => $reporte['recomendacion'],
                    'modelo_ia'       => 'gemini-2.5-flash',
                ]);

                // Guardar en historial — tabla: historial_retina
                HistorialRetina::create([
                    'paciente_id'     => $request->paciente_id,
                    'evaluacion_id'   => $evaluacion->id,
                    'imagen_id'       => $imagenRetina->id,
                    'clasificacion'   => $imagenRetina->clasificacion,
                    'urgencia'        => $imagenRetina->urgencia,
                    'nivel_confianza' => $imagenRetina->nivel_confianza,
                ]);
            });
        } catch (\Throwable $e) {
            if ($rutaImagen && \Illuminate\Support\Facades\Storage::disk('public')->exists($rutaImagen)) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($rutaImagen);
            }

            Log::error('Error guardando analisis de retina', [
                'message' => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'No se pudo guardar el analisis.'
            ], 500);
        }

        return response()->json([
            'reporte'       => $reporte,
            'imagen_url'    => asset('storage/' . $rutaImagen),
            'modelo'        => 'gemini-2.5-flash',
            'paciente_id'   => $request->paciente_id,
            'evaluacion_id' => $evaluacion->id,
            'imagen_id'     => $imagenRetina->id,
        ])->header('Access-Control-Allow-Origin', '*');
    }
}