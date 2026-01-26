<?php

namespace App\Models;

use App\Models\Traits\BelongsToOrganization;
use Illuminate\Database\Eloquent\Model;

class CustomField extends Model
{
    use BelongsToOrganization;

    protected $fillable = ['organization_id', 'tab_id', 'label', 'type', 'config_json', 'sort_order'];

    protected $casts = [
        'config_json' => 'array'
    ];

    public function tab()
    {
        return $this->belongsTo(CustomTab::class, 'tab_id');
    }

    public function values()
    {
        return $this->hasMany(CustomFieldValue::class, 'field_id');
    }
}
