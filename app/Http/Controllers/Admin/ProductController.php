<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    // List all products
    public function index()
    {
        $products = Product::with('category')->latest()->get();
        return Inertia::render('Products/ProductList', compact('products'));
    }

    // Show create form
    public function create()
    {
        $categories = Category::all();
        return Inertia::render('Products/ProductForm', ['product' => null, 'categories' => $categories]);
    }

    // Show edit form
    public function show(Product $product)
    {
        $product->load('category');
        $categories = Category::all();
        return Inertia::render('Products/ProductForm', compact('product','categories'));
    }

    // Create product
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'=>'required|string',
            'price'=>'required|numeric',
            'stock'=>'required|integer',
            'category_id'=>'required|exists:categories,id',
            'description'=>'nullable|string',
            'image'=>'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('products', 'public');
            $validated['image'] = $imagePath;
        }

        Product::create($validated);

        return redirect()->route('products.index')
            ->with('success','Product created successfully.');
    }

    // Update product
    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name'=>'required|string',
            'price'=>'required|numeric',
            'stock'=>'required|integer',
            'category_id'=>'required|exists:categories,id',
            'description'=>'nullable|string',
            'image'=>'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($product->image) {
                \Storage::disk('public')->delete($product->image);
            }
            $imagePath = $request->file('image')->store('products', 'public');
            $validated['image'] = $imagePath;
        }

        $product->update($validated);

        return redirect()->route('products.index')
            ->with('success','Product updated successfully.');
    }

    // Delete product
    public function destroy(Product $product)
    {
        // Delete image if exists
        if ($product->image) {
            \Storage::disk('public')->delete($product->image);
        }
        $product->delete();
        return redirect()->route('products.index')
            ->with('success','Product deleted successfully.');
    }
}