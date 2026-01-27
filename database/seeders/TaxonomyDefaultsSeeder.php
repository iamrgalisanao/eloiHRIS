<?php

namespace Database\Seeders;

use App\Models\EmployeeFieldValue;
use App\Models\Organization;
use Illuminate\Database\Seeder;

class TaxonomyDefaultsSeeder extends Seeder
{
    public function run(): void
    {
        $org = Organization::query()->orderBy('id')->first();
        if (!$org)
            return;

        $orgId = (int) $org->id;

        $taxonomy = [
            'job_title' => [
                'Account Executive',
                'Software Engineer',
                'Senior Software Engineer',
                'Product Manager',
                'HR Manager',
                'Operations Director',
                'Sales Representative',
                'Customer Support Specialist'
            ],
            'department' => [
                'Engineering',
                'Sales',
                'Marketing',
                'Human Resources',
                'Customer Success',
                'Operations',
                'IT',
                'Finance'
            ],
            'division' => [
                'North America',
                'EMEA',
                'APAC',
                'Internal'
            ],
            'location' => [
                'Manila, PH',
                'New York, USA',
                'London, UK',
                'Remote'
            ],
            'employment_status' => [
                'Full-Time',
                'Part-Time',
                'Contract',
                'Internship'
            ],
            'pay_schedule' => [
                'Bi-Weekly',
                'Monthly',
                'Semi-Monthly'
            ],
            'comp_change_reason' => [
                'New Hire',
                'Annual Review',
                'Promotion',
                'Market Adjustment'
            ],
            'overtime_status' => [
                'Exempt',
                'Non-Exempt'
            ]
        ];

        foreach ($taxonomy as $category => $values) {
            foreach ($values as $index => $label) {
                EmployeeFieldValue::firstOrCreate(
                    [
                        'organization_id' => $orgId,
                        'category' => $category,
                        'label_slug' => EmployeeFieldValue::makeLabelSlug($label),
                    ],
                    [
                        'label' => $label,
                        'sort_order' => $index,
                    ]
                );
            }
        }
    }
}
