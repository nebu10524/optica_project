<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MaterialLente extends Model
{
    protected $table = 'materiales_lente';

    protected $fillable = ['nombre', 'indice_refraccion'];
}
