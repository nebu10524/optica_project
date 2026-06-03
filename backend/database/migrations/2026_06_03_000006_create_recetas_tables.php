<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Recetas opticas (prescripcion). Una receta tiene detalle por ojo y
 * puede llevar varios tratamientos de lente.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('recetas', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('paciente_id');
            $table->unsignedInteger('usuario_id');
            $table->unsignedInteger('evaluacion_id')->nullable();
            $table->foreignId('tipo_lente_id')->nullable()->constrained('tipos_lente')->nullOnDelete();
            $table->foreignId('material_lente_id')->nullable()->constrained('materiales_lente')->nullOnDelete();
            $table->date('fecha_emision');
            $table->date('vigencia_hasta')->nullable();
            $table->text('observaciones')->nullable();
            $table->timestamps();

            $table->foreign('paciente_id')->references('id')->on('pacientes')->cascadeOnDelete();
            $table->foreign('usuario_id')->references('id')->on('usuarios')->cascadeOnDelete();
            $table->foreign('evaluacion_id')->references('id')->on('evaluaciones_retina')->nullOnDelete();
        });

        Schema::create('receta_detalle', function (Blueprint $table) {
            $table->id();
            $table->foreignId('receta_id')->constrained('recetas')->cascadeOnDelete();
            $table->enum('ojo', ['OD', 'OI']);
            $table->decimal('esfera', 5, 2)->nullable();
            $table->decimal('cilindro', 5, 2)->nullable();
            $table->unsignedSmallInteger('eje')->nullable();
            $table->decimal('adicion', 4, 2)->nullable();
            $table->decimal('distancia_pupilar', 4, 1)->nullable();
            $table->timestamps();
        });

        Schema::create('receta_tratamiento', function (Blueprint $table) {
            $table->id();
            $table->foreignId('receta_id')->constrained('recetas')->cascadeOnDelete();
            $table->foreignId('tratamiento_lente_id')->constrained('tratamientos_lente')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('receta_tratamiento');
        Schema::dropIfExists('receta_detalle');
        Schema::dropIfExists('recetas');
    }
};
