<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Evaluacion;
use App\Models\ImagenRetina;
use App\Models\HistorialRetina;

class EvaluacionController extends Controller
{
    // Crear nueva evaluación
    public function store(Request $request)
    {
        $request->validate([
            'paciente_id'   => 'required|integer|exists:pacientes,id',
            'observaciones' => 'nullable|string',
        ]);

        $evaluacion = Evaluacion::create([
            'paciente_id'   => $request->paciente_id,
            'usuario_id'    => auth('sanctum')->id() ?? 1,
            'observaciones' => $request->observaciones,
        ]);

        return response()->json([
            'message'    => 'Evaluación creada correctamente',
            'evaluacion' => $evaluacion,
        ], 201);
    }

    // Ver una evaluación con sus imágenes
    public function show($id)
    {
        $evaluacion = Evaluacion::with([
            'imagenesRetina',
            'historialRetina',
            'paciente',
        ])->find($id);

        if (!$evaluacion) {
            return response()->json([
                'message' => 'Evaluación no encontrada',
            ], 404);
        }

        return response()->json($evaluacion);
    }

    // Marcar evaluación como completada agregando observaciones
    public function completar(Request $request, $id)
    {
        $request->validate([
            'observaciones' => 'required|string',
        ]);

        $evaluacion = Evaluacion::find($id);

        if (!$evaluacion) {
            return response()->json([
                'message' => 'Evaluación no encontrada',
            ], 404);
        }

        $evaluacion->update([
            'observaciones' => $request->observaciones,
        ]);

        return response()->json([
            'message'    => 'Evaluación completada correctamente',
            'evaluacion' => $evaluacion,
        ]);
    }
}