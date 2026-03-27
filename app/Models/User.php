<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements CanResetPasswordContract
{
    use HasApiTokens, Notifiable, CanResetPassword;

    // append computed attributes when model is serialized
    protected $appends = ['assigned_category_name'];

    protected $fillable = ['name','email','password','role','avatar','notifications_enabled'];

    protected $casts = [
        'notifications_enabled' => 'boolean',
    ];

    protected $hidden = ['password','remember_token'];

    /**
     * Return the name of the category assigned to this staff (if any).
     * This makes it available as $user->assigned_category_name in API responses.
     */
    public function getAssignedCategoryNameAttribute()
    {
        // Use the relation if loaded, otherwise it will lazy-load automatically.
        return optional($this->assignedCategory)->name;
    }

    // CUSTOMER: orders na ginawa niya
    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    // STAFF: orders na naka-assign sa kanya
    public function assignedOrders()
    {
        return $this->hasMany(Order::class, 'assigned_staff_id');
    }

    // ✅ STAFF: category na naka-assign sa kanya (ONE ONLY)
    public function assignedCategory()
    {
        return $this->hasOne(Category::class, 'assigned_staff_id');
    }

    // ✅ STAFF: categories na naka-assign sa kanya (MANY)
    public function categories()
    {
        return $this->belongsToMany(Category::class, 'category_staff', 'staff_id', 'category_id');
    }
}