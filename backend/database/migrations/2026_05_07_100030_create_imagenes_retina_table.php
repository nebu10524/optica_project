<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('imagenes_retina', function (Blueprint $table) {
            $table->id();
            $table->foreignId('evaluacion_id')->constrained('evaluaciones_retina')->cascadeOnDelete();
            $table->foreignId('paciente_id')->constrained('pacientes')->cascadeOnDelete();
            $table->string('ruta_imagen', 500);
            $table->string('nombre_archivo', 255);
            $table->string('mime_type', 100)->nullable();
            $table->string('clasificacion', 80)->nullable();
            $table->string('nivel_confianza', 50)->nullable();
            $table->string('urgencia', 50)->nullable();
            $table->json('hallazgos')->nullable();
            $table->json('signos_rd')->nullable();
            $table->text('recomendacion')->nullable();
            $table->string('modelo_ia', 80)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('imagenes_retina');
    }
};
