<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('document_control', function (Blueprint $table) {
            $table->id();
            $table->string('section');
            $table->string('subject');
            $table->string('file_name');
            $table->string('file_path');
            $table->string('document_code');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('document_control');
    }
};
