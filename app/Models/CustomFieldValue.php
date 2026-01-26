<?php

namespace App\Models;

use App\Models\Traits\BelongsToOrganization;
use Illuminate\Database\Eloquent\Model;

class CustomFieldValue extends Model
{
    use BelongsToOrganization;

    protected $fillable = ['organization_id', 'employee_id', 'field_id', 'value'];

    public function field()
    {
        return $this->belongsTo(CustomField::class, 'field_id');
    }

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}
