<?php

namespace App\Models;

use App\Models\Traits\BelongsToOrganization;
use Illuminate\Database\Eloquent\Model;

class TimeOffBalance extends Model
{
    use BelongsToOrganization;

    protected $fillable = [
        'organization_id',
        'employee_id',
        'leave_type',
        'accrued_hours',
        'taken_hours',
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}
