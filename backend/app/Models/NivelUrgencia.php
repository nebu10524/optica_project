<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NivelUrgencia extends Model
{
    protected $table = 'niveles_urgencia';

    protected $fillable = ['codigo', 'nombre', 'color_hex', 'dias_sugeridos'];
}
