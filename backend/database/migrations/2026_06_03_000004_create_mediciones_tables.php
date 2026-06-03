<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Mediciones clinicas tomadas durante la evaluacion: agudeza visual,
 * presion intraocular y medidas de refraccion por ojo (OD/OI).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('agudeza_visual', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('paciente_id');
            $table->unsignedInteger('evaluacion_id')->nullable();
            $table->enum('ojo', ['OD', 'OI']);
            $table->string('valor', 20);                   // 20/20, 20/40, ...
            $table->boolean('con_correccion')->default(false);
            $table->timestamps();

            $table->foreign('paciente_id')->references('id')->on('pacientes')->cascadeOnDelete();
            $table->foreign('evaluacion_id')->references('id')->on('evaluaciones_retina')->nullOnDelete();
        });

        Schema::create('presion_intraocular', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('paciente_id');
            $table->unsignedInteger('evaluacion_id')->nullable();
            $table->enum('ojo', ['OD', 'OI']);
            $table->decimal('valor_mmhg', 4, 1);
            $table->string('metodo', 60)->nullable();
            $table->timestamps();

            $table->foreign('paciente_id')->references('id')->on('pacientes')->cascadeOnDelete();
            $table->foreign('evaluacion_id')->references('id')->on('evaluaciones_retina')->nullOnDelete();
        });

        Schema::create('medidas_refraccion', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('paciente_id');
            $table->unsignedInteger('evaluacion_id')->nullable();
            $table->enum('ojo', ['OD', 'OI']);
            $table->decimal('esfera', 5, 2)->nullable();
            $table->decimal('cilindro', 5, 2)->nullable();
            $table->unsignedSmallInteger('eje')->nullable();        // 0-180
            $table->decimal('adicion', 4, 2)->nullable();
            $table->decimal('distancia_pupilar', 4, 1)->nullable();
            $table->timestamps();

            $table->foreign('paciente_id')->references('id')->on('pacientes')->cascadeOnDelete();
            $table->foreign('evaluacion_id')->references('id')->on('evaluaciones_retina')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('medidas_refraccion');
        Schema::dropIfExists('presion_intraocular');
        Schema::dropIfExists('agudeza_visual');
    }
};
