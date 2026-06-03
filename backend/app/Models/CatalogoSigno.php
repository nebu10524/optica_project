<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CatalogoSigno extends Model
{
    protected $table = 'catalogo_signos';

    protected $fillable = ['codigo', 'nombre', 'descripcion'];

    public function evaluaciones()
    {
        return $this->belongsToMany(Evaluacion::class, 'evaluacion_signo', 'signo_id', 'evaluacion_id')
            ->withPivot('presente')
            ->withTimestamps();
    }
}
