<?php

namespace Tests\Feature;

use App\Models\Evaluacion;
use App\Models\Paciente;
use App\Models\Usuario;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

/**
 * CAJA NEGRA / CAJA BLANCA - Modulo de Evaluaciones.
 * Cubre la validacion de entradas (caja negra) y las ramas de
 * "encontrada / no encontrada" de show() y completar() (caja blanca).
 */
class EvaluacionBlackBoxTest extends TestCase
{
    use RefreshDatabase;

    private Usuario $usuario;
    private Paciente $paciente;

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
            'apellido'       => 'Evaluacion',
            'dni'            => '30303030',
            'registrado_por' => $this->usuario->id,
        ]);
    }

    // CN-19  Crear evaluacion con paciente valido -> 201
    public function test_cn19_crear_evaluacion_valida(): void
    {
        $response = $this->postJson('/api/evaluaciones', [
            'paciente_id'   => $this->paciente->id,
            'observaciones' => 'Control de rutina',
        ]);

        $response->assertStatus(201);
    }

    // CN-20  Crear evaluacion sin paciente_id -> 422
    public function test_cn20_crear_evaluacion_sin_paciente_es_rechazada(): void
    {
        $response = $this->postJson('/api/evaluaciones', [
            'observaciones' => 'Sin paciente',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['paciente_id']);
    }

    // CN-21  Crear evaluacion con paciente inexistente -> 422
    public function test_cn21_crear_evaluacion_paciente_inexistente(): void
    {
        $response = $this->postJson('/api/evaluaciones', [
            'paciente_id' => 999999,
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['paciente_id']);
    }

    // WB (rama no encontrada): consultar evaluacion inexistente -> 404
    public function test_wb_evaluacion_inexistente_devuelve_404(): void
    {
        $response = $this->getJson('/api/evaluaciones/9999');

        $response->assertStatus(404);
    }

    // WB (rama encontrada): consultar evaluacion existente -> 200
    public function test_wb_evaluacion_existente_devuelve_200(): void
    {
        $evaluacion = Evaluacion::create([
            'paciente_id'   => $this->paciente->id,
            'usuario_id'    => $this->usuario->id,
            'observaciones' => 'Inicial',
        ]);

        $response = $this->getJson('/api/evaluaciones/' . $evaluacion->id);

        $response->assertStatus(200);
    }

    // CN-22 / WB: completar sin observaciones -> 422
    public function test_cn22_completar_sin_observaciones_es_rechazada(): void
    {
        $evaluacion = Evaluacion::create([
            'paciente_id' => $this->paciente->id,
            'usuario_id'  => $this->usuario->id,
        ]);

        $response = $this->putJson('/api/evaluaciones/' . $evaluacion->id . '/completar', []);

        $response->assertStatus(422);
    }

    // WB (rama no encontrada): completar evaluacion inexistente -> 404
    public function test_wb_completar_inexistente_devuelve_404(): void
    {
        $response = $this->putJson('/api/evaluaciones/9999/completar', [
            'observaciones' => 'algo',
        ]);

        $response->assertStatus(404);
    }
}
