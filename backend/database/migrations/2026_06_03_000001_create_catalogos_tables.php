<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Tablas de catalogo (referencia). Normalizan valores que el sistema
 * antes guardaba como texto/JSON: clasificacion ICDR, urgencia, signos, etc.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('clasificaciones_rd', function (Blueprint $table) {
            $table->id();
            $table->string('codigo', 30)->unique();        // sin_rd, leve, moderada, severa
            $table->string('nombre', 80);
            $table->string('color_hex', 9)->nullable();
            $table->unsignedTinyInteger('orden')->default(0);
            $table->text('descripcion')->nullable();
            $table->timestamps();
        });

        Schema::create('niveles_urgencia', function (Blueprint $table) {
            $table->id();
            $table->string('codigo', 30)->unique();        // rutina, prioridad, urgente
            $table->string('nombre', 80);
            $table->string('color_hex', 9)->nullable();
            $table->unsignedSmallInteger('dias_sugeridos')->nullable();
            $table->timestamps();
        });

        Schema::create('niveles_confianza', function (Blueprint $table) {
            $table->id();
            $table->string('codigo', 30)->unique();        // alto, medio, bajo
            $table->string('nombre', 80);
            $table->timestamps();
        });

        Schema::create('catalogo_signos', function (Blueprint $table) {
            $table->id();
            $table->string('codigo', 50)->unique();        // microaneurismas, hemorragias, ...
            $table->string('nombre', 120);
            $table->text('descripcion')->nullable();
            $table->timestamps();
        });

        Schema::create('modelos_ia', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 80);                  // gemini-2.5-flash
            $table->string('proveedor', 80)->nullable();   // Google
            $table->string('version', 40)->nullable();
            $table->boolean('activo')->default(true);
            $table->timestamps();
        });

        Schema::create('especialidades', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 100);                 // Optometria, Oftalmologia
            $table->text('descripcion')->nullable();
            $table->timestamps();
        });

        Schema::create('estados_cita', function (Blueprint $table) {
            $table->id();
            $table->string('codigo', 30)->unique();        // pendiente, confirmada, atendida, cancelada
            $table->string('nombre', 80);
            $table->string('color_hex', 9)->nullable();
            $table->timestamps();
        });

        Schema::create('tipos_lente', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 100);                 // Monofocal, Bifocal, Progresivo
            $table->text('descripcion')->nullable();
            $table->timestamps();
        });

        Schema::create('materiales_lente', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 100);                 // Policarbonato, CR-39, Trivex
            $table->decimal('indice_refraccion', 4, 2)->nullable();
            $table->timestamps();
        });

        Schema::create('tratamientos_lente', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 100);                 // Antirreflejo, Fotocromatico, Filtro azul
            $table->text('descripcion')->nullable();
            $table->timestamps();
        });

        Schema::create('aseguradoras', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 120);
            $table->string('telefono', 30)->nullable();
            $table->boolean('activo')->default(true);
            $table->timestamps();
        });

        Schema::create('diagnosticos', function (Blueprint $table) {
            $table->id();
            $table->string('codigo', 20)->nullable();      // CIE-10 opcional
            $table->string('nombre', 150);
            $table->text('descripcion')->nullable();
            $table->timestamps();
        });

        Schema::create('alergias', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 120);
            $table->text('descripcion')->nullable();
            $table->timestamps();
        });

        Schema::create('medicamentos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 150);
            $table->string('presentacion', 100)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('medicamentos');
        Schema::dropIfExists('alergias');
        Schema::dropIfExists('diagnosticos');
        Schema::dropIfExists('aseguradoras');
        Schema::dropIfExists('tratamientos_lente');
        Schema::dropIfExists('materiales_lente');
        Schema::dropIfExists('tipos_lente');
        Schema::dropIfExists('estados_cita');
        Schema::dropIfExists('especialidades');
        Schema::dropIfExists('modelos_ia');
        Schema::dropIfExists('catalogo_signos');
        Schema::dropIfExists('niveles_confianza');
        Schema::dropIfExists('niveles_urgencia');
        Schema::dropIfExists('clasificaciones_rd');
    }
};
