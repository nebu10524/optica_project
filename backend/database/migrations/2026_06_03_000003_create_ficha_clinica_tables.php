<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Ficha clinica del paciente: antecedentes, alergias, medicamentos,
 * contactos de emergencia y seguros. Todo cuelga de pacientes.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('antecedentes_medicos', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('paciente_id');
            $table->boolean('diabetes')->default(false);
            $table->boolean('hipertension')->default(false);
            $table->string('tiempo_diabetes', 50)->nullable();
            $table->text('observaciones')->nullable();
            $table->timestamps();

            $table->foreign('paciente_id')->references('id')->on('pacientes')->cascadeOnDelete();
        });

        Schema::create('antecedentes_oftalmologicos', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('paciente_id');
            $table->boolean('usa_lentes')->default(false);
            $table->boolean('cirugia_ocular')->default(false);
            $table->boolean('glaucoma')->default(false);
            $table->text('observaciones')->nullable();
            $table->timestamps();

            $table->foreign('paciente_id')->references('id')->on('pacientes')->cascadeOnDelete();
        });

        Schema::create('antecedentes_familiares', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('paciente_id');
            $table->string('parentesco', 60)->nullable();
            $table->string('condicion', 120);
            $table->text('observaciones')->nullable();
            $table->timestamps();

            $table->foreign('paciente_id')->references('id')->on('pacientes')->cascadeOnDelete();
        });

        Schema::create('paciente_alergia', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('paciente_id');
            $table->foreignId('alergia_id')->constrained('alergias')->cascadeOnDelete();
            $table->string('severidad', 40)->nullable();   // leve, moderada, severa
            $table->timestamps();

            $table->foreign('paciente_id')->references('id')->on('pacientes')->cascadeOnDelete();
        });

        Schema::create('paciente_medicamento', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('paciente_id');
            $table->foreignId('medicamento_id')->constrained('medicamentos')->cascadeOnDelete();
            $table->string('dosis', 80)->nullable();
            $table->string('frecuencia', 80)->nullable();
            $table->timestamps();

            $table->foreign('paciente_id')->references('id')->on('pacientes')->cascadeOnDelete();
        });

        Schema::create('contactos_emergencia', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('paciente_id');
            $table->string('nombre', 120);
            $table->string('parentesco', 60)->nullable();
            $table->string('telefono', 30);
            $table->timestamps();

            $table->foreign('paciente_id')->references('id')->on('pacientes')->cascadeOnDelete();
        });

        Schema::create('paciente_seguro', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('paciente_id');
            $table->foreignId('aseguradora_id')->constrained('aseguradoras')->cascadeOnDelete();
            $table->string('numero_poliza', 80)->nullable();
            $table->date('vigencia_hasta')->nullable();
            $table->timestamps();

            $table->foreign('paciente_id')->references('id')->on('pacientes')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('paciente_seguro');
        Schema::dropIfExists('contactos_emergencia');
        Schema::dropIfExists('paciente_medicamento');
        Schema::dropIfExists('paciente_alergia');
        Schema::dropIfExists('antecedentes_familiares');
        Schema::dropIfExists('antecedentes_oftalmologicos');
        Schema::dropIfExists('antecedentes_medicos');
    }
};
