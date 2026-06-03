<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AntecedenteOftalmologico extends Model
{
    protected $table = 'antecedentes_oftalmologicos';

    protected $fillable = [
        'paciente_id', 'usa_lentes', 'cirugia_ocular', 'glaucoma', 'observaciones'
    ];

    protected $casts = [
        'usa_lentes'     => 'boolean',
        'cirugia_ocular' => 'boolean',
        'glaucoma'       => 'boolean',
    ];

    public function paciente()
    {
        return $this->belongsTo(Paciente::class, 'paciente_id');
    }
}
