<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Receta extends Model
{
    protected $table = 'recetas';

    protected $fillable = [
        'paciente_id', 'usuario_id', 'evaluacion_id', 'tipo_lente_id',
        'material_lente_id', 'fecha_emision', 'vigencia_hasta', 'observaciones'
    ];

    protected $casts = [
        'fecha_emision'  => 'date',
        'vigencia_hasta' => 'date',
    ];

    public function paciente()
    {
        return $this->belongsTo(Paciente::class, 'paciente_id');
    }

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'usuario_id');
    }

    public function detalles()
    {
        return $this->hasMany(RecetaDetalle::class, 'receta_id');
    }

    public function tipoLente()
    {
        return $this->belongsTo(TipoLente::class, 'tipo_lente_id');
    }

    public function materialLente()
    {
        return $this->belongsTo(MaterialLente::class, 'material_lente_id');
    }

    public function tratamientos()
    {
        return $this->belongsToMany(TratamientoLente::class, 'receta_tratamiento', 'receta_id', 'tratamiento_lente_id')
            ->withTimestamps();
    }
}
