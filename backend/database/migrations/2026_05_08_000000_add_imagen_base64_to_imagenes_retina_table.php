<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('imagenes_retina', function (Blueprint $table) {
            $table->longText('imagen_base64')->nullable()->after('mime_type');
        });
    }

    public function down(): void
    {
        Schema::table('imagenes_retina', function (Blueprint $table) {
            $table->dropColumn('imagen_base64');
        });
    }
};

