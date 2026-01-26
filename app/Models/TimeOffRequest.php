<?php

namespace App\Models;

use App\Models\Traits\BelongsToOrganization;
use Illuminate\Database\Eloquent\Model;

class TimeOffRequest extends Model
{
    use BelongsToOrganization;

    protected $fillable = [
        'organization_id',
        'employee_id',
        'leave_type',
        'start_date',
        'end_date',
        'total_hours',
        'status',
        'admin_note',
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}
