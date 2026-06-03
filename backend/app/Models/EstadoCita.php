<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EstadoCita extends Model
{
    protected $table = 'estados_cita';

    protected $fillable = ['codigo', 'nombre', 'color_hex'];

    public function citas()
    {
        return $this->hasMany(Cita::class, 'estado_cita_id');
    }
}
