<?php

namespace Database\Seeders;

use App\Models\EmployeeFieldValue;
use App\Models\Organization;
use Illuminate\Database\Seeder;

class CustomFieldsSeeder extends Seeder
{
    /**
     * Seed custom employee field values.
     */
    public function run(): void
    {
        // Get or create first organization
        $org = Organization::query()->orderBy('id')->first();
        if (!$org) {
            $org = Organization::create([
                'name' => 'Demo Organization',
                'slug' => 'demo'
            ]);
        }
        $orgId = (int) $org->id;

        $fields = [
            'approval' => ['No', 'Yes'],
            'asset_category' => [
                'Building Key',
                'Cell Phone',
                'Cellular Phone',
                'Computer',
                'Corporate Card',
                'Desk Phone',
                'Hardware',
                'Monitor',
                'Software'
            ],
            'bonus_reason' => ['Performance'],
            'category' => ['Gas', 'Lunch', 'Per Diem', 'Travel'],
            'finance_approval' => ['Declined', 'Pending', 'Yes'],
            // Note: receipt_attached, secondary_language, shirt_size, visa
            // are left empty for user-defined values
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

        $this->command->info('✓ Seeded custom employee field values');
    }
}
