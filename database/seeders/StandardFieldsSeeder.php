<?php

namespace Database\Seeders;

use App\Models\EmployeeFieldValue;
use App\Models\Organization;
use Illuminate\Database\Seeder;

class StandardFieldsSeeder extends Seeder
{
    public function run(): void
    {
        $org = Organization::query()->orderBy('id')->first();
        if (!$org) {
            $org = Organization::create(['name' => 'Demo Org', 'slug' => 'demo']);
        }
        $orgId = (int) $org->id;

        $fields = [
            'compensation_change_reason' => [
                'Annual Pay Increase', 'NA', 'Pay Increase',
                'Promotion', 'Relocated', 'Title Change'
            ],
            'degree' => [
                "Associate's", "Bachelor's", 'Doctorate', "Master's"
            ],
            'emergency_contact_relationship' => [
                'Brother', 'Daughter', 'Father', 'Friend',
                'Husband', 'Mother', 'Sister', 'Son', 'Wife'
            ],
            'termination_reason' => [
                'Attendance', 'End of Season', 'Life Happens',
                'Not a Fit', 'Other', 'Other employment',
                'Performance', 'Relocation'
            ],
        ];

        foreach ($fields as $category => $values) {
            foreach ($values as $index => $value) {
                EmployeeFieldValue::firstOrCreate(
                    [
                        'organization_id' => $orgId,
                        'category' => $category,
                        'label_slug' => EmployeeFieldValue::makeLabelSlug($value),
                    ],
                    [
                        'label' => $value,
                        'sort_order' => $index,
                    ]
                );
            }
        }
    }
}
