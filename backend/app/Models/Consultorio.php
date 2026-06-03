<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Consultorio extends Model
{
    protected $table = 'consultorios';

    protected $fillable = ['sede_id', 'nombre', 'piso', 'activo'];

    protected $casts = ['activo' => 'boolean'];

    public function sede()
    {
        return $this->belongsTo(Sede::class, 'sede_id');
    }
}
