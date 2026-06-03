<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AntecedenteMedico extends Model
{
    protected $table = 'antecedentes_medicos';

    protected $fillable = [
        'paciente_id', 'diabetes', 'hipertension', 'tiempo_diabetes', 'observaciones'
    ];

    protected $casts = [
        'diabetes'     => 'boolean',
        'hipertension' => 'boolean',
    ];

    public function paciente()
    {
        return $this->belongsTo(Paciente::class, 'paciente_id');
    }
}
