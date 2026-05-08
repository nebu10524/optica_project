<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('historial_retina', function (Blueprint $table) {
            $table->id();
            $table->foreignId('paciente_id')->constrained('pacientes')->cascadeOnDelete();
            $table->foreignId('evaluacion_id')->constrained('evaluaciones_retina')->cascadeOnDelete();
            $table->foreignId('imagen_id')->constrained('imagenes_retina')->cascadeOnDelete();
            $table->string('clasificacion', 80)->nullable();
            $table->string('urgencia', 50)->nullable();
            $table->string('nivel_confianza', 50)->nullable();
            $table->text('observaciones_medico')->nullable();
            $table->timestamp('fecha_analisis')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('historial_retina');
    }
};
