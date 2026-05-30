<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Paciente extends Model
{
    protected $table = 'pacientes';

    protected $fillable = [
        'nombre',
        'apellido',
        'dni',
        'fecha_nacimiento',
        'genero',
        'telefono',
        'email',
        'direccion',
        'registrado_por'
    ];

    public function evaluaciones()
    {
        return $this->hasMany(Evaluacion::class, 'paciente_id');
    }

    public function imagenesRetina()
    {
        return $this->hasMany(ImagenRetina::class, 'paciente_id');
    }

    public function historialRetina()
    {
        return $this->hasMany(HistorialRetina::class, 'paciente_id');
    }
}
