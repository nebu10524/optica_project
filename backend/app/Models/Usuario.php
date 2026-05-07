<?php
namespace App\Models;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Usuario extends Authenticatable
{
    use HasApiTokens;

    protected $table = 'usuarios';
    protected $fillable = [
        'nombre', 'apellido', 'email', 'password', 'rol', 'activo'
    ];
    protected $hidden = ['password'];

    public function pacientes()
    {
        return $this->hasMany(Paciente::class, 'registrado_por');
    }

    public function evaluaciones()
    {
        return $this->hasMany(Evaluacion::class, 'usuario_id');
    }
}