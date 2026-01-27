<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class EmployeeController extends Controller
{
    /**
     * Get list of employees with filtering, sorting, and pagination.
     */
    public function index(Request $request)
    {
        $orgId = $this->resolveOrgId($request);

        $query = Employee::with(['jobInfo', 'user', 'manager.user'])
            ->where('organization_id', $orgId);

        // Apply filters
        if ($request->has('filter') && $request->filter !== 'all') {
            $query->where('status', $request->filter);
        }

        if ($request->has('department')) {
            $departments = explode(',', $request->department);
            $query->whereHas('jobInfo', function ($q) use ($departments) {
                $q->whereIn('department', $departments);
            });
        }

        if ($request->has('division')) {
            $divisions = explode(',', $request->division);
            $query->whereHas('jobInfo', function ($q) use ($divisions) {
                $q->whereIn('division', $divisions);
            });
        }

        if ($request->has('location')) {
            $locations = explode(',', $request->location);
            $query->whereHas('jobInfo', function ($q) use ($locations) {
                $q->whereIn('location', $locations);
            });
        }

        if ($request->has('employment_status')) {
            $statuses = explode(',', $request->employment_status);
            $query->whereHas('jobInfo', function ($q) use ($statuses) {
                $q->whereIn('employment_status', $statuses);
            });
        }

        // Search
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            })->orWhereHas('jobInfo', function ($q) use ($search) {
                $q->where('job_title', 'like', "%{$search}%");
            });
        }

        // Sort
        $sortField = $request->get('sort', 'employee_number');
        $sortOrder = $request->get('order', 'asc');

        if ($sortField === 'last_name') {
            $query->join('users', 'employees.user_id', '=', 'users.id')
                ->orderBy('users.last_name', $sortOrder)
                ->orderBy('users.first_name', $sortOrder)
                ->select('employees.*');
        } elseif ($sortField === 'hire_date') {
            $query->join('job_info', 'employees.id', '=', 'job_info.employee_id')
                ->orderBy('job_info.hire_date', $sortOrder)
                ->select('employees.*');
        } else {
            $query->orderBy($sortField, $sortOrder);
        }

        // Paginate
        $perPage = $request->get('per_page', 50);
        $employees = $query->paginate($perPage);

        // Transform data
        $data = $employees->map(function ($emp) {
            return $this->transformEmployee($emp);
        });

        return response()->json([
            'data' => $data,
            'meta' => [
                'total' => $employees->total(),
                'per_page' => $employees->perPage(),
                'current_page' => $employees->currentPage(),
                'last_page' => $employees->lastPage(),
            ]
        ]);
    }

    /**
     * Get directory view (alphabetically grouped employees).
     */
    public function directory(Request $request)
    {
        $orgId = $this->resolveOrgId($request);

        $employees = Employee::with(['jobInfo', 'user', 'manager.user'])
            ->where('organization_id', $orgId)
            ->where('status', 'active')
            ->get();

        // Group by first letter of last name
        $grouped = $employees->groupBy(function ($employee) {
            $lastName = $employee->user->last_name ?? $employee->user->name ?? '';
            return strtoupper(substr($lastName, 0, 1));
        })->map(function ($group) {
            return $group->map(function ($emp) {
                return $this->transformEmployeeForDirectory($emp);
            })->sortBy('last_name')->values();
        })->sortKeys();

        return response()->json($grouped);
    }

    /**
     * Get org chart data.
     */
    public function orgChart(Request $request)
    {
        $orgId = $this->resolveOrgId($request);
        $rootId = $request->get('root_id');

        if (!$rootId) {
            // Find top-level employee (no manager)
            $root = Employee::where('organization_id', $orgId)
                ->whereNull('reports_to_id')
                ->with(['user', 'jobInfo'])
                ->first();
        } else {
            $root = Employee::with(['user', 'jobInfo'])->findOrFail($rootId);
        }

        if (!$root) {
            return response()->json(['message' => 'No root employee found'], 404);
        }

        return response()->json($this->buildOrgTree($root));
    }

    /**
     * Get filter options with counts.
     */
    public function filterOptions(Request $request)
    {
        $orgId = $this->resolveOrgId($request);

        $employmentStatuses = DB::table('job_info')
            ->select('employment_status', DB::raw('COUNT(*) as count'))
            ->where('organization_id', $orgId)
            ->whereNotNull('employment_status')
            ->groupBy('employment_status')
            ->get()
            ->map(fn($item) => ['value' => $item->employment_status, 'count' => $item->count]);

        $departments = DB::table('job_info')
            ->select('department', DB::raw('COUNT(*) as count'))
            ->where('organization_id', $orgId)
            ->whereNotNull('department')
            ->groupBy('department')
            ->get()
            ->map(fn($item) => ['value' => $item->department, 'count' => $item->count]);

        $divisions = DB::table('job_info')
            ->select('division', DB::raw('COUNT(*) as count'))
            ->where('organization_id', $orgId)
            ->whereNotNull('division')
            ->groupBy('division')
            ->get()
            ->map(fn($item) => ['value' => $item->division, 'count' => $item->count]);

        $locations = DB::table('job_info')
            ->select('location', DB::raw('COUNT(*) as count'))
            ->where('organization_id', $orgId)
            ->whereNotNull('location')
            ->groupBy('location')
            ->get()
            ->map(fn($item) => ['value' => $item->location, 'count' => $item->count]);

        return response()->json([
            'employment_statuses' => $employmentStatuses,
            'departments' => $departments,
            'divisions' => $divisions,
            'locations' => $locations,
        ]);
    }

    /**
     * Get options for creating a new employee.
     */
    public function creationOptions(Request $request)
    {
        $orgId = $this->resolveOrgId($request);

        $fieldCategories = [
            'job_title',
            'department',
            'division',
            'location',
            'employment_status',
            'pay_schedule',
            'comp_change_reason',
            'overtime_status'
        ];

        $options = DB::table('employee_field_values')
            ->where('organization_id', $orgId)
            ->whereIn('category', $fieldCategories)
            ->orderBy('category')
            ->orderBy('sort_order')
            ->get()
            ->groupBy('category')
            ->map(function ($items) {
                return $items->map(fn($item) => $item->label);
            });

        // Add managers list
        $managers = Employee::with('user')
            ->where('organization_id', $orgId)
            ->where('status', 'active')
            ->get()
            ->map(fn($emp) => [
                'id' => $emp->id,
                'name' => $emp->user->full_name ?? $emp->user->name
            ]);

        return response()->json([
            'fields' => $options,
            'managers' => $managers
        ]);
    }

    /**
     * Store a new employee.
     */
    public function store(Request $request)
    {
        $orgId = $this->resolveOrgId($request);

        $validated = $request->validate([
            // Personal
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'preferred_name' => 'nullable|string|max:255',
            'email' => 'required|email|unique:users,email',
            'birth_date' => 'nullable|date',
            'gender' => 'nullable|string',
            'marital_status' => 'nullable|string',
            'ssn' => 'nullable|string',

            // Address
            'address_street_1' => 'nullable|string',
            'address_street_2' => 'nullable|string',
            'address_city' => 'nullable|string',
            'address_province' => 'nullable|string',
            'address_postal_code' => 'nullable|string',
            'address_country' => 'nullable|string',

            // Contact
            'phone_work' => 'nullable|string',
            'phone_work_ext' => 'nullable|string',
            'phone_mobile' => 'nullable|string',
            'home_phone' => 'nullable|string',
            'home_email' => 'nullable|email',

            // Job
            'hire_date' => 'required|date',
            'employee_number' => 'nullable|string|unique:employees,employee_number',
            'status' => 'required|string|in:active,terminated,on_leave',
            'job_title' => 'required|string',
            'department' => 'required|string',
            'division' => 'nullable|string',
            'location' => 'nullable|string',
            'employment_status' => 'nullable|string',
            'reports_to_id' => 'nullable|exists:employees,id',
            'ethnicity' => 'nullable|string',

            // Compensation
            'pay_rate' => 'nullable|numeric',
            'pay_type' => 'nullable|string',
            'pay_schedule' => 'nullable|string',
            'pay_currency' => 'nullable|string|max:3',
            'comp_effective_date' => 'nullable|date',
            'comp_change_reason' => 'nullable|string',
        ]);

        return DB::transaction(function () use ($validated, $orgId) {
            // 1. Create User
            $user = User::create([
                'organization_id' => $orgId,
                'name' => "{$validated['first_name']} {$validated['last_name']}",
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'middle_name' => $validated['middle_name'] ?? null,
                'preferred_name' => $validated['preferred_name'] ?? null,
                'email' => $validated['email'],
                'password' => bcrypt(Str::random(16)), // Temporary password
                'birth_date' => $validated['birth_date'] ?? null,
                'gender' => $validated['gender'] ?? null,
                'marital_status' => $validated['marital_status'] ?? null,
                'ssn' => $validated['ssn'] ?? null,
                'address_street_1' => $validated['address_street_1'] ?? null,
                'address_street_2' => $validated['address_street_2'] ?? null,
                'address_city' => $validated['address_city'] ?? null,
                'address_province' => $validated['address_province'] ?? null,
                'address_postal_code' => $validated['address_postal_code'] ?? null,
                'address_country' => $validated['address_country'] ?? null,
                'phone_work' => $validated['phone_work'] ?? null,
                'phone_work_ext' => $validated['phone_work_ext'] ?? null,
                'phone_mobile' => $validated['phone_mobile'] ?? null,
                'home_phone' => $validated['home_phone'] ?? null,
                'home_email' => $validated['home_email'] ?? null,
            ]);

            // 2. Create Employee
            $employee = Employee::create([
                'organization_id' => $orgId,
                'user_id' => $user->id,
                'employee_number' => $validated['employee_number'] ?? 'EMP-' . time(),
                'status' => $validated['status'],
                'reports_to_id' => $validated['reports_to_id'] ?? null,
            ]);

            // 3. Create JobInfo
            $employee->jobInfo()->create([
                'organization_id' => $orgId,
                'job_title' => $validated['job_title'],
                'department' => $validated['department'],
                'division' => $validated['division'] ?? null,
                'location' => $validated['location'] ?? null,
                'hire_date' => $validated['hire_date'],
                'employment_status' => $validated['employment_status'] ?? null,
                'ethnicity' => $validated['ethnicity'] ?? null,
                'pay_rate' => $validated['pay_rate'] ?? null,
                'pay_type' => $validated['pay_type'] ?? null,
                'pay_schedule' => $validated['pay_schedule'] ?? null,
                'pay_currency' => $validated['pay_currency'] ?? 'PHP',
                'pay_period' => 'Salary', // Default
                'comp_effective_date' => $validated['comp_effective_date'] ?? $validated['hire_date'],
                'comp_change_reason' => $validated['comp_change_reason'] ?? 'New Hire',
            ]);

            return response()->json([
                'message' => 'Employee created successfully',
                'employee' => $this->transformEmployee($employee->fresh(['user', 'jobInfo']))
            ], 201);
        });
    }

    /**
     * Get single employee details.
     */
    public function show($id)
    {
        $employee = Employee::with(['jobInfo', 'user', 'manager.user'])->find($id);

        if (!$employee) {
            return response()->json(['message' => 'Employee not found'], 404);
        }

        return response()->json($this->transformEmployeeForDirectory($employee));
    }

    /**
     * Get current employee (me).
     */
    public function me(Request $request)
    {
        // Try to resolve the current employee via authenticated user
        if ($request->user()) {
            $emp = Employee::with(['jobInfo', 'user'])
                ->where('user_id', $request->user()->id)
                ->first();
            if ($emp) {
                return response()->json($this->transformEmployee($emp));
            }
        }

        // Local dev fallback: first employee
        if (app()->environment('local')) {
            $emp = Employee::with(['jobInfo', 'user'])->orderBy('id')->first();
            if ($emp) {
                return response()->json($this->transformEmployee($emp));
            }

            return response()->json([
                'message' => 'No employees found in database. Please run seeders.',
                'hint' => 'Run: php artisan db:seed'
            ], 404);
        }

        return response()->json(['message' => 'Employee not found'], 404);
    }

    /**
     * Get time off balance for employee.
     */
    public function timeOffBalance($id)
    {
        $employee = Employee::with(['timeOffBalances', 'timeOffRequests'])->find($id);

        if (!$employee) {
            return response()->json(['message' => 'Employee not found'], 404);
        }

        return response()->json([
            'balances' => $employee->timeOffBalances,
            'requests' => $employee->timeOffRequests,
        ]);
    }

    /**
     * Get custom tabs for employee.
     */
    public function customTabs($id)
    {
        $employee = Employee::find($id);

        if (!$employee) {
            return response()->json(['message' => 'Employee not found'], 404);
        }

        $tabs = \App\Models\CustomTab::with([
            'fields.values' => function ($query) use ($employee) {
                $query->where('employee_id', $employee->id);
            }
        ])->orderBy('sort_order')->get();

        return response()->json($tabs);
    }

    /**
     * Get personal information for employee.
     */
    public function getPersonal($id)
    {
        $employee = Employee::with(['user.educations', 'user.visas'])->find($id);

        if (!$employee) {
            return response()->json(['message' => 'Employee not found'], 404);
        }

        $user = $employee->user;

        return response()->json([
            'basic' => [
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'middle_name' => $user->middle_name,
                'preferred_name' => $user->preferred_name,
                'birth_date' => $user->birth_date,
                'gender' => $user->gender,
                'marital_status' => $user->marital_status,
                'ssn' => $user->ssn,
                'tax_file_number' => $user->tax_file_number,
                'nin' => $user->nin,
                'shirt_size' => $user->shirt_size,
                'allergies' => $user->allergies,
                'dietary_restrictions' => $user->dietary_restrictions,
            ],
            'address' => [
                'address_street_1' => $user->address_street_1,
                'address_street_2' => $user->address_street_2,
                'address_city' => $user->address_city,
                'address_province' => $user->address_province,
                'address_postal_code' => $user->address_postal_code,
                'address_country' => $user->address_country,
            ],
            'contact' => [
                'phone_work' => $user->phone_work,
                'phone_mobile' => $user->phone_mobile,
                'home_phone' => $user->home_phone,
                'home_email' => $user->home_email,
                'email' => $user->email, // Work email
            ],
            'social' => [
                'linkedin_url' => $user->linkedin_url,
                'twitter_url' => $user->twitter_url,
                'facebook_url' => $user->facebook_url,
                'pinterest_url' => $user->pinterest_url,
                'instagram_url' => $user->instagram_url,
            ],
            'educations' => $user->educations,
            'visas' => $user->visas,
        ]);
    }

    /**
     * Update personal information for employee.
     */
    public function updatePersonal(Request $request, $id)
    {
        $employee = Employee::with('user')->find($id);

        if (!$employee) {
            return response()->json(['message' => 'Employee not found'], 404);
        }

        $user = $employee->user;

        $validated = $request->validate([
            'basic.first_name' => 'required|string|max:255',
            'basic.last_name' => 'required|string|max:255',
            'basic.middle_name' => 'nullable|string|max:255',
            'basic.preferred_name' => 'nullable|string|max:255',
            'basic.birth_date' => 'nullable|date',
            'basic.gender' => 'nullable|string',
            'basic.marital_status' => 'nullable|string',
            'basic.ssn' => 'nullable|string',
            'basic.tax_file_number' => 'nullable|string',
            'basic.nin' => 'nullable|string',
            'basic.shirt_size' => 'nullable|string',
            'basic.allergies' => 'nullable|string',
            'basic.dietary_restrictions' => 'nullable|string',

            'address.address_street_1' => 'nullable|string',
            'address.address_street_2' => 'nullable|string',
            'address.address_city' => 'nullable|string',
            'address.address_province' => 'nullable|string',
            'address.address_postal_code' => 'nullable|string',
            'address.address_country' => 'nullable|string',

            'contact.phone_work' => 'nullable|string',
            'contact.phone_mobile' => 'nullable|string',
            'contact.home_phone' => 'nullable|string',
            'contact.home_email' => 'nullable|email',

            'social.linkedin_url' => 'nullable|url',
            'social.twitter_url' => 'nullable|url',
            'social.facebook_url' => 'nullable|url',
            'social.pinterest_url' => 'nullable|url',
            'social.instagram_url' => 'nullable|url',

            'educations' => 'nullable|array',
            'educations.*.institution' => 'required|string',
            'educations.*.degree' => 'nullable|string',
            'educations.*.major' => 'nullable|string',
            'educations.*.gpa' => 'nullable|string',
            'educations.*.start_date' => 'nullable|date',
            'educations.*.end_date' => 'nullable|date',

            'visas' => 'nullable|array',
            'visas.*.visa_type' => 'required|string',
            'visas.*.issuing_country' => 'nullable|string',
            'visas.*.issued_date' => 'nullable|date',
            'visas.*.expiration_date' => 'nullable|date',
            'visas.*.status' => 'nullable|string',
            'visas.*.notes' => 'nullable|string',
        ]);

        return DB::transaction(function () use ($validated, $user) {
            // Update User fields
            // Flatten the nested arrays for the user update
            $userData = [];
            if (isset($validated['basic']))
                $userData = array_merge($userData, $validated['basic']);
            if (isset($validated['address']))
                $userData = array_merge($userData, $validated['address']);
            if (isset($validated['contact']))
                $userData = array_merge($userData, $validated['contact']);
            if (isset($validated['social']))
                $userData = array_merge($userData, $validated['social']);

            if (!empty($userData)) {
                $user->update($userData);
            }

            // Sync Education
            if (isset($validated['educations'])) {
                $user->educations()->delete();
                foreach ($validated['educations'] as $edu) {
                    $user->educations()->create($edu);
                }
            }

            // Sync Visas
            if (isset($validated['visas'])) {
                $user->visas()->delete();
                foreach ($validated['visas'] as $visa) {
                    $user->visas()->create($visa);
                }
            }

            return response()->json(['message' => 'Personal information updated successfully']);
        });
    }

    /**
     * Transform employee for list view.
     */
    private function transformEmployee($emp)
    {
        return [
            'id' => $emp->id,
            'employee_number' => $emp->employee_number,
            'first_name' => $emp->user->first_name ?? '',
            'last_name' => $emp->user->last_name ?? '',
            'full_name' => $emp->user->full_name ?? $emp->user->name,
            'email' => $emp->user->email,
            'photo_url' => $emp->user->photo_url,
            'job_title' => $emp->jobInfo->job_title ?? 'N/A',
            'department' => $emp->jobInfo->department ?? null,
            'division' => $emp->jobInfo->division ?? null,
            'location' => $emp->jobInfo->location ?? null,
            'employment_status' => $emp->jobInfo->employment_status ?? null,
            'hire_date' => $emp->jobInfo->hire_date ?? null,
            'manager' => $emp->manager ? [
                'id' => $emp->manager->id,
                'name' => $emp->manager->user->full_name ?? $emp->manager->user->name,
            ] : null,
        ];
    }

    /**
     * Transform employee for directory view.
     */
    private function transformEmployeeForDirectory($emp)
    {
        $directReports = $emp->directReports()->with('user')->get();
        $manager = $emp->manager()->with('user', 'jobInfo')->first();

        return [
            'id' => $emp->id,
            'employee_number' => $emp->employee_number,
            'first_name' => $emp->user->first_name ?? '',
            'last_name' => $emp->user->last_name ?? '',
            'full_name' => $emp->user->full_name ?? $emp->user->name,
            'email' => $emp->user->email,
            'photo_url' => $emp->user->photo_url,
            'job_title' => $emp->jobInfo->job_title ?? 'N/A',
            'department' => $emp->jobInfo->department ?? null,
            'division' => $emp->jobInfo->division ?? null,
            'location' => $emp->jobInfo->location ?? null,
            'employment_status' => $emp->jobInfo->employment_status ?? 'Full-Time',
            'hire_date' => $emp->jobInfo->hire_date ?? null,
            'timezone' => $emp->user->timezone,
            'local_time' => $emp->user->local_time,
            'region' => $emp->user->region,
            'phone_work' => $emp->user->phone_work,
            'phone_work_ext' => $emp->user->phone_work_ext,
            'phone_mobile' => $emp->user->phone_mobile,
            'manager' => $manager ? [
                'id' => $manager->id,
                'name' => $manager->user->full_name ?? $manager->user->name,
                'job_title' => $manager->jobInfo->job_title ?? 'N/A',
                'photo_url' => $manager->user->photo_url
            ] : null,
            'direct_reports' => $directReports->map(fn($r) => [
                'id' => $r->id,
                'name' => $r->user->full_name ?? $r->user->name
            ]),
            'direct_reports_count' => $directReports->count(),
            'social_links' => [
                'linkedin' => $emp->user->linkedin_url,
                'twitter' => $emp->user->twitter_url,
                'facebook' => $emp->user->facebook_url,
                'pinterest' => $emp->user->pinterest_url,
                'instagram' => $emp->user->instagram_url,
            ],
        ];
    }

    /**
     * Build org chart tree recursively.
     */
    private function buildOrgTree($employee, $depth = 0, $maxDepth = 10)
    {
        if ($depth >= $maxDepth) {
            return null;
        }

        $node = [
            'id' => $employee->id,
            'name' => $employee->user->full_name ?? $employee->user->name,
            'job_title' => $employee->jobInfo->job_title ?? 'N/A',
            'photo_url' => $employee->user->photo_url,
            'email' => $employee->user->email,
            'direct_reports_count' => $employee->directReports()->count(),
            'children' => []
        ];

        foreach ($employee->directReports()->with(['user', 'jobInfo'])->get() as $report) {
            $child = $this->buildOrgTree($report, $depth + 1, $maxDepth);
            if ($child) {
                $node['children'][] = $child;
            }
        }

        return $node;
    }

    /**
     * Resolve organization ID from request.
     */
    private function resolveOrgId(Request $request): int
    {
        $user = $request->user();
        if ($user && $user->organization_id) {
            return (int) $user->organization_id;
        }

        // Local fallback: first organization
        if (app()->environment('local')) {
            $orgId = (int) Organization::query()->value('id');
            if ($orgId)
                return $orgId;
        }

        abort(401, 'Unauthorized: organization context missing');
    }
}
