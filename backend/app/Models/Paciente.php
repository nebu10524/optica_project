<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Paciente extends Model
{
    protected $table = 'pacientes';

    protected $fillable = [
        'nombre',
        'apellido',
        'dni',
        'fecha_nacimiento',
        'genero',
        'telefono',
        'email',
        'direccion',
        'registrado_por'
    ];

    public function evaluaciones()
    {
        return $this->hasMany(Evaluacion::class, 'paciente_id');
    }

    public function imagenesRetina()
    {
        return $this->hasMany(ImagenRetina::class, 'paciente_id');
    }

    public function historialRetina()
    {
        return $this->hasMany(HistorialRetina::class, 'paciente_id');
    }

    public function antecedenteMedico()
    {
        return $this->hasOne(AntecedenteMedico::class, 'paciente_id');
    }

    public function antecedenteOftalmologico()
    {
        return $this->hasOne(AntecedenteOftalmologico::class, 'paciente_id');
    }

    public function alergias()
    {
        return $this->belongsToMany(Alergia::class, 'paciente_alergia', 'paciente_id', 'alergia_id')
            ->withPivot('severidad')
            ->withTimestamps();
    }

    public function medicamentos()
    {
        return $this->belongsToMany(Medicamento::class, 'paciente_medicamento', 'paciente_id', 'medicamento_id')
            ->withPivot('dosis', 'frecuencia')
            ->withTimestamps();
    }

    public function agudezaVisual()
    {
        return $this->hasMany(AgudezaVisual::class, 'paciente_id');
    }

    public function medidasRefraccion()
    {
        return $this->hasMany(MedidaRefraccion::class, 'paciente_id');
    }

    public function recetas()
    {
        return $this->hasMany(Receta::class, 'paciente_id');
    }

    public function citas()
    {
        return $this->hasMany(Cita::class, 'paciente_id');
    }
}
