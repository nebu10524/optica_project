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

    public function signos()
    {
        return $this->belongsToMany(CatalogoSigno::class, 'evaluacion_signo', 'evaluacion_id', 'signo_id')
            ->withPivot('presente')
            ->withTimestamps();
    }

    public function diagnosticos()
    {
        return $this->belongsToMany(Diagnostico::class, 'evaluacion_diagnostico', 'evaluacion_id', 'diagnostico_id')
            ->withPivot('clasificacion_rd_id', 'principal')
            ->withTimestamps();
    }

    public function hallazgos()
    {
        return $this->hasMany(Hallazgo::class, 'evaluacion_id');
    }

    public function recomendaciones()
    {
        return $this->hasMany(Recomendacion::class, 'evaluacion_id');
    }

    public function observacionesMedicas()
    {
        return $this->hasMany(ObservacionMedica::class, 'evaluacion_id');
    }

    public function analisisIaLogs()
    {
        return $this->hasMany(AnalisisIaLog::class, 'evaluacion_id');
    }
}
