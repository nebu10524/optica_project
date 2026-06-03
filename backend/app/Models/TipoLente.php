<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TipoLente extends Model
{
    protected $table = 'tipos_lente';

    protected $fillable = ['nombre', 'descripcion'];
}
