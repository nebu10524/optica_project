<?php

namespace Tests\Feature;

use Tests\TestCase;

class ApiProtectedRoutesTest extends TestCase
{
    public function test_me_route_requires_authentication(): void
    {
        $response = $this->getJson('/api/me');

        $response->assertStatus(401);
    }

    public function test_pacientes_route_requires_authentication(): void
    {
        $response = $this->getJson('/api/pacientes');

        $response->assertStatus(401);
    }

    public function test_historial_route_requires_authentication(): void
    {
        $response = $this->getJson('/api/historial/1');

        $response->assertStatus(401);
    }
}
