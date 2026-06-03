<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PresionIntraocular extends Model
{
    protected $table = 'presion_intraocular';

    protected $fillable = [
        'paciente_id', 'evaluacion_id', 'ojo', 'valor_mmhg', 'metodo'
    ];

    public function paciente()
    {
        return $this->belongsTo(Paciente::class, 'paciente_id');
    }
}
