<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AnalisisIaLog extends Model
{
    protected $table = 'analisis_ia_log';

    protected $fillable = [
        'evaluacion_id', 'imagen_id', 'modelo_id', 'http_status', 'tiempo_ms',
        'tokens_entrada', 'tokens_salida', 'exito', 'mensaje_error'
    ];

    protected $casts = ['exito' => 'boolean'];

    public function modelo()
    {
        return $this->belongsTo(ModeloIa::class, 'modelo_id');
    }

    public function evaluacion()
    {
        return $this->belongsTo(Evaluacion::class, 'evaluacion_id');
    }
}
