<?php

namespace Tests\Feature;

use App\Models\Usuario;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

/**
 * CAJA NEGRA - Modulo de Analisis de Retina (IA).
 * Se prueban entradas/salidas del endpoint sin invocar el servicio externo:
 * proteccion por token, metodo HTTP y validacion de los datos requeridos.
 */
class RetinaBlackBoxTest extends TestCase
{
    use RefreshDatabase;

    // CN-23  Analizar sin autenticacion -> 401
    public function test_cn23_analizar_sin_token_es_rechazado(): void
    {
        $response = $this->postJson('/api/retina/analizar', []);

        $response->assertStatus(401);
    }

    // CN-24  Metodo GET no permitido en la ruta de analisis -> 405
    public function test_cn24_analizar_con_get_no_permitido(): void
    {
        $response = $this->getJson('/api/retina/analizar');

        $response->assertStatus(405);
    }

    // CN-25  Analizar autenticado sin imagen ni paciente -> 422
    public function test_cn25_analizar_sin_datos_es_rechazado(): void
    {
        $usuario = Usuario::create([
            'nombre'   => 'Tester',
            'apellido' => 'QA',
            'email'    => 'tester.qa@optica.test',
            'password' => Hash::make('secret123'),
            'rol'      => 'optometrista',
        ]);
        Sanctum::actingAs($usuario, ['*']);

        $response = $this->postJson('/api/retina/analizar', []);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['imagen', 'paciente_id']);
    }
}
