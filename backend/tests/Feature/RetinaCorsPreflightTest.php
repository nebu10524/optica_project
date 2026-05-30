<?php

namespace Tests\Feature;

use Tests\TestCase;

class RetinaCorsPreflightTest extends TestCase
{
    public function test_retina_preflight_returns_expected_cors_headers(): void
    {
        $response = $this->call('OPTIONS', '/api/retina/analizar', [], [], [], [
            'HTTP_ORIGIN' => 'http://localhost:5173',
        ]);

        $response->assertStatus(204);
        $response->assertHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
        $response->assertHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        $response->assertHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }
}
