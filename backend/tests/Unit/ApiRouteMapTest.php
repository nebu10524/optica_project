<?php

namespace Tests\Unit;

use Tests\TestCase;

class ApiRouteMapTest extends TestCase
{
    public function test_public_login_route_exists_with_post_method(): void
    {
        $route = collect(app('router')->getRoutes()->getRoutes())->first(
            fn ($r) => $r->uri() === 'api/login' && in_array('POST', $r->methods(), true)
        );

        $this->assertNotNull($route);
    }

    public function test_historial_delete_route_exists_with_delete_method(): void
    {
        $route = collect(app('router')->getRoutes()->getRoutes())->first(
            fn ($r) => $r->uri() === 'api/historial/{historial_id}' && in_array('DELETE', $r->methods(), true)
        );

        $this->assertNotNull($route);
    }
}
