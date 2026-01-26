<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TimeOffBalance;
use App\Models\TimeOffRequest;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TimeOffRequestController extends Controller
{
    /**
     * Store a new time off request and auto-calculate balance.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'leave_type' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'total_hours' => 'required|numeric|min:1',
            'note' => 'nullable|string',
        ]);

        // For Phase 2 Demo, we always target the first employee (Michael Scott)
        $employee = Employee::first();

        return DB::transaction(function () use ($employee, $validated) {
            // 1. Check Balance
            $balance = TimeOffBalance::where('employee_id', $employee->id)
                ->where('leave_type', $validated['leave_type'])
                ->first();

            if (!$balance || ($balance->accrued_hours - $balance->taken_hours) < $validated['total_hours']) {
                return response()->json([
                    'message' => 'Insufficient balance for this request.'
                ], 422);
            }

            // 2. Create Request
            $timeOffRequest = TimeOffRequest::create([
                'organization_id' => $employee->organization_id,
                'employee_id' => $employee->id,
                'leave_type' => $validated['leave_type'],
                'start_date' => $validated['start_date'],
                'end_date' => $validated['end_date'],
                'total_hours' => $validated['total_hours'],
                'status' => 'approved', // Auto-approving for prototype demo
                'admin_note' => $validated['note'] ?? 'Auto-approved by System',
            ]);

            // 3. Deduct Balance
            $balance->increment('taken_hours', $validated['total_hours']);

            return response()->json([
                'message' => 'Time off request submitted and approved!',
                'request' => $timeOffRequest,
                'new_balance' => $balance->accrued_hours - $balance->taken_hours
            ]);
        });
    }
}
