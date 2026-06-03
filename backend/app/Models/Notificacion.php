<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notificacion extends Model
{
    protected $table = 'notificaciones';

    protected $fillable = [
        'usuario_id', 'titulo', 'mensaje', 'tipo', 'leida', 'leida_en'
    ];

    protected $casts = [
        'leida'    => 'boolean',
        'leida_en' => 'datetime',
    ];

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'usuario_id');
    }
}
