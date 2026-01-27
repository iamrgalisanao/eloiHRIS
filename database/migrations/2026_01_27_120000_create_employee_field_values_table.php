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
        Schema::create('employee_field_values', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained('organizations')->onDelete('cascade');
            $table->string('category'); // department, division, job_title, location, employment_status, team
            $table->string('label');    // display as-is
            $table->string('label_slug'); // lowercase/trim/collapse-space(label) for case-insensitive uniqueness
            $table->smallInteger('sort_order')->default(0);
            $table->timestamps();

            $table->unique(['organization_id', 'category', 'label_slug']);
            $table->index(['organization_id', 'category', 'sort_order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employee_field_values');
    }
};
