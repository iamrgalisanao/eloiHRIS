<?php

namespace App\Models;

use App\Models\Traits\BelongsToOrganization;
use Illuminate\Database\Eloquent\Model;

class JobInfo extends Model
{
    use BelongsToOrganization;

    protected $table = 'job_info';

    protected $fillable = [
        'organization_id',
        'employee_id',
        'job_title',
        'hire_date',
        'department',
        'division',
        'location',
        'employment_status',
        'comp_effective_date',
        'overtime_status',
        'comp_change_reason',
        'comp_comment',
        'pay_schedule',
        'pay_type',
        'pay_rate',
        'pay_currency',
        'pay_period',
        'ethnicity',
    ];
}
