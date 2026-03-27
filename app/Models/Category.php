<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = ['name', 'assigned_staff_id'];

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function assignedStaff()
    {
        return $this->belongsTo(User::class, 'assigned_staff_id');
    }

    public function staff()
    {
        return $this->belongsToMany(User::class, 'category_staff', 'category_id', 'staff_id');
    }
}