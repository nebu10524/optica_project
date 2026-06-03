<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Medicamento extends Model
{
    protected $table = 'medicamentos';

    protected $fillable = ['nombre', 'presentacion'];

    public function pacientes()
    {
        return $this->belongsToMany(Paciente::class, 'paciente_medicamento', 'medicamento_id', 'paciente_id')
            ->withPivot('dosis', 'frecuencia')
            ->withTimestamps();
    }
}
