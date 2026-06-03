<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sede extends Model
{
    protected $table = 'sedes';

    protected $fillable = [
        'nombre', 'direccion', 'distrito', 'ciudad', 'telefono', 'email', 'activo'
    ];

    protected $casts = ['activo' => 'boolean'];

    public function consultorios()
    {
        return $this->hasMany(Consultorio::class, 'sede_id');
    }

    public function citas()
    {
        return $this->hasMany(Cita::class, 'sede_id');
    }
}
