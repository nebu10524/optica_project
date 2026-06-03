<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\PacienteController;
use App\Http\Controllers\API\EvaluacionController;
use App\Http\Controllers\API\HistorialController;
use App\Http\Controllers\API\UsuarioController;
use App\Http\Controllers\API\RetinaController;

// ── Preflight CORS para retina ─────────────────────
Route::options('/retina/analizar', function() {
    $allowedOrigins = config('cors.allowed_origins', []);
    $origin = request()->headers->get('Origin');
    $allowedOrigin = in_array($origin, $allowedOrigins, true)
        ? $origin
        : ($allowedOrigins[0] ?? 'http://localhost:5173');

    return response('', 204)
        ->header('Access-Control-Allow-Origin', $allowedOrigin)
        ->header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
});

// ── Rutas públicas (sin token) ─────────────────────
Route::post('/login',             [AuthController::class,  'login']);
Route::post('/usuarios/registro', [UsuarioController::class, 'registro']);

// ── Rutas protegidas (requieren token) ─────────────
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);

    // Pacientes
    $rutaPacientes = '/pacientes';
    $rutaPaciente = $rutaPacientes . '/{id}';
    Route::get($rutaPacientes,     [PacienteController::class, 'index']);
    Route::post($rutaPacientes,    [PacienteController::class, 'store']);
    // Busqueda por DNI (RENIEC) y alta automatica sin formulario
    Route::get('/reniec/{dni}',           [PacienteController::class, 'buscarReniec']);
    Route::post('/pacientes/desde-dni',   [PacienteController::class, 'desdeDni']);
    Route::get($rutaPaciente,      [PacienteController::class, 'show']);
    Route::put($rutaPaciente,      [PacienteController::class, 'update']);
    Route::delete($rutaPaciente,   [PacienteController::class, 'destroy']);

    // Evaluaciones
    Route::post('/evaluaciones',               [EvaluacionController::class, 'store']);
    Route::get('/evaluaciones/{id}',           [EvaluacionController::class, 'show']);
    Route::put('/evaluaciones/{id}/completar', [EvaluacionController::class, 'completar']);

    // Historial
    Route::get('/historial/paciente/{paciente_id}/pdf', [HistorialController::class, 'descargarPdfPaciente']);
    Route::get('/historial/{paciente_id}', [HistorialController::class, 'porPaciente']);
    Route::get('/historial/{historial_id}/imagen', [HistorialController::class, 'obtenerImagen']);
    Route::get('/historial/{historial_id}/pdf', [HistorialController::class, 'descargarPdf']);
    Route::delete('/historial/{historial_id}', [HistorialController::class, 'destroy']);

    // IA - Análisis de Retina
    Route::post('/retina/analizar', [RetinaController::class, 'analizar']);
});
