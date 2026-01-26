<?php

namespace App\Models;

use App\Models\Traits\BelongsToOrganization;
use Illuminate\Database\Eloquent\Model;

class Candidate extends Model
{
    use BelongsToOrganization;

    protected $fillable = [
        'organization_id',
        'job_opening_id',
        'name',
        'email',
        'status',
        'resume_path',
    ];

    public function jobOpening()
    {
        return $this->belongsTo(JobOpening::class);
    }
}
