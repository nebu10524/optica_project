<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ModeloIa extends Model
{
    protected $table = 'modelos_ia';

    protected $fillable = ['nombre', 'proveedor', 'version', 'activo'];

    protected $casts = ['activo' => 'boolean'];
}
