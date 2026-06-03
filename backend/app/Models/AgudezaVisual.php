<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AgudezaVisual extends Model
{
    protected $table = 'agudeza_visual';

    protected $fillable = [
        'paciente_id', 'evaluacion_id', 'ojo', 'valor', 'con_correccion'
    ];

    protected $casts = ['con_correccion' => 'boolean'];

    public function paciente()
    {
        return $this->belongsTo(Paciente::class, 'paciente_id');
    }
}
