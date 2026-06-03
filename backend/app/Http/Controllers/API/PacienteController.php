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
    private const DNI_REGEX = '/^\d{8}$/';

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
        if (!preg_match(self::DNI_REGEX, (string) $dni)) {
            return response()->json([
                'message' => 'El DNI debe tener exactamente 8 digitos.'
            ], 422);
        }

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

            return response()->json([
                'message' => 'No se encontro el DNI en RENIEC o el servicio no esta disponible.'
            ], 404);
        }

        $nombres  = $data['nombres'] ?? '';
        $apellido = trim(($data['apellidoPaterno'] ?? '') . ' ' . ($data['apellidoMaterno'] ?? ''));

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
        $request->validate([
            'dni' => ['required', 'string', 'regex:' . self::DNI_REGEX],
        ]);

        $dni = $request->dni;

        $paciente = Paciente::where('dni', $dni)->first();
        if ($paciente) {
            return response()->json($paciente);
        }

        $data = $this->consultarReniec($dni);
        if ($data === null) {
            return response()->json([
                'message' => 'No se pudieron obtener los datos del DNI en RENIEC.'
            ], 404);
        }

        $nombres  = trim($data['nombres'] ?? '');
        $apellido = trim(($data['apellidoPaterno'] ?? '') . ' ' . ($data['apellidoMaterno'] ?? ''));

        $paciente = Paciente::create([
            'nombre'         => $nombres !== '' ? $nombres : 'Sin nombre',
            'apellido'       => $apellido !== '' ? $apellido : 'N/D',
            'dni'            => $dni,
            'registrado_por' => $request->user()->id,
        ]);

        return response()->json($paciente, 201);
    }

    /**
     * Llama a la API de apisperu para consultar un DNI.
     * Retorna el arreglo de datos si tuvo exito, o null en caso contrario.
     */
    private function consultarReniec(string $dni): ?array
    {
        $token = config('services.apisperu.token');
        $baseUrl = rtrim(config('services.apisperu.dni_url'), '/');

        if (empty($token)) {
            return null;
        }

        try {
            $response = Http::timeout(15)->get("{$baseUrl}/{$dni}", [
                'token' => $token,
            ]);
        } catch (\Throwable $e) {
            return null;
        }

        if (!$response->successful()) {
            return null;
        }

        $data = $response->json();

        if (!is_array($data) || empty($data['success'])) {
            return null;
        }

        return $data;
    }

    public function store(Request $request)
    {
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

    public function show($id)
    {
        $paciente = Paciente::with([
            'evaluaciones.imagenesRetina',
            'evaluaciones.historialRetina',
            'imagenesRetina',
            'historialRetina',
        ])->findOrFail($id);

        return response()->json($paciente);
    }

    public function update(Request $request, $id)
    {
        $paciente = Paciente::findOrFail($id);

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

    public function destroy($id)
    {
        $paciente = Paciente::findOrFail($id);

        DB::transaction(function () use ($paciente) {
            $imagenes = ImagenRetina::where('paciente_id', $paciente->id)->get();

            foreach ($imagenes as $imagen) {
                if (!empty($imagen->ruta_imagen) && Storage::disk('public')->exists($imagen->ruta_imagen)) {
                    Storage::disk('public')->delete($imagen->ruta_imagen);
                }
            }

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
