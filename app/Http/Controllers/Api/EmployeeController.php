<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    public function index()
    {
        $employees = Employee::with(['jobInfo', 'user'])->get()->map(function ($emp) {
            return [
                'id' => $emp->id,
                'name' => $emp->user->name,
                'job_title' => $emp->jobInfo->job_title ?? 'N/A',
                'department' => $emp->jobInfo->department ?? 'N/A',
                'email' => $emp->user->email,
                'employee_number' => $emp->employee_number,
                'status' => $emp->status,
            ];
        });

        return response()->json($employees);
    }

    public function show($id)
    {
        $employee = Employee::with(['jobInfo', 'user'])->find($id);

        if (!$employee) {
            return response()->json(['message' => 'Employee not found'], 404);
        }

        return response()->json([
            'id' => $employee->id,
            'name' => $employee->user->name,
            'job_title' => $employee->jobInfo->job_title ?? 'N/A',
            'department' => $employee->jobInfo->department ?? 'N/A',
            'email' => $employee->user->email,
            'employee_number' => $employee->employee_number,
            'manager' => [
                'name' => 'Michael Scott'
            ]
        ]);
    }

    public function me()
    {
        return $this->show(1);
    }

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

    public function customTabs($id)
    {
        $employee = Employee::find($id);

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
