<?php

namespace App\Models;

use App\Models\Traits\BelongsToOrganization;
use Illuminate\Database\Eloquent\Model;

class CustomTab extends Model
{
    use BelongsToOrganization;

    protected $fillable = ['organization_id', 'label', 'sort_order'];

    public function fields()
    {
        return $this->hasMany(CustomField::class, 'tab_id')->orderBy('sort_order');
    }
}
