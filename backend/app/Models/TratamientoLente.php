<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TratamientoLente extends Model
{
    protected $table = 'tratamientos_lente';

    protected $fillable = ['nombre', 'descripcion'];
}
