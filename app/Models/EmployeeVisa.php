<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmployeeVisa extends Model
{
    use HasFactory;

    protected $table = 'employee_visas';

    protected $fillable = [
        'user_id',
        'visa_type',
        'issuing_country',
        'issued_date',
        'expiration_date',
        'status',
        'notes',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
