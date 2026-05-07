<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HistorialRetina extends Model
{
    protected $table = 'historial_retina';

    public $timestamps = false;

    protected $fillable = [
        'paciente_id',
        'evaluacion_id',
        'imagen_id',
        'clasificacion',
        'urgencia',
        'nivel_confianza',
        'observaciones_medico'
    ];

    public function paciente()
    {
        return $this->belongsTo(Paciente::class, 'paciente_id');
    }

    public function evaluacion()
    {
        return $this->belongsTo(Evaluacion::class, 'evaluacion_id');
    }

    public function imagen()
    {
        return $this->belongsTo(ImagenRetina::class, 'imagen_id');
    }
}