<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RecetaDetalle extends Model
{
    protected $table = 'receta_detalle';

    protected $fillable = [
        'receta_id', 'ojo', 'esfera', 'cilindro', 'eje', 'adicion', 'distancia_pupilar'
    ];

    public function receta()
    {
        return $this->belongsTo(Receta::class, 'receta_id');
    }
}
