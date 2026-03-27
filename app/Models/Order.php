<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'assigned_staff_id',
        'status',
        'total_price',
        // metadata
        'recipient_name',
        'phone',
        'address',
        'delivery_instructions',
        'delivery_type',
        'scheduled_at',
        'payment_method',
        'payment_details',
    ];

    protected $casts = [
        'payment_details' => 'array',
        'scheduled_at' => 'datetime',
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function assignedStaff() {
        return $this->belongsTo(User::class,'assigned_staff_id');
    }

    public function items() {
        return $this->hasMany(OrderItem::class);
    }
}