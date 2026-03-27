<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\User;
use App\Models\Order;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::with('assignedStaff')->latest()->get();

        return Inertia::render('Categories/CategoryList', [
            'categories' => $categories,
        ]);
    }

    public function create()
    {
        $staffs = User::where('role', 'staff')
            ->whereDoesntHave('assignedCategory')
            ->select('id', 'name', 'email')
            ->get();

        return Inertia::render('Categories/CategoryForm', [
            'category' => null,
            'staffs' => $staffs,
        ]);
    }

    public function edit(Category $category)
    {
        $staffs = User::where('role', 'staff')
            ->where(function ($query) use ($category) {
                $query->whereDoesntHave('assignedCategory')
                      ->orWhere('id', $category->assigned_staff_id);
            })
            ->select('id', 'name', 'email')
            ->get();

        return Inertia::render('Categories/CategoryForm', [
            'category' => $category,
            'staffs' => $staffs,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:categories,name'],
            'assigned_staff_id' => [
                'required',
                'exists:users,id',
                'unique:categories,assigned_staff_id',
            ],
        ]);

        $staff = User::where('id', $validated['assigned_staff_id'])
            ->where('role', 'staff')
            ->first();

        if (!$staff) {
            return back()->withErrors([
                'assigned_staff_id' => 'Selected user is not a valid staff.',
            ]);
        }

        Category::create($validated);

        return redirect('/admin/categories')
            ->with('success', 'Category created successfully.');
    }

    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('categories', 'name')->ignore($category->id),
            ],
            'assigned_staff_id' => [
                'required',
                'exists:users,id',
                Rule::unique('categories', 'assigned_staff_id')->ignore($category->id),
            ],
        ]);

        $staff = User::where('id', $validated['assigned_staff_id'])
            ->where('role', 'staff')
            ->first();

        if (!$staff) {
            return back()->withErrors([
                'assigned_staff_id' => 'Selected user is not a valid staff.',
            ]);
        }

        $category->update($validated);

        // Propagate the assigned staff to existing orders that include products
        // from this category. We limit the update to active order statuses so
        // completed/delivered orders are not reassigned unexpectedly.
        $statusesToUpdate = ['Pending', 'Processing', 'Out for Delivery'];

        // make status check case-insensitive to catch 'pending' vs 'Pending' etc.
        $lowerStatuses = array_map('strtolower', $statusesToUpdate);

        $updatedCount = Order::whereIn(DB::raw('LOWER(status)'), $lowerStatuses)
            ->whereHas('items', function ($q) use ($category) {
                $q->whereHas('product', function ($q2) use ($category) {
                    $q2->where('category_id', $category->id);
                });
            })
            ->update(['assigned_staff_id' => $staff->id]);

        $message = 'Category updated successfully.';
        if ($updatedCount) {
            $message .= " {$updatedCount} order(s) were updated with the new assigned staff.";
        }

        // Redirect to orders list so admin can immediately see the propagated assignment
        return redirect('/admin/orders')
            ->with('success', $message);
    }

    public function destroy(Category $category)
    {
        $category->delete();

        return redirect()->route('categories.index')
            ->with('success', 'Category deleted successfully.');
    }
}