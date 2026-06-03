<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Detalle de la evaluacion: normaliza signos, hallazgos y recomendaciones
 * que hoy se guardan como JSON en imagenes_retina, agrega observaciones del
 * profesional, el diagnostico asociado y la bitacora de cada llamada a la IA.
 */
return new class extends Migration
{
    public function up(): void
    {
        // Signos detectados por evaluacion (pivote evaluacion <-> catalogo_signos)
        Schema::create('evaluacion_signo', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('evaluacion_id');
            $table->foreignId('signo_id')->constrained('catalogo_signos')->cascadeOnDelete();
            $table->boolean('presente')->default(false);
            $table->timestamps();

            $table->foreign('evaluacion_id')->references('id')->on('evaluaciones_retina')->cascadeOnDelete();
        });

        Schema::create('hallazgos', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('evaluacion_id');
            $table->text('descripcion');
            $table->timestamps();

            $table->foreign('evaluacion_id')->references('id')->on('evaluaciones_retina')->cascadeOnDelete();
        });

        Schema::create('recomendaciones', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('evaluacion_id');
            $table->text('texto');
            $table->boolean('generada_por_ia')->default(true);
            $table->timestamps();

            $table->foreign('evaluacion_id')->references('id')->on('evaluaciones_retina')->cascadeOnDelete();
        });

        Schema::create('observaciones_medicas', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('evaluacion_id');
            $table->unsignedInteger('usuario_id');
            $table->text('texto');
            $table->timestamps();

            $table->foreign('evaluacion_id')->references('id')->on('evaluaciones_retina')->cascadeOnDelete();
            $table->foreign('usuario_id')->references('id')->on('usuarios')->cascadeOnDelete();
        });

        // Diagnostico asociado a una evaluacion (pivote con catalogo diagnosticos)
        Schema::create('evaluacion_diagnostico', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('evaluacion_id');
            $table->foreignId('diagnostico_id')->constrained('diagnosticos')->cascadeOnDelete();
            $table->foreignId('clasificacion_rd_id')->nullable()->constrained('clasificaciones_rd')->nullOnDelete();
            $table->boolean('principal')->default(false);
            $table->timestamps();

            $table->foreign('evaluacion_id')->references('id')->on('evaluaciones_retina')->cascadeOnDelete();
        });

        // Bitacora tecnica de cada analisis con IA
        Schema::create('analisis_ia_log', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('evaluacion_id')->nullable();
            $table->unsignedInteger('imagen_id')->nullable();
            $table->foreignId('modelo_id')->nullable()->constrained('modelos_ia')->nullOnDelete();
            $table->unsignedSmallInteger('http_status')->nullable();
            $table->unsignedInteger('tiempo_ms')->nullable();
            $table->unsignedInteger('tokens_entrada')->nullable();
            $table->unsignedInteger('tokens_salida')->nullable();
            $table->boolean('exito')->default(true);
            $table->text('mensaje_error')->nullable();
            $table->timestamps();

            $table->foreign('evaluacion_id')->references('id')->on('evaluaciones_retina')->nullOnDelete();
            $table->foreign('imagen_id')->references('id')->on('imagenes_retina')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('analisis_ia_log');
        Schema::dropIfExists('evaluacion_diagnostico');
        Schema::dropIfExists('observaciones_medicas');
        Schema::dropIfExists('recomendaciones');
        Schema::dropIfExists('hallazgos');
        Schema::dropIfExists('evaluacion_signo');
    }
};
