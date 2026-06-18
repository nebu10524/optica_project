<?php

namespace Tests\Feature;

use App\Models\Evaluacion;
use App\Models\HistorialRetina;
use App\Models\ImagenRetina;
use App\Models\Paciente;
use App\Models\Usuario;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

/**
 * CAJA BLANCA - Modulo de Historial Clinico.
 * Recorre las ramas internas de HistorialController:
 *   - obtenerImagen(): imagen reconstruida desde base64 vs sin imagen.
 *   - descargarPdfPaciente(): coleccion vacia -> 404.
 *   - porPaciente(): normalizacion de hallazgos/signos a arreglo.
 */
class HistorialWhiteBoxTest extends TestCase
{
    use RefreshDatabase;

    private Usuario $usuario;
    private Paciente $paciente;
    private Evaluacion $evaluacion;

    protected function setUp(): void
    {
        parent::setUp();

        $this->usuario = Usuario::create([
            'nombre'   => 'Tester',
            'apellido' => 'QA',
            'email'    => 'tester.qa@optica.test',
            'password' => Hash::make('secret123'),
            'rol'      => 'optometrista',
        ]);
        Sanctum::actingAs($this->usuario, ['*']);

        $this->paciente = Paciente::create([
            'nombre'         => 'Paciente',
            'apellido'       => 'Historial',
            'dni'            => '40404040',
            'registrado_por' => $this->usuario->id,
        ]);

        $this->evaluacion = Evaluacion::create([
            'paciente_id' => $this->paciente->id,
            'usuario_id'  => $this->usuario->id,
        ]);
    }

    private function crearHistorialConImagen(array $imagenAttrs): HistorialRetina
    {
        $imagen = ImagenRetina::create(array_merge([
            'evaluacion_id' => $this->evaluacion->id,
            'paciente_id'   => $this->paciente->id,
            'mime_type'     => 'image/png',
            'nombre_archivo' => 'retina-test.png',
            // Ruta inexistente en disco: fuerza al controlador a usar la rama base64.
            'ruta_imagen'   => 'retinas/inexistente-en-test.png',
        ], $imagenAttrs));

        return HistorialRetina::create([
            'paciente_id'   => $this->paciente->id,
            'evaluacion_id' => $this->evaluacion->id,
            'imagen_id'     => $imagen->id,
            'clasificacion' => 'Sin signos',
            'urgencia'      => 'Baja',
        ]);
    }

    // WB: obtenerImagen reconstruye la imagen desde base64 -> 200 + content-type
    public function test_wb_obtener_imagen_desde_base64(): void
    {
        $historial = $this->crearHistorialConImagen([
            'imagen_base64' => base64_encode('contenido-de-imagen'),
        ]);

        $response = $this->get('/api/historial/' . $historial->id . '/imagen');

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'image/png');
    }

    // WB: obtenerImagen sin imagen almacenada -> 404
    public function test_wb_obtener_imagen_sin_datos_devuelve_404(): void
    {
        $historial = $this->crearHistorialConImagen([
            'imagen_base64' => null,
        ]);

        $response = $this->getJson('/api/historial/' . $historial->id . '/imagen');

        $response->assertStatus(404);
    }

    // WB: descargar PDF de un paciente sin historial -> 404
    public function test_wb_pdf_paciente_sin_historial_devuelve_404(): void
    {
        $response = $this->getJson('/api/historial/paciente/' . $this->paciente->id . '/pdf');

        $response->assertStatus(404);
    }

    // WB: porPaciente normaliza hallazgos a arreglo y ordena -> 200
    public function test_wb_historial_por_paciente_normaliza_hallazgos(): void
    {
        $this->crearHistorialConImagen([
            'imagen_base64' => base64_encode('img'),
            'hallazgos'     => ['exudados', 'microaneurismas'],
        ]);

        $response = $this->getJson('/api/historial/' . $this->paciente->id);

        $response->assertStatus(200);
        $response->assertJsonCount(1);
        $response->assertJsonPath('0.imagen.hallazgos.0', 'exudados');
    }
}
