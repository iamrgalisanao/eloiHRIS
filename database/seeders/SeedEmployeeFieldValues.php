<?php

namespace Database\Seeders;

use App\Models\EmployeeFieldValue;
use App\Models\Organization;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SeedEmployeeFieldValues extends Seeder
{
    private const CATEGORY_COLUMN_MAP = [
        'department' => 'department',
        'division' => 'division',
        'job_title' => 'job_title',
        'location' => 'location',
    ];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Organization::query()->select('id')->chunkById(100, function ($orgs) {
            foreach ($orgs as $org) {
                $orgId = (int) $org->id;
                foreach (self::CATEGORY_COLUMN_MAP as $category => $col) {
                    $distinct = DB::table('job_info')
                        ->where('organization_id', $orgId)
                        ->whereNotNull($col)
                        ->distinct()
                        ->pluck($col)
                        ->filter()
                        ->map(function ($label) {
                            $normalized = preg_replace('/\s+/', ' ', trim((string) $label));
                            return [
                                'label' => $normalized,
                                'label_slug' => EmployeeFieldValue::makeLabelSlug($normalized),
                            ];
                        })
                        ->unique('label_slug')
                        ->values();

                    foreach ($distinct as $row) {
                        EmployeeFieldValue::firstOrCreate(
                            [
                                'organization_id' => $orgId,
                                'category' => $category,
                                'label_slug' => $row['label_slug'],
                            ],
                            [
                                'label' => $row['label'],
                                'sort_order' => 0,
                            ]
                        );
                    }
                }
            }
        });
    }
}
