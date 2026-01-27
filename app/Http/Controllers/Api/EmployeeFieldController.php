<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EmployeeFieldValue;
use App\Models\Organization;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class EmployeeFieldController extends Controller
{
    private const ALLOWED_CATEGORIES = [
        // Standard fields
        'compensation_change_reason', 'degree', 'emergency_contact_relationship', 'termination_reason', 'pay_schedule',
        // Employee taxonomy fields
        'department', 'division', 'job_title', 'location', 'employment_status', 'team',
    ];

    private const CATEGORY_COLUMN_MAP = [
        // Employee taxonomy mapped to job_info columns
        'department' => 'department',
        'division' => 'division',
        'job_title' => 'job_title',
        'location' => 'location',
        // Unmapped categories (no counts/cascade)
        'employment_status' => null,
        'team' => null,
        // Standard fields (no counts/cascade for now)
        'compensation_change_reason' => null,
        'degree' => null,
        'emergency_contact_relationship' => null,
        'termination_reason' => null,
        'pay_schedule' => null,
    ];

    public function index(Request $request)
    {
        $category = $request->query('category');
        if (!in_array($category, self::ALLOWED_CATEGORIES, true)) {
            return response()->json([
                'code' => 'invalid_category',
                'message' => 'Unsupported category.',
            ], 422);
        }

        $orgId = $this->resolveOrgId($request);

        $values = EmployeeFieldValue::query()
            ->where('organization_id', $orgId)
            ->where('category', $category)
            ->orderBy('sort_order')
            ->orderBy('label')
            ->get(['id', 'category', 'label']);

        $col = self::CATEGORY_COLUMN_MAP[$category];
        $counts = [];
        if ($col) {
            $counts = DB::table('job_info')
                ->selectRaw($col . ' as label, COUNT(*) as people_count')
                ->where('organization_id', $orgId)
                ->whereNotNull($col)
                ->groupBy($col)
                ->pluck('people_count', 'label')
                ->all();
        }

        $result = $values->map(function ($row) use ($counts) {
            return [
                'id' => $row->id,
                'label' => $row->label,
                'people_count' => (int)($counts[$row->label] ?? 0),
            ];
        });

        return response()->json($result);
    }

    public function store(Request $request, string $category)
    {
        if (!in_array($category, self::ALLOWED_CATEGORIES, true)) {
            return response()->json([
                'code' => 'invalid_category',
                'message' => 'Unsupported category.',
            ], 422);
        }

        $orgId = $this->resolveOrgId($request);

        $v = Validator::make($request->all(), [
            'label' => ['required', 'string', 'max:120'],
        ]);
        if ($v->fails()) {
            return response()->json(['errors' => $v->errors()], 422);
        }

        $label = trim((string) $request->input('label'));
        $labelSlug = EmployeeFieldValue::makeLabelSlug($label);

        $exists = EmployeeFieldValue::query()
            ->where('organization_id', $orgId)
            ->where('category', $category)
            ->where('label_slug', $labelSlug)
            ->exists();
        if ($exists) {
            return response()->json([
                'code' => 'duplicate_label',
                'message' => 'Label already exists.',
                'field' => 'label',
            ], 422);
        }

        $row = new EmployeeFieldValue([
            'organization_id' => $orgId,
            'category' => $category,
            'label' => $label,
            'label_slug' => $labelSlug,
            'sort_order' => 0,
        ]);
        $row->save();

        return response()->json([
            'id' => $row->id,
            'label' => $row->label,
            'people_count' => 0,
        ], 201);
    }

    public function update(Request $request, string $category, int $id)
    {
        if (!in_array($category, self::ALLOWED_CATEGORIES, true)) {
            return response()->json([
                'code' => 'invalid_category',
                'message' => 'Unsupported category.',
            ], 422);
        }

        $orgId = $this->resolveOrgId($request);
        $cascade = (bool) $request->boolean('cascade');

        $v = Validator::make($request->all(), [
            'label' => ['required', 'string', 'max:120'],
        ]);
        if ($v->fails()) {
            return response()->json(['errors' => $v->errors()], 422);
        }

        $label = trim((string) $request->input('label'));
        $newSlug = EmployeeFieldValue::makeLabelSlug($label);

        $source = EmployeeFieldValue::query()
            ->where('organization_id', $orgId)
            ->where('category', $category)
            ->findOrFail($id);

        // If slug unchanged, treat as no-op
        if ($source->label_slug === $newSlug) {
            return response()->json([
                'id' => $source->id,
                'label' => $source->label,
                'people_count' => $this->countForLabel($orgId, $category, $source->label),
            ]);
        }

        $target = EmployeeFieldValue::query()
            ->where('organization_id', $orgId)
            ->where('category', $category)
            ->where('label_slug', $newSlug)
            ->first();

        $col = self::CATEGORY_COLUMN_MAP[$category];

        return DB::transaction(function () use ($source, $target, $label, $newSlug, $orgId, $col, $cascade) {
            if ($target) {
                // Merge into existing target
                if ($col) {
                    DB::table('job_info')
                        ->where('organization_id', $orgId)
                        ->where($col, $source->label)
                        ->update([$col => $target->label]);
                }
                $source->delete();

                return response()->json([
                    'id' => $target->id,
                    'label' => $target->label,
                    'people_count' => $this->countForLabel($orgId, $source->category, $target->label),
                ]);
            }

            // Rename source to new label
            // Re-fetch with FOR UPDATE to lock the row within transaction
            $locked = EmployeeFieldValue::query()
                ->where('organization_id', $orgId)
                ->where('category', $source->category)
                ->where('id', $source->id)
                ->lockForUpdate()
                ->firstOrFail();

            $oldLabel = $locked->label;
            $locked->label = $label; // mutator updates label_slug
            $locked->save();

            if ($cascade && $col) {
                DB::table('job_info')
                    ->where('organization_id', $orgId)
                    ->where($col, $oldLabel)
                    ->update([$col => $label]);
            }

            return response()->json([
                'id' => $locked->id,
                'label' => $locked->label,
                'people_count' => $this->countForLabel($orgId, $locked->category, $locked->label),
            ]);
        });
    }

    public function destroy(Request $request, string $category, int $id)
    {
        if (!in_array($category, self::ALLOWED_CATEGORIES, true)) {
            return response()->json([
                'code' => 'invalid_category',
                'message' => 'Unsupported category.',
            ], 422);
        }

        $orgId = $this->resolveOrgId($request);
        $transferTo = $request->query('transfer_to');

        $source = EmployeeFieldValue::query()
            ->where('organization_id', $orgId)
            ->where('category', $category)
            ->findOrFail($id);

        $col = self::CATEGORY_COLUMN_MAP[$category];
        $usage = $col ? (int) DB::table('job_info')
            ->where('organization_id', $orgId)
            ->where($col, $source->label)
            ->count() : 0;

        if ($usage > 0) {
            if (!$transferTo || (int) $transferTo === (int) $source->id) {
                $candidates = EmployeeFieldValue::query()
                    ->where('organization_id', $orgId)
                    ->where('category', $category)
                    ->where('id', '!=', $source->id)
                    ->orderBy('label')
                    ->get(['id', 'label']);

                return response()->json([
                    'code' => 'transfer_required',
                    'message' => 'Value is in use; specify transfer_to.',
                    'values' => $candidates->map(function ($c) use ($orgId, $category) {
                        return [
                            'id' => $c->id,
                            'label' => $c->label,
                            'people_count' => $this->countForLabel($orgId, $category, $c->label),
                        ];
                    }),
                ], 422);
            }

            $target = EmployeeFieldValue::query()
                ->where('organization_id', $orgId)
                ->where('category', $category)
                ->findOrFail((int) $transferTo);

            return DB::transaction(function () use ($orgId, $col, $source, $target) {
                if ($col) {
                    DB::table('job_info')
                        ->where('organization_id', $orgId)
                        ->where($col, $source->label)
                        ->update([$col => $target->label]);
                }
                $source->delete();
                return response()->noContent();
            });
        }

        $source->delete();
        return response()->noContent();
    }

    private function countForLabel(int $orgId, string $category, string $label): int
    {
        $col = self::CATEGORY_COLUMN_MAP[$category] ?? null;
        if (!$col) {
            return 0;
        }
        return (int) DB::table('job_info')
            ->where('organization_id', $orgId)
            ->where($col, $label)
            ->count();
    }

    private function resolveOrgId(Request $request): int
    {
        $user = $request->user();
        if ($user && $user->organization_id) {
            return (int) $user->organization_id;
        }
        // Local fallback: first organization (for dev when auth is bypassed)
        if (app()->environment('local')) {
            $orgId = (int) Organization::query()->value('id');
            if ($orgId) return $orgId;
        }
        abort(401, 'Unauthorized: organization context missing');
    }
}
