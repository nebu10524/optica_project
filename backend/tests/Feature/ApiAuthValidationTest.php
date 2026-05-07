<?php

namespace Tests\Feature;

use Tests\TestCase;

class ApiAuthValidationTest extends TestCase
{
    public function test_login_requires_email_and_password(): void
    {
        $response = $this->postJson('/api/login', []);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['email', 'password']);
    }

    public function test_login_requires_valid_email_format(): void
    {
        $response = $this->postJson('/api/login', [
            'email' => 'correo-invalido',
            'password' => '123456',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['email']);
    }
}
