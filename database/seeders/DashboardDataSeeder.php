<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DashboardDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $org = \App\Models\Organization::first();
        $michael = \App\Models\Employee::where('employee_number', 'EMP450')->first();

        if (!$org || !$michael) {
            return;
        }

        // --- Seed Activities (What's happening) ---
        $activities = [
            [
                'title' => 'Take a moment to complete your Employee Assessments.',
                'description' => 'Complete the assessments on the Performance tab on each employee\'s profile.',
                'type' => 'alert',
                'metadata' => ['badge' => 'PAST DUE', 'highlight' => 'Please complete by Nov 30 (57 days ago).', 'icon' => 'Compass']
            ],
            [
                'title' => 'Take a few minutes to complete your Self Assessment.',
                'description' => 'Annual performance review session.',
                'type' => 'alert',
                'metadata' => ['badge' => 'PAST DUE', 'highlight' => 'Please complete your assessment by Dec 1 (56 days ago).', 'icon' => 'Profile']
            ],
            [
                'title' => 'Charlotte Abbott requested Friday, Jul 5 off – 40 hours of Vacation',
                'description' => '2 months ago',
                'type' => 'social',
                'metadata' => ['avatar' => 'https://i.pravatar.cc/150?u=charlotte']
            ],
            [
                'title' => 'Olivia Sterling made a request: Compensation request for Ashley Adams.',
                'description' => '3 months ago',
                'type' => 'request',
                'metadata' => ['icon' => 'Profile']
            ],
            [
                'title' => 'Background_Check_Auth.pdf is waiting for your signature!',
                'description' => '4 months ago',
                'type' => 'document',
                'metadata' => ['icon' => 'Signature']
            ]
        ];

        foreach ($activities as $act) {
            \App\Models\Activity::create(array_merge($act, [
                'organization_id' => $org->id,
                'employee_id' => $michael->id
            ]));
        }

        // --- Seed Goals ---
        $goals = [
            ['title' => 'Q1 Sales Target', 'status' => 'active', 'due_date' => '2026-03-31'],
            ['title' => 'Team Building Offsite', 'status' => 'active', 'due_date' => '2026-04-15'],
            ['title' => 'Annual Budget Approval', 'status' => 'completed', 'due_date' => '2026-01-10'],
            ['title' => 'Client Retention Survey', 'status' => 'active', 'due_date' => '2026-02-28'],
        ];

        foreach ($goals as $goal) {
            \App\Models\Goal::create(array_merge($goal, [
                'organization_id' => $org->id,
                'employee_id' => $michael->id
            ]));
        }

        // --- Seed Trainings ---
        $trainings = [
            ['title' => 'Safety in the Workplace', 'status' => 'active', 'due_date' => '2026-02-15'],
            ['title' => 'Email Security & Phishing', 'status' => 'active', 'due_date' => '2026-03-01'],
            ['title' => 'Leadership 101', 'status' => 'completed', 'due_date' => '2025-12-20'],
            ['title' => 'Inclusion & Diversity', 'status' => 'past due', 'due_date' => '2026-01-05'],
        ];

        foreach ($trainings as $training) {
            \App\Models\Training::create(array_merge($training, [
                'organization_id' => $org->id,
                'employee_id' => $michael->id
            ]));
        }
    }
}
