<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Diagnostico extends Model
{
    protected $table = 'diagnosticos';

    protected $fillable = ['codigo', 'nombre', 'descripcion'];

    public function evaluaciones()
    {
        return $this->belongsToMany(Evaluacion::class, 'evaluacion_diagnostico', 'diagnostico_id', 'evaluacion_id')
            ->withPivot('clasificacion_rd_id', 'principal')
            ->withTimestamps();
    }
}
