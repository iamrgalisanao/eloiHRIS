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
        $headcount = Employee::count();
        $userEmp = Employee::with('user', 'jobInfo')->find(1); // Mocked logged-in user

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
            ->where('employee_id', 1)
            ->get();

        return response()->json([
            'user' => [
                'name' => $userEmp->user->name,
                'job_title' => $userEmp->jobInfo->job_title ?? 'Employee',
                'department' => $userEmp->jobInfo->department ?? 'General'
            ],
            'headcount' => $headcount,
            'departments' => $deptBreakdown,
            'upcoming_time_off' => $upcomingTimeOff,
            'personal_balances' => $personalBalances,
            'tasks' => [
                ['id' => 1, 'title' => 'Approve Pam\'s Vacation Request', 'type' => 'approval'],
                ['id' => 2, 'title' => 'Complete Performance Review for Dwight', 'type' => 'task'],
                ['id' => 3, 'title' => 'Upload updated Health Insurance forms', 'type' => 'document'],
            ],
            'announcements' => [
                ['title' => 'Scranton Chili Cook-off this Friday!', 'date' => '2026-01-30'],
                ['title' => 'New Expense Policy Updated', 'date' => '2026-01-25'],
            ],
            'pending_requests' => TimeOffRequest::where('status', 'pending')->count(),
        ]);
    }
}
