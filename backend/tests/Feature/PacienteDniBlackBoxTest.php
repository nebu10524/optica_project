<?php

namespace Tests\Feature;

use App\Models\Usuario;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

/**
 * PRUEBAS DE CAJA NEGRA (Black-box).
 *
 * Se prueba el sistema por sus ENTRADAS y SALIDAS, sin conocer el codigo interno.
 * Tecnicas aplicadas:
 *   - Particion de equivalencias: DNI valido (8 digitos) vs invalidos (corto, largo, no numerico, vacio).
 *   - Analisis de valores limite: 7, 8 y 9 digitos alrededor del limite valido.
 *
 * Modulos bajo prueba: busqueda de paciente por DNI (RENIEC) y autenticacion (login).
 */
class PacienteDniBlackBoxTest extends TestCase
{
    use RefreshDatabase;

    private function usuarioAutenticado(): Usuario
    {
        $usuario = Usuario::create([
            'nombre'   => 'Tester',
            'apellido' => 'QA',
            'email'    => 'tester.qa@optica.test',
            'password' => Hash::make('secret123'),
            'rol'      => 'optometrista',
        ]);

        Sanctum::actingAs($usuario, ['*']);

        return $usuario;
    }

    /** Simula una respuesta exitosa de RENIEC para cualquier DNI consultado. */
    private function fakeReniecExitoso(): void
    {
        config(['services.apisperu.token' => 'token-de-prueba']);
        config(['services.apisperu.dni_url' => 'https://reniec.test/api/v1/dni']);

        Http::fake([
            'reniec.test/*' => Http::response([
                'success'        => true,
                'nombres'        => 'JUAN CARLOS',
                'apellidoPaterno' => 'PEREZ',
                'apellidoMaterno' => 'GOMEZ',
            ], 200),
        ]);
    }

    // ─────────────────────────────────────────────────────────────
    // CN-01  Clase valida: DNI de exactamente 8 digitos (limite valido)
    // Entrada: 72639576  ->  Salida esperada: 200 con datos del paciente
    // ─────────────────────────────────────────────────────────────
    public function test_cn01_dni_valido_de_8_digitos_devuelve_datos(): void
    {
        $this->usuarioAutenticado();
        $this->fakeReniecExitoso();

        $response = $this->getJson('/api/reniec/72639576');

        $response->assertStatus(200);
        $response->assertJsonPath('dni', '72639576');
        $response->assertJsonStructure(['dni', 'nombres', 'apellido', 'nombre_completo']);
    }

    // ─────────────────────────────────────────────────────────────
    // CN-02  Clase invalida (corto) / valor limite inferior: 7 digitos
    // Entrada: 7263957  ->  Salida esperada: 422 (validacion)
    // ─────────────────────────────────────────────────────────────
    public function test_cn02_dni_de_7_digitos_es_rechazado(): void
    {
        $this->usuarioAutenticado();

        $response = $this->getJson('/api/reniec/7263957');

        $response->assertStatus(422);
    }

    // ─────────────────────────────────────────────────────────────
    // CN-03  Clase invalida (largo) / valor limite superior: 9 digitos
    // Entrada: 726395761 ->  Salida esperada: 422 (validacion)
    // ─────────────────────────────────────────────────────────────
    public function test_cn03_dni_de_9_digitos_es_rechazado(): void
    {
        $this->usuarioAutenticado();

        $response = $this->getJson('/api/reniec/726395761');

        $response->assertStatus(422);
    }

    // ─────────────────────────────────────────────────────────────
    // CN-04  Clase invalida (no numerico): contiene letras
    // Entrada: 7263A576 ->  Salida esperada: 422 (validacion)
    // ─────────────────────────────────────────────────────────────
    public function test_cn04_dni_con_letras_es_rechazado(): void
    {
        $this->usuarioAutenticado();

        $response = $this->getJson('/api/reniec/7263A576');

        $response->assertStatus(422);
    }

    // ─────────────────────────────────────────────────────────────
    // CN-05  Login: credenciales validas  ->  200 + token
    // ─────────────────────────────────────────────────────────────
    public function test_cn05_login_con_credenciales_validas_devuelve_token(): void
    {
        Usuario::create([
            'nombre'   => 'Andy',
            'apellido' => 'Torres',
            'email'    => 'andy@optica.test',
            'password' => Hash::make('clave-correcta'),
            'rol'      => 'optometrista',
        ]);

        $response = $this->postJson('/api/login', [
            'email'    => 'andy@optica.test',
            'password' => 'clave-correcta',
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure(['token', 'usuario' => ['id', 'nombre', 'email', 'rol']]);
    }

    // ─────────────────────────────────────────────────────────────
    // CN-06  Login: password incorrecto  ->  401
    // ─────────────────────────────────────────────────────────────
    public function test_cn06_login_con_password_incorrecto_es_rechazado(): void
    {
        Usuario::create([
            'nombre'   => 'Andy',
            'apellido' => 'Torres',
            'email'    => 'andy@optica.test',
            'password' => Hash::make('clave-correcta'),
            'rol'      => 'optometrista',
        ]);

        $response = $this->postJson('/api/login', [
            'email'    => 'andy@optica.test',
            'password' => 'clave-equivocada',
        ]);

        $response->assertStatus(401);
    }

    // ─────────────────────────────────────────────────────────────
    // CN-07  Login: email no registrado  ->  401
    // ─────────────────────────────────────────────────────────────
    public function test_cn07_login_con_email_inexistente_es_rechazado(): void
    {
        $response = $this->postJson('/api/login', [
            'email'    => 'noexiste@optica.test',
            'password' => 'cualquier',
        ]);

        $response->assertStatus(401);
    }
}
