<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MedidaRefraccion extends Model
{
    protected $table = 'medidas_refraccion';

    protected $fillable = [
        'paciente_id', 'evaluacion_id', 'ojo', 'esfera', 'cilindro',
        'eje', 'adicion', 'distancia_pupilar'
    ];

    public function paciente()
    {
        return $this->belongsTo(Paciente::class, 'paciente_id');
    }
}
