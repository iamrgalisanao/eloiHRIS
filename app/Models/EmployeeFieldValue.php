<?php

namespace App\Models;

use App\Models\Traits\BelongsToOrganization;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class EmployeeFieldValue extends Model
{
    use HasFactory;
    use BelongsToOrganization;

    protected $fillable = [
        'organization_id',
        'category',
        'label',
        'label_slug',
        'sort_order',
    ];

    /**
     * Normalize free-text labels to a case-insensitive slug used for uniqueness.
     */
    public static function makeLabelSlug(string $label): string
    {
        $normalized = preg_replace('/\s+/', ' ', trim($label));
        return Str::of($normalized)->lower()->toString();
    }

    /**
     * Ensure label_slug stays in sync when setting label.
     */
    public function setLabelAttribute($value): void
    {
        $this->attributes['label'] = $value;
        $this->attributes['label_slug'] = static::makeLabelSlug((string) $value);
    }

    /**
     * Scope by category.
     */
    public function scopeCategory($query, string $category)
    {
        return $query->where('category', $category);
    }
}
