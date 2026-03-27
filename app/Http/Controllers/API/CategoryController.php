<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        // include staff and products count
        $categories = Category::with('staff')
            ->withCount('products')
            ->get()
            ->map(function ($c) {
                return [
                    'id' => $c->id,
                    'name' => $c->name,
                    'assigned_staff' => $c->assignedStaff ?? null,
                    'products_count' => $c->products_count,
                ];
            });

        return response()->json($categories);
    }
}