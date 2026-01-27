<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('tax_file_number')->nullable()->after('ssn');
            $table->string('nin')->nullable()->after('tax_file_number');
            $table->string('shirt_size')->nullable()->after('nin');
            $table->text('allergies')->nullable()->after('shirt_size');
            $table->text('dietary_restrictions')->nullable()->after('allergies');
        });

        Schema::create('employee_educations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('institution')->nullable();
            $table->string('degree')->nullable();
            $table->string('major')->nullable();
            $table->string('gpa')->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->timestamps();
        });

        Schema::create('employee_visas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('visa_type')->nullable();
            $table->string('issuing_country')->nullable();
            $table->date('issued_date')->nullable();
            $table->date('expiration_date')->nullable();
            $table->string('status')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employee_visas');
        Schema::dropIfExists('employee_educations');
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'tax_file_number',
                'nin',
                'shirt_size',
                'allergies',
                'dietary_restrictions'
            ]);
        });
    }
};
