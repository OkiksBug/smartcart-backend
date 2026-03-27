<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = ['name','description','price','stock','category_id','image'];
    // Ensure accessor is included when model is serialized to JSON
    protected $appends = ['image_url'];

    public function category() {
        return $this->belongsTo(Category::class);
    }

    public function seller() {
        return $this->belongsTo(User::class, 'seller_id');
    }

    public function reviews() {
        return $this->hasMany(Review::class);
    }

    public function orderItems() {
        return $this->hasMany(OrderItem::class);
    }

    public function getImageUrlAttribute() {
        if (!$this->image) {
            return asset('images/placeholder.png');
        }
        
        // If already a full URL (starts with http), return as-is
        if (strpos($this->image, 'http') === 0) {
            return $this->image;
        }
        
        // Otherwise, prepend storage path
        return asset('storage/' . $this->image);
    }
}