<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FoundationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $org = \App\Models\Organization::create([
            'name' => 'Acme Corp',
            'slug' => 'acme',
            'branding_json' => ['primary_color' => '#5cb85c']
        ]);

        $user = \App\Models\User::create([
            'name' => 'Michael Scott',
            'email' => 'michael.scott@dundermifflin.com',
            'password' => bcrypt('password'),
            'organization_id' => $org->id
        ]);

        $employee = \App\Models\Employee::create([
            'organization_id' => $org->id,
            'user_id' => $user->id,
            'employee_number' => 'EMP450',
            'status' => 'active'
        ]);

        \App\Models\JobInfo::create([
            'organization_id' => $org->id,
            'employee_id' => $employee->id,
            'job_title' => 'Regional Manager',
            'hire_date' => '2005-03-24',
            'department' => 'Scranton Branch'
        ]);

        \App\Models\TimeOffBalance::create([
            'organization_id' => $org->id,
            'employee_id' => $employee->id,
            'leave_type' => 'Vacation',
            'accrued_hours' => 40.00,
            'taken_hours' => 8.00,
        ]);

        // Seed Custom Fields
        $equipmentTab = \App\Models\CustomTab::create([
            'organization_id' => $org->id,
            'label' => 'Equipment',
            'sort_order' => 1
        ]);

        $laptopField = \App\Models\CustomField::create([
            'organization_id' => $org->id,
            'tab_id' => $equipmentTab->id,
            'label' => 'MacBook Serial',
            'type' => 'text',
            'sort_order' => 1
        ]);

        \App\Models\CustomFieldValue::create([
            'organization_id' => $org->id,
            'employee_id' => $employee->id,
            'field_id' => $laptopField->id,
            'value' => 'SN-DUNDER-2026-X'
        ]);

        $uniformTab = \App\Models\CustomTab::create([
            'organization_id' => $org->id,
            'label' => 'Uniform',
            'sort_order' => 2
        ]);

        $shirtField = \App\Models\CustomField::create([
            'organization_id' => $org->id,
            'tab_id' => $uniformTab->id,
            'label' => 'Shirt Size',
            'type' => 'text',
            'sort_order' => 1
        ]);

        \App\Models\CustomFieldValue::create([
            'organization_id' => $org->id,
            'employee_id' => $employee->id,
            'field_id' => $shirtField->id,
            'value' => 'Large (Michael edition)'
        ]);
    }
}
