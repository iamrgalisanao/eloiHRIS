<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmployeeEducation extends Model
{
    use HasFactory;

    protected $table = 'employee_educations';

    protected $fillable = [
        'user_id',
        'institution',
        'degree',
        'major',
        'gpa',
        'start_date',
        'end_date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
