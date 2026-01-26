<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\TimeOffRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function stats()
    {
        $org = DB::table('organizations')->first();
        if (!$org)
            return response()->json(['error' => 'No organization found'], 404);

        $currentUser = Employee::with('user', 'jobInfo')->where('employee_number', 'EMP450')->first();
        if (!$currentUser)
            return response()->json(['error' => 'User not found'], 404);

        $headcount = Employee::count();

        $deptBreakdown = DB::table('job_info')
            ->select('department', DB::raw('count(*) as count'))
            ->groupBy('department')
            ->get();

        $upcomingTimeOff = TimeOffRequest::with('employee.user')
            ->where('start_date', '>=', now())
            ->where('start_date', '<=', now()->addDays(14))
            ->where('status', 'approved')
            ->get()
            ->map(function ($req) {
                return [
                    'name' => $req->employee->user->name,
                    'start' => $req->start_date,
                    'end' => $req->end_date,
                    'type' => $req->leave_type
                ];
            });

        $personalBalances = DB::table('time_off_balances')
            ->where('employee_id', $currentUser->id)
            ->get();

        // --- Fetch Real Activities ---
        $activities = \App\Models\Activity::where('employee_id', $currentUser->id)
            ->orWhereNull('employee_id')
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get()
            ->map(function ($act) {
                return [
                    'title' => $act->title,
                    'sub' => $act->description,
                    'type' => $act->type,
                    'badge' => $act->metadata['badge'] ?? null,
                    'highlight' => $act->metadata['highlight'] ?? null,
                    'icon' => $act->metadata['icon'] ?? null,
                    'avatar' => $act->metadata['avatar'] ?? null,
                ];
            });

        // --- Fetch Real My Stuff (Goals & Trainings) ---
        $goals = \App\Models\Goal::where('employee_id', $currentUser->id)->get();
        $trainings = \App\Models\Training::where('employee_id', $currentUser->id)->get();

        $myStuff = [
            'goals' => [
                'count' => $goals->count(),
                'active' => $goals->where('status', 'active')->count(),
                'soonest_due' => $goals->where('status', 'active')->min('due_date'),
            ],
            'trainings' => [
                'count' => $trainings->count(),
                'active' => $trainings->where('status', 'active')->count(),
                'past_due' => $trainings->where('status', 'past due')->count(),
            ]
        ];

        // --- Fetch Real Direct Reports ---
        $directReports = Employee::with(['user', 'jobInfo'])
            ->where('reports_to_id', $currentUser->id)
            ->get()
            ->map(function ($emp) {
                return [
                    'name' => $emp->user->name,
                    'job_title' => $emp->jobInfo->job_title ?? 'Employee',
                    'avatar' => "https://i.pravatar.cc/150?u=" . urlencode($emp->user->name)
                ];
            });

        return response()->json([
            'user' => [
                'name' => $currentUser->user->name,
                'job_title' => $currentUser->jobInfo->job_title ?? 'Employee',
                'department' => $currentUser->jobInfo->department ?? 'General'
            ],
            'headcount' => $headcount,
            'departments' => $deptBreakdown,
            'upcoming_time_off' => $upcomingTimeOff,
            'personal_balances' => $personalBalances,
            'activities' => $activities,
            'my_stuff' => $myStuff,
            'direct_reports' => $directReports,
            'celebrations' => [
                ['name' => 'Daniel Vance', 'type' => 'Birthday', 'date' => 'February 27', 'avatar' => 'https://i.pravatar.cc/150?u=daniel'],
                ['name' => 'Angela Martin', 'type' => 'Work Anniversary', 'date' => 'February 15', 'avatar' => 'https://i.pravatar.cc/150?u=angela'],
            ],
            'new_hires' => [
                ['name' => 'Jim Halpert', 'start_date' => 'Saturday, Jan 17', 'avatar' => 'https://i.pravatar.cc/150?u=jim'],
            ],
            'trainings_summary' => [ // List of training names for the card
                ['title' => 'Annual Security Training'],
                ['title' => 'HR Advantage Package'],
            ],
            'onboarding' => [
                ['date' => 'Wednesday, Feb 4', 'on_track' => 1],
                ['date' => 'Friday, Feb 13', 'on_track' => 1],
            ],
            'company_links' => [
                ['category' => 'Company', 'links' => ['Company website']],
                ['category' => 'Benefits', 'links' => ['401k', 'Health', 'Vision', 'Dental']],
            ]
        ]);
    }
}
