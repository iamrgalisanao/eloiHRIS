<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\TimeOffRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function index()
    {
        return response()->json([
            ['id' => 'headcount', 'name' => 'Headcount Trend', 'category' => 'Workforce'],
            ['id' => 'time-off', 'name' => 'Leave Utilization', 'category' => 'Time Off'],
            ['id' => 'department', 'name' => 'Department Growth', 'category' => 'Organization'],
        ]);
    }

    public function headcount()
    {
        // Simple monthly trend for the last 6 months
        $trend = [
            ['month' => 'Aug', 'count' => 12],
            ['month' => 'Sep', 'count' => 14],
            ['month' => 'Oct', 'count' => 15],
            ['month' => 'Nov', 'count' => 18],
            ['month' => 'Dec', 'count' => 22],
            ['month' => 'Jan', 'count' => Employee::count()],
        ];

        return response()->json($trend);
    }

    public function timeOff()
    {
        $utilization = DB::table('time_off_balances')
            ->select('leave_type', DB::raw('SUM(taken_hours) as total_taken'))
            ->groupBy('leave_type')
            ->get();

        return response()->json($utilization);
    }
}
