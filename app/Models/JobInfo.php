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
    ];
}
