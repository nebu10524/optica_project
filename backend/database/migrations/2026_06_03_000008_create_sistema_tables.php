<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Soporte del sistema: notificaciones a usuarios, bitacora de auditoria
 * y archivos adjuntos genericos.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notificaciones', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('usuario_id');
            $table->string('titulo', 150);
            $table->text('mensaje')->nullable();
            $table->string('tipo', 40)->default('info');   // info, alerta, urgente
            $table->boolean('leida')->default(false);
            $table->timestamp('leida_en')->nullable();
            $table->timestamps();

            $table->foreign('usuario_id')->references('id')->on('usuarios')->cascadeOnDelete();
        });

        Schema::create('auditoria', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('usuario_id')->nullable();
            $table->string('accion', 60);                  // crear, actualizar, eliminar, login
            $table->string('tabla_afectada', 80)->nullable();
            $table->unsignedBigInteger('registro_id')->nullable();
            $table->json('datos_antes')->nullable();
            $table->json('datos_despues')->nullable();
            $table->string('ip', 45)->nullable();
            $table->timestamp('creado_en')->useCurrent();

            $table->foreign('usuario_id')->references('id')->on('usuarios')->nullOnDelete();
        });

        Schema::create('archivos_adjuntos', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('paciente_id')->nullable();
            $table->unsignedInteger('evaluacion_id')->nullable();
            $table->unsignedInteger('subido_por')->nullable();
            $table->string('nombre_original', 200);
            $table->string('ruta', 300);
            $table->string('mime_type', 100)->nullable();
            $table->unsignedBigInteger('tamano_bytes')->nullable();
            $table->timestamps();

            $table->foreign('paciente_id')->references('id')->on('pacientes')->nullOnDelete();
            $table->foreign('evaluacion_id')->references('id')->on('evaluaciones_retina')->nullOnDelete();
            $table->foreign('subido_por')->references('id')->on('usuarios')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('archivos_adjuntos');
        Schema::dropIfExists('auditoria');
        Schema::dropIfExists('notificaciones');
    }
};
