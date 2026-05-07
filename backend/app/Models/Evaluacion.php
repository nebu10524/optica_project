<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Evaluacion extends Model
{
    protected $table = 'evaluaciones_retina';

    protected $fillable = [
        'paciente_id',
        'usuario_id',
        'observaciones'
    ];

    public function paciente()
    {
        return $this->belongsTo(Paciente::class, 'paciente_id');
    }

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'usuario_id');
    }

    public function imagenesRetina()
    {
        return $this->hasMany(ImagenRetina::class, 'evaluacion_id');
    }

    public function historialRetina()
    {
        return $this->hasMany(HistorialRetina::class, 'evaluacion_id');
    }
}