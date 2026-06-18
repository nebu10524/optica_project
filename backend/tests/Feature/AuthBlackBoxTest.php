<?php

namespace Tests\Feature;

use App\Models\Usuario;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

/**
 * CAJA NEGRA - Modulo de Autenticacion y Usuarios.
 * Tecnica: particion de equivalencias sobre el registro de usuarios.
 */
class AuthBlackBoxTest extends TestCase
{
    use RefreshDatabase;

    // CN-08  Registro con datos validos -> 201
    public function test_cn08_registro_valido_crea_usuario(): void
    {
        $response = $this->postJson('/api/usuarios/registro', [
            'nombre'   => 'Nuevo',
            'apellido' => 'Usuario',
            'email'    => 'nuevo@optica.test',
            'password' => 'clave123',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('usuarios', ['email' => 'nuevo@optica.test']);
    }

    // CN-09  Registro con email duplicado -> 422
    public function test_cn09_registro_email_duplicado_es_rechazado(): void
    {
        Usuario::create([
            'nombre'   => 'Existente',
            'apellido' => 'Usuario',
            'email'    => 'repetido@optica.test',
            'password' => Hash::make('clave123'),
            'rol'      => 'optometrista',
        ]);

        $response = $this->postJson('/api/usuarios/registro', [
            'nombre'   => 'Otro',
            'apellido' => 'Usuario',
            'email'    => 'repetido@optica.test',
            'password' => 'clave123',
        ]);

        $response->assertStatus(422);
    }

    // CN-10  Registro con password corto (< 6) -> 422  (valor limite)
    public function test_cn10_registro_password_corto_es_rechazado(): void
    {
        $response = $this->postJson('/api/usuarios/registro', [
            'nombre'   => 'Nuevo',
            'apellido' => 'Usuario',
            'email'    => 'corto@optica.test',
            'password' => '123',
        ]);

        $response->assertStatus(422);
    }

    // CN-11  Registro con email invalido -> 422
    public function test_cn11_registro_email_invalido_es_rechazado(): void
    {
        $response = $this->postJson('/api/usuarios/registro', [
            'nombre'   => 'Nuevo',
            'apellido' => 'Usuario',
            'email'    => 'correo-malo',
            'password' => 'clave123',
        ]);

        $response->assertStatus(422);
    }

    // CN-12  Endpoint /me con sesion valida -> 200 con datos del usuario
    public function test_cn12_me_devuelve_usuario_autenticado(): void
    {
        $usuario = Usuario::create([
            'nombre'   => 'Logueado',
            'apellido' => 'Usuario',
            'email'    => 'logueado@optica.test',
            'password' => Hash::make('clave123'),
            'rol'      => 'optometrista',
        ]);
        Sanctum::actingAs($usuario, ['*']);

        $response = $this->getJson('/api/me');

        $response->assertStatus(200);
        $response->assertJsonPath('email', 'logueado@optica.test');
    }
}
