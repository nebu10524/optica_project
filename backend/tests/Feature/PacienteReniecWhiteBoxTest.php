<?php

namespace Tests\Feature;

use App\Models\Paciente;
use App\Models\Usuario;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

/**
 * PRUEBAS DE CAJA BLANCA (White-box).
 *
 * Se conoce el codigo interno de PacienteController (buscarReniec, desdeDni y
 * el metodo privado consultarReniec). Los casos se disenan para recorrer cada
 * RAMA/DECISION del codigo (cobertura de decisiones):
 *
 *   consultarReniec():
 *     R1  token vacio                 -> retorna null
 *     R2  respuesta HTTP no exitosa   -> retorna null
 *     R3  respuesta sin 'success'     -> retorna null
 *     R4  respuesta con success=true  -> retorna datos
 *
 *   buscarReniec():
 *     R5  DNI no cumple el regex      -> 422
 *     R6  data null + paciente local  -> 200 fuente=local
 *     R7  data null + sin paciente    -> 404
 *     R8  data ok + sin paciente      -> 200 ya_registrado=false
 *     R9  data ok + paciente local    -> 200 ya_registrado=true
 *
 *   desdeDni():
 *     R10 DNI no cumple el regex      -> 422
 *     R11 paciente ya existe          -> 200 sin crear duplicado
 *     R12 data null                   -> 404
 *     R13 paciente nuevo              -> 201 y se persiste
 */
class PacienteReniecWhiteBoxTest extends TestCase
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

        config(['services.apisperu.dni_url' => 'https://reniec.test/api/v1/dni']);
        config(['services.apisperu.token' => 'token-de-prueba']);
    }

    private function fakeReniec(array $body, int $status = 200): void
    {
        Http::fake(['reniec.test/*' => Http::response($body, $status)]);
    }

    private function reniecOk(): array
    {
        return [
            'success'         => true,
            'nombres'         => 'MARIA LUISA',
            'apellidoPaterno' => 'ROJAS',
            'apellidoMaterno' => 'DIAZ',
        ];
    }

    // R1 (consultarReniec): token vacio -> null -> sin paciente local da 404
    public function test_r1_token_vacio_no_consulta_y_responde_404(): void
    {
        config(['services.apisperu.token' => '']);

        $response = $this->getJson('/api/reniec/12345678');

        $response->assertStatus(404);
        Http::assertNothingSent();
    }

    // R2 (consultarReniec): respuesta HTTP no exitosa (500) -> null -> 404
    public function test_r2_respuesta_http_no_exitosa_responde_404(): void
    {
        $this->fakeReniec(['error' => 'server'], 500);

        $response = $this->getJson('/api/reniec/12345678');

        $response->assertStatus(404);
    }

    // R3 (consultarReniec): respuesta sin success -> null -> 404
    public function test_r3_respuesta_sin_success_responde_404(): void
    {
        $this->fakeReniec(['success' => false, 'message' => 'no encontrado'], 200);

        $response = $this->getJson('/api/reniec/12345678');

        $response->assertStatus(404);
    }

    // R4 + R8 (consultarReniec success + buscarReniec sin paciente local)
    public function test_r4_r8_data_ok_sin_paciente_local_devuelve_reniec(): void
    {
        $this->fakeReniec($this->reniecOk());

        $response = $this->getJson('/api/reniec/12345678');

        $response->assertStatus(200);
        $response->assertJsonPath('fuente', 'reniec');
        $response->assertJsonPath('ya_registrado', false);
        $response->assertJsonPath('nombre_completo', 'MARIA LUISA ROJAS DIAZ');
    }

    // R6 (buscarReniec): data null + paciente local -> usa datos locales
    public function test_r6_reniec_caido_con_paciente_local_usa_datos_locales(): void
    {
        Paciente::create([
            'nombre'         => 'PEDRO',
            'apellido'       => 'SUAREZ',
            'dni'            => '87654321',
            'registrado_por' => $this->usuario->id,
        ]);
        $this->fakeReniec(['error' => 'down'], 500);

        $response = $this->getJson('/api/reniec/87654321');

        $response->assertStatus(200);
        $response->assertJsonPath('fuente', 'local');
        $response->assertJsonPath('ya_registrado', true);
    }

    // R9 (buscarReniec): data ok + paciente local -> ya_registrado true
    public function test_r9_data_ok_con_paciente_local_marca_ya_registrado(): void
    {
        $paciente = Paciente::create([
            'nombre'         => 'MARIA LUISA',
            'apellido'       => 'ROJAS DIAZ',
            'dni'            => '12345678',
            'registrado_por' => $this->usuario->id,
        ]);
        $this->fakeReniec($this->reniecOk());

        $response = $this->getJson('/api/reniec/12345678');

        $response->assertStatus(200);
        $response->assertJsonPath('ya_registrado', true);
        $response->assertJsonPath('paciente_id', $paciente->id);
    }

    // R5 (buscarReniec): DNI no cumple regex -> 422
    public function test_r5_dni_invalido_en_busqueda_responde_422(): void
    {
        $response = $this->getJson('/api/reniec/abc');

        $response->assertStatus(422);
    }

    // R10 (desdeDni): DNI invalido -> 422
    public function test_r10_desde_dni_invalido_responde_422(): void
    {
        $response = $this->postJson('/api/pacientes/desde-dni', ['dni' => '123']);

        $response->assertStatus(422);
    }

    // R11 (desdeDni): paciente ya existe -> 200 y NO crea duplicado
    public function test_r11_desde_dni_existente_no_duplica(): void
    {
        $paciente = Paciente::create([
            'nombre'         => 'LUIS',
            'apellido'       => 'MENDOZA',
            'dni'            => '11112222',
            'registrado_por' => $this->usuario->id,
        ]);

        $response = $this->postJson('/api/pacientes/desde-dni', ['dni' => '11112222']);

        $response->assertStatus(200);
        $response->assertJsonPath('id', $paciente->id);
        $this->assertSame(1, Paciente::where('dni', '11112222')->count());
    }

    // R12 (desdeDni): data null (RENIEC sin datos) -> 404
    public function test_r12_desde_dni_sin_datos_reniec_responde_404(): void
    {
        $this->fakeReniec(['success' => false], 200);

        $response = $this->postJson('/api/pacientes/desde-dni', ['dni' => '33334444']);

        $response->assertStatus(404);
        $this->assertSame(0, Paciente::where('dni', '33334444')->count());
    }

    // R13 (desdeDni): paciente nuevo -> 201 y se persiste con datos de RENIEC
    public function test_r13_desde_dni_crea_paciente_nuevo(): void
    {
        $this->fakeReniec($this->reniecOk());

        $response = $this->postJson('/api/pacientes/desde-dni', ['dni' => '55556666']);

        $response->assertStatus(201);
        $this->assertDatabaseHas('pacientes', [
            'dni'      => '55556666',
            'nombre'   => 'MARIA LUISA',
            'apellido' => 'ROJAS DIAZ',
        ]);
    }
}
