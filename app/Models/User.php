<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

use App\Models\Traits\BelongsToOrganization;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens, BelongsToOrganization;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'organization_id',
        'first_name',
        'last_name',
        'photo_url',
        'phone_work',
        'phone_work_ext',
        'phone_mobile',
        'timezone',
        'region',
        'linkedin_url',
        'twitter_url',
        'facebook_url',
        'pinterest_url',
        'instagram_url',
        'middle_name',
        'preferred_name',
        'birth_date',
        'gender',
        'marital_status',
        'ssn',
        'address_street_1',
        'address_street_2',
        'address_city',
        'address_province',
        'address_postal_code',
        'address_country',
        'home_phone',
        'home_email',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the user's full name.
     */
    public function getFullNameAttribute(): string
    {
        if ($this->first_name && $this->last_name) {
            return "{$this->first_name} {$this->last_name}";
        }
        return $this->name ?? '';
    }

    /**
     * Get the user's local time.
     */
    public function getLocalTimeAttribute(): ?string
    {
        if (!$this->timezone) {
            return null;
        }

        try {
            $now = new \DateTime('now', new \DateTimeZone($this->timezone));
            return $now->format('g:i A');
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Get the employee record for this user.
     */
    public function employee()
    {
        return $this->hasOne(Employee::class);
    }
}
