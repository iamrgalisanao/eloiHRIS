<?php

namespace App\Models\Traits;

use App\Models\Scopes\OrganizationScope;
use App\Models\Organization;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

trait BelongsToOrganization
{
    /**
     * Boot the trait and apply the OrganizationScope.
     */
    protected static function bootBelongsToOrganization(): void
    {
        static::addGlobalScope(new OrganizationScope);

        static::creating(function ($model) {
            if (auth()->check() && !$model->organization_id) {
                $model->organization_id = auth()->user()->organization_id;
            }
        });
    }

    /**
     * Get the organization that owns the model.
     */
    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }
}
