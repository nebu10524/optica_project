<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Evaluacion;
use App\Models\HistorialRetina;
use App\Models\ImagenRetina;
use App\Models\Paciente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class PacienteController extends Controller
{
    public function index()
    {
        return response()->json(
            Paciente::orderBy('created_at', 'desc')->get()
        );
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