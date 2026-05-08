<?php

namespace Tests\Unit;

use Tests\TestCase;

class ApiSecurityMiddlewareTest extends TestCase
{
    public function test_pacientes_route_has_sanctum_middleware(): void
    {
        $route = collect(app('router')->getRoutes()->getRoutes())->first(
            fn ($r) => $r->uri() === 'api/pacientes' && in_array('GET', $r->methods(), true)
        );

        $this->assertNotNull($route);

        $middlewares = $route->gatherMiddleware();
        $this->assertContains('auth:sanctum', $middlewares);
    }

    public function test_me_route_has_sanctum_middleware(): void
    {
        $route = collect(app('router')->getRoutes()->getRoutes())->first(
            fn ($r) => $r->uri() === 'api/me' && in_array('GET', $r->methods(), true)
        );

        $this->assertNotNull($route);

        $middlewares = $route->gatherMiddleware();
        $this->assertContains('auth:sanctum', $middlewares);
    }
}
