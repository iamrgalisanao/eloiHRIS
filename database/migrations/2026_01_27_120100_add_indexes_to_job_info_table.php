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
        Schema::table('job_info', function (Blueprint $table) {
            // Composite indexes to speed counts and cascade operations
            $table->index(['organization_id', 'department'], 'job_info_org_department_index');
            $table->index(['organization_id', 'division'], 'job_info_org_division_index');
            $table->index(['organization_id', 'job_title'], 'job_info_org_job_title_index');
            $table->index(['organization_id', 'location'], 'job_info_org_location_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('job_info', function (Blueprint $table) {
            $table->dropIndex('job_info_org_department_index');
            $table->dropIndex('job_info_org_division_index');
            $table->dropIndex('job_info_org_job_title_index');
            $table->dropIndex('job_info_org_location_index');
        });
    }
};
