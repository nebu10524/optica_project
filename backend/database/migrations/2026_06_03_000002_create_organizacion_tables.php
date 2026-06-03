<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Organizacion: sedes de Multiopticas, consultorios, horarios y configuracion.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sedes', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 120);
            $table->string('direccion', 200)->nullable();
            $table->string('distrito', 100)->nullable();
            $table->string('ciudad', 100)->nullable();
            $table->string('telefono', 30)->nullable();
            $table->string('email', 150)->nullable();
            $table->boolean('activo')->default(true);
            $table->timestamps();
        });

        Schema::create('consultorios', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sede_id')->constrained('sedes')->cascadeOnDelete();
            $table->string('nombre', 80);
            $table->string('piso', 20)->nullable();
            $table->boolean('activo')->default(true);
            $table->timestamps();
        });

        Schema::create('horarios_atencion', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sede_id')->constrained('sedes')->cascadeOnDelete();
            $table->unsignedInteger('usuario_id')->nullable();
            $table->unsignedTinyInteger('dia_semana');     // 1=Lunes ... 7=Domingo
            $table->time('hora_inicio');
            $table->time('hora_fin');
            $table->boolean('activo')->default(true);
            $table->timestamps();

            $table->foreign('usuario_id')->references('id')->on('usuarios')->nullOnDelete();
        });

        Schema::create('configuraciones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sede_id')->nullable()->constrained('sedes')->nullOnDelete();
            $table->string('clave', 100);
            $table->text('valor')->nullable();
            $table->string('tipo', 30)->default('texto');  // texto, numero, booleano, json
            $table->timestamps();
        });

        Schema::create('parametros_sistema', function (Blueprint $table) {
            $table->id();
            $table->string('clave', 100)->unique();
            $table->text('valor')->nullable();
            $table->text('descripcion')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('parametros_sistema');
        Schema::dropIfExists('configuraciones');
        Schema::dropIfExists('horarios_atencion');
        Schema::dropIfExists('consultorios');
        Schema::dropIfExists('sedes');
    }
};
