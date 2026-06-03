<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClasificacionRd extends Model
{
    protected $table = 'clasificaciones_rd';

    protected $fillable = ['codigo', 'nombre', 'color_hex', 'orden', 'descripcion'];
}
