<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ImagenRetina extends Model
{
    protected $table = 'imagenes_retina';

    protected $fillable = [
        'evaluacion_id',
        'paciente_id',
        'ruta_imagen',
        'nombre_archivo',
        'mime_type',
        'imagen_base64',
        'clasificacion',
        'nivel_confianza',
        'urgencia',
        'hallazgos',
        'signos_rd',
        'recomendacion',
        'modelo_ia'
    ];

    protected $casts = [
        'hallazgos' => 'array',
        'signos_rd' => 'array',
    ];
}