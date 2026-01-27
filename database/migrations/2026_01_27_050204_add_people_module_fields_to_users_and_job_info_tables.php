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
        // Add fields to users table for People module
        Schema::table('users', function (Blueprint $table) {
            $table->string('first_name')->nullable()->after('name');
            $table->string('last_name')->nullable()->after('first_name');
            $table->string('photo_url')->nullable()->after('email');
            $table->string('phone_work')->nullable()->after('photo_url');
            $table->string('phone_work_ext')->nullable()->after('phone_work');
            $table->string('phone_mobile')->nullable()->after('phone_work_ext');
            $table->string('timezone')->nullable()->default('UTC')->after('phone_mobile');
            $table->string('region')->nullable()->after('timezone');

            // Social media links
            $table->string('linkedin_url')->nullable()->after('region');
            $table->string('twitter_url')->nullable()->after('linkedin_url');
            $table->string('facebook_url')->nullable()->after('twitter_url');
            $table->string('pinterest_url')->nullable()->after('facebook_url');
            $table->string('instagram_url')->nullable()->after('pinterest_url');
        });

        // Add employment_status to job_info table
        Schema::table('job_info', function (Blueprint $table) {
            $table->string('employment_status')->nullable()->after('location');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'first_name',
                'last_name',
                'photo_url',
                'phone_work',
                'phone_work_ext',
                'phone_mobile',
                'timezone',
                'region',
                'linkedin_url',
                'twitter_url',
                'facebook_url',
                'pinterest_url',
                'instagram_url',
            ]);
        });

        Schema::table('job_info', function (Blueprint $table) {
            $table->dropColumn('employment_status');
        });
    }
};
