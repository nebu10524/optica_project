<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UsuarioController extends Controller
{
    // POST /api/usuarios/registro -> crea un nuevo usuario
    public function registro(Request $request)
    {
        // Validamos los datos del formulario de registro
        $request->validate([
            'nombre'   => 'required|string|max:100',
            'apellido' => 'required|string|max:100',
            'email'    => 'required|email|unique:usuarios,email',
            'password' => 'required|min:6',
        ]);

        // Creamos el usuario (la contraseña se guarda encriptada)
        $usuario = Usuario::create([
            'nombre'   => $request->nombre,
            'apellido' => $request->apellido,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'rol'      => 'optometrista',
            'activo'   => 1,
        ]);

        // Devolvemos el usuario creado
        return response()->json([
            'message' => 'Usuario registrado correctamente',
            'usuario' => [
                'id'       => $usuario->id,
                'nombre'   => $usuario->nombre,
                'apellido' => $usuario->apellido,
                'email'    => $usuario->email,
                'rol'      => $usuario->rol,
            ]
        ], 201);
    }
}
