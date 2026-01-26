<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    /**
     * Get the 'Golden Record' for the current user.
     * For Phase 1/2 demo, we return the first employee.
     */
    public function me()
    {
        $employee = Employee::with(['jobInfo', 'user'])
            ->first();

        if (!$employee) {
            return response()->json(['message' => 'Employee not found'], 404);
        }

        // Format for the frontend
        return response()->json([
            'id' => $employee->id,
            'name' => $employee->user->name,
            'job_title' => $employee->jobInfo->job_title ?? 'N/A',
            'department' => $employee->jobInfo->department ?? 'N/A',
            'email' => $employee->user->email,
            'employee_number' => $employee->employee_number,
            'manager' => [
                'name' => 'David Wallace' // Static for now as per mock
            ]
        ]);
    }

    public function timeOffBalance()
    {
        $employee = Employee::with(['timeOffBalances', 'timeOffRequests'])
            ->first();

        if (!$employee) {
            return response()->json(['message' => 'Employee not found'], 404);
        }

        return response()->json([
            'balances' => $employee->timeOffBalances,
            'requests' => $employee->timeOffRequests,
        ]);
    }

    public function customTabs()
    {
        $employee = Employee::first(); // Demo targets Michael Scott

        if (!$employee) {
            return response()->json(['message' => 'Employee not found'], 404);
        }

        // Fetch tabs with fields, and for each field, get the value for this specific employee
        $tabs = \App\Models\CustomTab::with([
            'fields.values' => function ($query) use ($employee) {
                $query->where('employee_id', $employee->id);
            }
        ])->orderBy('sort_order')->get();

        return response()->json($tabs);
    }
}
