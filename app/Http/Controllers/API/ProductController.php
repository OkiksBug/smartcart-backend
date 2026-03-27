<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        $query = Product::with('category');

        // optional filter by category name or id
        if (request()->has('category')) {
            $cat = request()->get('category');
            // if numeric, treat as id
            if (is_numeric($cat)) {
                $query->where('category_id', (int) $cat);
            } else {
                // filter by category name
                $query->whereHas('category', function ($q) use ($cat) {
                    $q->where('name', $cat);
                });
            }
        }

        $products = $query->get();
        return response()->json($products);
    }

    /**
     * Display the specified product with relations useful for mobile detail view.
     */
    public function show($id)
    {
    // Eager-load category, seller and reviews.user now that relations exist
    $product = Product::with(['category', 'seller', 'reviews.user'])->find($id);
        if (!$product) {
            return response()->json(['message' => 'Product not found.'], 404);
        }
        return response()->json($product);
    }
}
