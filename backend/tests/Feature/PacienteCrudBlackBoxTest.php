<?php

namespace Tests\Feature;

use App\Models\Paciente;
use App\Models\Usuario;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

/**
 * CAJA NEGRA - Modulo de Gestion de Pacientes (CRUD).
 * Tecnica: particion de equivalencias sobre el alta de pacientes y
 * verificacion de respuestas del CRUD por entradas/salidas.
 */
class PacienteCrudBlackBoxTest extends TestCase
{
    use RefreshDatabase;

    private Usuario $usuario;

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
    }

    // CN-13  Alta de paciente con datos validos -> 201
    public function test_cn13_alta_paciente_valida(): void
    {
        $response = $this->postJson('/api/pacientes', [
            'nombre'   => 'Carlos',
            'apellido' => 'Ramos',
            'dni'      => '45678901',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('pacientes', ['dni' => '45678901']);
    }

    // CN-14  Alta sin nombre (campo requerido) -> 422
    public function test_cn14_alta_sin_nombre_es_rechazada(): void
    {
        $response = $this->postJson('/api/pacientes', [
            'apellido' => 'Ramos',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['nombre']);
    }

    // CN-15  Alta con DNI duplicado -> 422
    public function test_cn15_alta_dni_duplicado_es_rechazada(): void
    {
        Paciente::create([
            'nombre'         => 'Existente',
            'apellido'       => 'Paciente',
            'dni'            => '99998888',
            'registrado_por' => $this->usuario->id,
        ]);

        $response = $this->postJson('/api/pacientes', [
            'nombre'   => 'Nuevo',
            'apellido' => 'Paciente',
            'dni'      => '99998888',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['dni']);
    }

    // CN-16  Consultar paciente inexistente -> 404
    public function test_cn16_consultar_paciente_inexistente(): void
    {
        $response = $this->getJson('/api/pacientes/9999');

        $response->assertStatus(404);
    }

    // CN-17  Eliminar paciente existente -> 200
    public function test_cn17_eliminar_paciente_existente(): void
    {
        $paciente = Paciente::create([
            'nombre'         => 'Para',
            'apellido'       => 'Borrar',
            'dni'            => '10101010',
            'registrado_por' => $this->usuario->id,
        ]);

        $response = $this->deleteJson('/api/pacientes/' . $paciente->id);

        $response->assertStatus(200);
        $this->assertDatabaseMissing('pacientes', ['id' => $paciente->id]);
    }

    // CN-18  Listado de pacientes -> 200 con arreglo
    public function test_cn18_listado_pacientes(): void
    {
        Paciente::create([
            'nombre'         => 'Uno',
            'apellido'       => 'Paciente',
            'dni'            => '20202020',
            'registrado_por' => $this->usuario->id,
        ]);

        $response = $this->getJson('/api/pacientes');

        $response->assertStatus(200);
        $response->assertJsonCount(1);
    }
}
