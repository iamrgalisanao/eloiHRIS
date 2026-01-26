<?php

namespace App\Models;

use App\Models\Traits\BelongsToOrganization;
use Illuminate\Database\Eloquent\Model;

class JobOpening extends Model
{
    use BelongsToOrganization;

    protected $fillable = [
        'organization_id',
        'title',
        'department',
        'description',
        'status',
    ];

    public function candidates()
    {
        return $this->hasMany(Candidate::class, 'job_opening_id');
    }
}
