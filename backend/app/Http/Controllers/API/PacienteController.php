<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Evaluacion;
use App\Models\HistorialRetina;
use App\Models\ImagenRetina;
use App\Models\Paciente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class PacienteController extends Controller
{
    // El DNI debe tener exactamente 8 dígitos
    private const DNI_REGEX = '/^\d{8}$/';

    // GET /api/pacientes -> lista todos los pacientes (del más nuevo al más antiguo)
    public function index()
    {
        return response()->json(
            Paciente::orderBy('created_at', 'desc')->get()
        );
    }

    /**
     * Consulta los datos de una persona por DNI en RENIEC (apisperu).
     * Devuelve los datos para mostrarlos antes de iniciar la evaluacion.
     */
    public function buscarReniec($dni)
    {
        // Si el DNI no tiene 8 dígitos, lo rechazamos
        if (!preg_match(self::DNI_REGEX, (string) $dni)) {
            return response()->json([
                'message' => 'El DNI debe tener exactamente 8 digitos.'
            ], 422);
        }

        // Vemos si el paciente ya está registrado y consultamos RENIEC
        $existente = Paciente::where('dni', $dni)->first();
        $data = $this->consultarReniec($dni);

        if ($data === null) {
            // Si RENIEC falla pero ya esta registrado localmente, usamos lo local.
            if ($existente) {
                return response()->json([
                    'dni'             => $dni,
                    'nombres'         => $existente->nombre,
                    'apellido'        => $existente->apellido,
                    'nombre_completo' => trim($existente->nombre . ' ' . $existente->apellido),
                    'ya_registrado'   => true,
                    'paciente_id'     => $existente->id,
                    'fuente'          => 'local',
                ]);
            }

            // Si no hay datos en RENIEC ni local, no se encontró nada
            return response()->json([
                'message' => 'No se encontro el DNI en RENIEC o el servicio no esta disponible.'
            ], 404);
        }

        // Armamos nombre y apellido con lo que devolvió RENIEC
        $nombres  = $data['nombres'] ?? '';
        $apellido = $this->apellidoDesdeReniec($data);

        return response()->json([
            'dni'             => $dni,
            'nombres'         => $nombres,
            'apellidoPaterno' => $data['apellidoPaterno'] ?? '',
            'apellidoMaterno' => $data['apellidoMaterno'] ?? '',
            'apellido'        => $apellido,
            'nombre_completo' => trim($nombres . ' ' . $apellido),
            'ya_registrado'   => (bool) $existente,
            'paciente_id'     => $existente?->id,
            'fuente'          => 'reniec',
        ]);
    }

    /**
     * Busca o crea un paciente a partir del DNI (datos de RENIEC) y lo devuelve.
     * Se usa justo antes de iniciar la evaluacion, sin formulario manual.
     */
    public function desdeDni(Request $request)
    {
        // Validamos el formato del DNI
        $request->validate([
            'dni' => ['required', 'string', 'regex:' . self::DNI_REGEX],
        ]);

        $dni = $request->dni;

        // Si el paciente ya existe, lo devolvemos sin volver a crearlo
        $paciente = Paciente::where('dni', $dni)->first();
        if ($paciente) {
            return response()->json($paciente);
        }

        // Consultamos RENIEC; si no responde, error
        $data = $this->consultarReniec($dni);
        if ($data === null) {
            return response()->json([
                'message' => 'No se pudieron obtener los datos del DNI en RENIEC.'
            ], 404);
        }

        // Preparamos los nombres y apellidos obtenidos
        $nombres  = trim($data['nombres'] ?? '');
        $apellido = $this->apellidoDesdeReniec($data);

        // Creamos el paciente con los datos de RENIEC
        $paciente = Paciente::create([
            'nombre'         => $nombres !== '' ? $nombres : 'Sin nombre',
            'apellido'       => $apellido !== '' ? $apellido : 'N/D',
            'dni'            => $dni,
            'registrado_por' => $request->user()->id,
        ]);

        return response()->json($paciente, 201);
    }

    /**
     * Construye el apellido completo (paterno + materno) desde la respuesta de RENIEC.
     */
    private function apellidoDesdeReniec(array $data): string
    {
        return trim(($data['apellidoPaterno'] ?? '') . ' ' . ($data['apellidoMaterno'] ?? ''));
    }

    /**
     * Llama a la API de apisperu para consultar un DNI.
     * Retorna el arreglo de datos si tuvo exito, o null en caso contrario.
     */
    private function consultarReniec(string $dni): ?array
    {
        // Leemos el token y la URL de la API desde la configuración
        $token = config('services.apisperu.token');
        $baseUrl = rtrim(config('services.apisperu.dni_url'), '/');

        // Sin token no podemos consultar
        if (empty($token)) {
            return null;
        }

        // Llamamos a la API (si falla la conexión, devolvemos null)
        try {
            $response = Http::timeout(15)->get("{$baseUrl}/{$dni}", [
                'token' => $token,
            ]);
        } catch (\Throwable $e) {
            return null;
        }

        // Si la respuesta no fue exitosa, null
        if (!$response->successful()) {
            return null;
        }

        $data = $response->json();

        // Si la respuesta no trae datos válidos, null
        if (!is_array($data) || empty($data['success'])) {
            return null;
        }

        return $data;
    }

    // POST /api/pacientes -> crea un paciente con formulario manual
    public function store(Request $request)
    {
        // Validamos los datos del paciente
        $request->validate([
            'nombre'           => 'required|string|max:100',
            'apellido'         => 'required|string|max:100',
            'dni'              => 'nullable|string|max:20|unique:pacientes,dni',
            'fecha_nacimiento' => 'nullable|date',
            'genero'           => 'nullable|in:M,F,otro',
            'telefono'         => 'nullable|string|max:20',
            'email'            => 'nullable|email|max:150|unique:pacientes,email',
            'direccion'        => 'nullable|string',
        ]);

        // Creamos el paciente
        $paciente = Paciente::create([
            'nombre'           => $request->nombre,
            'apellido'         => $request->apellido,
            'dni'              => $request->dni,
            'fecha_nacimiento' => $request->fecha_nacimiento,
            'genero'           => $request->genero,
            'telefono'         => $request->telefono,
            'email'            => $request->email,
            'direccion'        => $request->direccion,
            'registrado_por'   => $request->user()->id,
        ]);

        return response()->json($paciente, 201);
    }

    // GET /api/pacientes/{id} -> muestra un paciente con todos sus datos relacionados
    public function show($id)
    {
        // Traemos el paciente junto con sus evaluaciones, imágenes e historial
        $paciente = Paciente::with([
            'evaluaciones.imagenesRetina',
            'evaluaciones.historialRetina',
            'imagenesRetina',
            'historialRetina',
        ])->findOrFail($id);

        return response()->json($paciente);
    }

    // PUT /api/pacientes/{id} -> actualiza los datos de un paciente
    public function update(Request $request, $id)
    {
        // Si el paciente no existe, lanza 404 automáticamente
        $paciente = Paciente::findOrFail($id);

        // Validamos los campos que se quieran modificar
        $request->validate([
            'nombre'           => 'sometimes|required|string|max:100',
            'apellido'         => 'sometimes|required|string|max:100',
            'dni'              => 'nullable|string|max:20|unique:pacientes,dni,' . $paciente->id,
            'fecha_nacimiento' => 'nullable|date',
            'genero'           => 'nullable|in:M,F,otro',
            'telefono'         => 'nullable|string|max:20',
            'email'            => 'nullable|email|max:150|unique:pacientes,email,' . $paciente->id,
            'direccion'        => 'nullable|string',
        ]);

        // Solo actualizamos los campos permitidos
        $paciente->update($request->only([
            'nombre',
            'apellido',
            'dni',
            'fecha_nacimiento',
            'genero',
            'telefono',
            'email',
            'direccion',
        ]));

        return response()->json($paciente);
    }

    // DELETE /api/pacientes/{id} -> elimina al paciente y todo lo relacionado
    public function destroy($id)
    {
        $paciente = Paciente::findOrFail($id);

        // Hacemos todo dentro de una transacción para no dejar datos a medias
        DB::transaction(function () use ($paciente) {
            // Borramos primero los archivos de imagen guardados en disco
            $imagenes = ImagenRetina::where('paciente_id', $paciente->id)->get();

            foreach ($imagenes as $imagen) {
                if (!empty($imagen->ruta_imagen) && Storage::disk('public')->exists($imagen->ruta_imagen)) {
                    Storage::disk('public')->delete($imagen->ruta_imagen);
                }
            }

            // Luego borramos los registros de la base de datos
            HistorialRetina::where('paciente_id', $paciente->id)->delete();
            ImagenRetina::where('paciente_id', $paciente->id)->delete();
            Evaluacion::where('paciente_id', $paciente->id)->delete();
            $paciente->delete();
        });

        return response()->json([
            'message' => 'Paciente eliminado correctamente'
        ]);
    }
}
