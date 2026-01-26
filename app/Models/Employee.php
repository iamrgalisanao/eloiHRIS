<?php

namespace App\Models;

use App\Models\Traits\BelongsToOrganization;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use BelongsToOrganization;

    protected $fillable = [
        'organization_id',
        'user_id',
        'employee_number',
        'status',
        'reports_to_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function jobInfo()
    {
        return $this->hasOne(JobInfo::class, 'employee_id');
    }

    public function timeOffBalances()
    {
        return $this->hasMany(TimeOffBalance::class);
    }

    public function timeOffRequests()
    {
        return $this->hasMany(TimeOffRequest::class);
    }

    public function customFieldValues()
    {
        return $this->hasMany(CustomFieldValue::class);
    }

    public function goals()
    {
        return $this->hasMany(Goal::class);
    }

    public function trainings()
    {
        return $this->hasMany(Training::class);
    }

    public function activities()
    {
        return $this->hasMany(Activity::class);
    }

    public function directReports()
    {
        return $this->hasMany(Employee::class, 'reports_to_id');
    }
}
