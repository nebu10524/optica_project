<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Recordatorio extends Model
{
    protected $table = 'recordatorios';

    protected $fillable = ['cita_id', 'fecha_envio', 'canal', 'enviado'];

    protected $casts = [
        'fecha_envio' => 'datetime',
        'enviado'     => 'boolean',
    ];

    public function cita()
    {
        return $this->belongsTo(Cita::class, 'cita_id');
    }
}
