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

        return response()->json([
            'headcount' => $headcount,
            'departments' => $deptBreakdown,
            'upcoming_time_off' => $upcomingTimeOff,
            'new_hires_month' => 1, // Mock
            'pending_requests' => TimeOffRequest::where('status', 'pending')->count(),
        ]);
    }
}
