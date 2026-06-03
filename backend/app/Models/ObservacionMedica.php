<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ObservacionMedica extends Model
{
    protected $table = 'observaciones_medicas';

    protected $fillable = ['evaluacion_id', 'usuario_id', 'texto'];

    public function evaluacion()
    {
        return $this->belongsTo(Evaluacion::class, 'evaluacion_id');
    }

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'usuario_id');
    }
}
