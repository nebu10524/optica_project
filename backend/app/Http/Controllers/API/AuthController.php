<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // POST /api/login -> inicia sesión y entrega un token
    public function login(Request $request)
    {
        // Validamos que lleguen email y contraseña
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required'
        ]);

        // Buscamos al usuario por su email
        $usuario = Usuario::where('email', $request->email)->first();

        // Si no existe o la contraseña no coincide, devolvemos error
        if (!$usuario || !Hash::check($request->password, $usuario->password)) {
            return response()->json([
                'message' => 'Credenciales incorrectas'
            ], 401);
        }

        // Creamos el token de acceso para este usuario
        $token = $usuario->createToken('auth_token')->plainTextToken;

        // Devolvemos el token y los datos básicos del usuario
        return response()->json([
            'token' => $token,
            'usuario' => [
                'id'     => $usuario->id,
                'nombre' => $usuario->nombre,
                'email'  => $usuario->email,
                'rol'    => $usuario->rol
            ]
        ]);
    }

    // POST /api/logout -> cierra la sesión
    public function logout(Request $request)
    {
        // Borramos el token actual para que deje de ser válido
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Sesión cerrada']);
    }

    // GET /api/me -> devuelve los datos del usuario autenticado
    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}
