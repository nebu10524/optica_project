<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Evaluacion;
use App\Models\HistorialRetina;
use App\Models\ImagenRetina;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class HistorialController extends Controller
{
    private const DEFAULT_IMAGE_MIME = 'image/jpeg';

    // GET /api/historial/{paciente_id}
    public function porPaciente($paciente_id)
    {
        $historial = HistorialRetina::with(['imagen', 'evaluacion.usuario'])
            ->where('paciente_id', $paciente_id)
            ->orderByDesc('fecha_analisis')
            ->get();

        $historial->each(function ($registro) {
            if (!$registro->imagen) {
                return;
            }
            $registro->imagen->hallazgos = $this->normalizarArray($registro->imagen->hallazgos);
            $registro->imagen->signos_rd = $this->normalizarArray($registro->imagen->signos_rd);
        });

        return response()->json($historial);
    }

    // GET /api/historial/{historial_id}/pdf
    public function descargarPdf($historial_id)
    {
        $registro = HistorialRetina::with(['paciente', 'evaluacion.usuario', 'imagen'])
            ->findOrFail($historial_id);

        $imagenUrl = null;
        $imagenDataUri = null;
        $ruta = $registro->imagen?->ruta_imagen;
        if ($ruta && Storage::disk('public')->exists($ruta)) {
            $imagenUrl = Storage::disk('public')->path($ruta);
        }
        if (!$imagenUrl && !empty($registro->imagen?->imagen_base64)) {
            $mime = $registro->imagen?->mime_type ?: self::DEFAULT_IMAGE_MIME;
            $imagenDataUri = 'data:' . $mime . ';base64,' . $registro->imagen->imagen_base64;
        }

        $pdf = Pdf::loadView('pdf.resultado_retina', [
            'registro' => $registro,
            'imagenUrl' => $imagenUrl,
            'imagenDataUri' => $imagenDataUri,
            'generadoEn' => now(),
        ])->setPaper('a4');

        $paciente = $registro->paciente;
        $nombreArchivo = 'resultado-retina-' . ($paciente?->dni ?: $registro->paciente_id) . '-' . $registro->id . '.pdf';

        return $pdf->download($nombreArchivo);
    }

    // GET /api/historial/paciente/{paciente_id}/pdf
    public function descargarPdfPaciente($paciente_id)
    {
        $registros = HistorialRetina::with(['paciente', 'evaluacion.usuario', 'imagen'])
            ->where('paciente_id', $paciente_id)
            ->orderByDesc('fecha_analisis')
            ->get();

        if ($registros->isEmpty()) {
            return response()->json([
                'message' => 'El paciente no tiene registros de historial.'
            ], 404);
        }

        $pdf = Pdf::loadView('pdf.historial_retina', [
            'registros' => $registros,
            'paciente' => $registros->first()->paciente,
            'generadoEn' => now(),
        ])->setPaper('a4');

        $paciente = $registros->first()->paciente;
        $nombreArchivo = 'historial-retina-' . ($paciente?->dni ?: $paciente_id) . '.pdf';

        return $pdf->download($nombreArchivo);
    }

    // GET /api/historial/{historial_id}/imagen
    public function obtenerImagen($historial_id)
    {
        $registro = HistorialRetina::with('imagen')->findOrFail($historial_id);
        $ruta = $registro->imagen?->ruta_imagen;

        $existeArchivo = $ruta && Storage::disk('public')->exists($ruta);
        if (!$existeArchivo) {
            return $this->responderImagenDesdeBase64($registro);
        }

        $mime = $registro->imagen?->mime_type
            ?: (Storage::disk('public')->mimeType($ruta) ?: self::DEFAULT_IMAGE_MIME);
        $contenido = Storage::disk('public')->get($ruta);

        return $this->responderImagen($contenido, $mime);
    }

    private function responderImagenDesdeBase64(HistorialRetina $registro)
    {
        $base64 = $registro->imagen?->imagen_base64;
        if (empty($base64)) {
            return response()->json([
                'message' => 'No se encontro imagen asociada para este analisis.'
            ], 404);
        }

        $contenido = base64_decode($base64, true);
        if ($contenido === false) {
            return response()->json([
                'message' => 'No se pudo reconstruir la imagen almacenada.'
            ], 500);
        }

        $mime = $registro->imagen?->mime_type ?: self::DEFAULT_IMAGE_MIME;
        return $this->responderImagen($contenido, $mime);
    }

    private function responderImagen(string $contenido, string $mime)
    {
        return response($contenido, 200)
            ->header('Content-Type', $mime)
            ->header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    }

    // DELETE /api/historial/{historial_id}
    public function destroy($historial_id)
    {
        $registro = HistorialRetina::findOrFail($historial_id);

        DB::transaction(function () use ($registro) {
            $imagenId = $registro->imagen_id;
            $evaluacionId = $registro->evaluacion_id;

            if ($imagenId) {
                $imagen = ImagenRetina::find($imagenId);
                if ($imagen) {
                    if (!empty($imagen->ruta_imagen) && Storage::disk('public')->exists($imagen->ruta_imagen)) {
                        Storage::disk('public')->delete($imagen->ruta_imagen);
                    }
                    $imagen->delete();
                }
            }

            $registro->delete();

            if ($evaluacionId) {
                Evaluacion::where('id', $evaluacionId)->delete();
            }
        });

        return response()->json([
            'message' => 'Analisis eliminado correctamente'
        ]);
    }

    private function normalizarArray($valor): array
    {
        if (is_array($valor)) {
            return $valor;
        }
        if (is_string($valor) && $valor !== '') {
            $decoded = json_decode($valor, true);
            if (is_array($decoded)) {
                return $decoded;
            }
        }
        return [];
    }

}
