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
            // Personal
            $table->string('middle_name')->nullable()->after('last_name');
            $table->string('preferred_name')->nullable()->after('middle_name');
            $table->date('birth_date')->nullable()->after('preferred_name');
            $table->string('gender')->nullable()->after('birth_date');
            $table->string('marital_status')->nullable()->after('gender');
            $table->string('ssn')->nullable()->after('marital_status');

            // Address
            $table->string('address_street_1')->nullable()->after('ssn');
            $table->string('address_street_2')->nullable()->after('address_street_1');
            $table->string('address_city')->nullable()->after('address_street_2');
            $table->string('address_province')->nullable()->after('address_city');
            $table->string('address_postal_code')->nullable()->after('address_province');
            $table->string('address_country')->nullable()->after('address_postal_code');

            // Contact Extra
            $table->string('home_phone')->nullable()->after('phone_mobile');
            $table->string('home_email')->nullable()->after('email');
        });

        Schema::table('job_info', function (Blueprint $table) {
            // Compensation Info
            $table->date('comp_effective_date')->nullable()->after('employment_status');
            $table->string('overtime_status')->nullable()->after('comp_effective_date');
            $table->string('comp_change_reason')->nullable()->after('overtime_status');
            $table->text('comp_comment')->nullable()->after('comp_change_reason');
            $table->string('pay_schedule')->nullable()->after('comp_comment');
            $table->string('pay_type')->nullable()->after('pay_schedule');
            $table->decimal('pay_rate', 15, 2)->nullable()->after('pay_type');
            $table->string('pay_currency', 3)->default('PHP')->after('pay_rate');
            $table->string('pay_period')->nullable()->after('pay_currency');

            // Job Extra
            $table->string('ethnicity')->nullable()->after('pay_period');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'middle_name',
                'preferred_name',
                'birth_date',
                'gender',
                'marital_status',
                'ssn',
                'address_street_1',
                'address_street_2',
                'address_city',
                'address_province',
                'address_postal_code',
                'address_country',
                'home_phone',
                'home_email',
            ]);
        });

        Schema::table('job_info', function (Blueprint $table) {
            $table->dropColumn([
                'comp_effective_date',
                'overtime_status',
                'comp_change_reason',
                'comp_comment',
                'pay_schedule',
                'pay_type',
                'pay_rate',
                'pay_currency',
                'pay_period',
                'ethnicity',
            ]);
        });
    }
};
