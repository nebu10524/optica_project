<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cita extends Model
{
    protected $table = 'citas';

    protected $fillable = [
        'paciente_id', 'usuario_id', 'sede_id', 'consultorio_id',
        'estado_cita_id', 'especialidad_id', 'fecha_hora', 'duracion_min', 'motivo'
    ];

    protected $casts = ['fecha_hora' => 'datetime'];

    public function paciente()
    {
        return $this->belongsTo(Paciente::class, 'paciente_id');
    }

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'usuario_id');
    }

    public function estado()
    {
        return $this->belongsTo(EstadoCita::class, 'estado_cita_id');
    }

    public function sede()
    {
        return $this->belongsTo(Sede::class, 'sede_id');
    }

    public function recordatorios()
    {
        return $this->hasMany(Recordatorio::class, 'cita_id');
    }
}
