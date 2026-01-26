<?php

namespace App\Models;

use App\Models\Traits\BelongsToOrganization;
use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    use BelongsToOrganization;

    protected $fillable = [
        'organization_id',
        'employee_id',
        'original_name',
        'file_path',
        'file_size',
        'mime_type',
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}
