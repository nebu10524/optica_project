<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Evaluacion;

class EvaluacionController extends Controller
{
    // Crear nueva evaluación
    public function store(Request $request)
    {
        // Validamos que el paciente exista
        $request->validate([
            'paciente_id'   => 'required|integer|exists:pacientes,id',
            'observaciones' => 'nullable|string',
        ]);

        // Guardamos la evaluación a nombre del usuario que la registra
        $evaluacion = Evaluacion::create([
            'paciente_id'   => $request->paciente_id,
            'usuario_id'    => $request->user()->id,
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
        // Buscamos la evaluación junto con sus imágenes, historial y paciente
        $evaluacion = Evaluacion::with([
            'imagenesRetina',
            'historialRetina',
            'paciente',
        ])->find($id);

        // Si no existe, devolvemos 404
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
        // Las observaciones son obligatorias para completar
        $request->validate([
            'observaciones' => 'required|string',
        ]);

        // Buscamos la evaluación
        $evaluacion = Evaluacion::find($id);

        // Si no existe, devolvemos 404
        if (!$evaluacion) {
            return response()->json([
                'message' => 'Evaluación no encontrada',
            ], 404);
        }

        // Actualizamos las observaciones
        $evaluacion->update([
            'observaciones' => $request->observaciones,
        ]);

        return response()->json([
            'message'    => 'Evaluación completada correctamente',
            'evaluacion' => $evaluacion,
        ]);
    }
}
