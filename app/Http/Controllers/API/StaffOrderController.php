<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;

class StaffOrderController extends Controller
{
    // Return orders assigned to the authenticated staff user (or by assigned category)
    public function index(Request $request)
    {
        $user = $request->user();

        // If user has an assigned category, filter by it; otherwise return empty
        $categoryId = null;
        if ($user->assignedCategory) {
            $categoryId = $user->assignedCategory->id;
        }

        // eager load related models we actually have on Order
        $query = Order::query()->with('user', 'items.product.category', 'assignedStaff');

        // orders table doesn't store category_id directly. Filter orders that include
        // at least one item whose product belongs to the staff's assigned category.
        if ($categoryId) {
            $query->whereHas('items.product', function ($q) use ($categoryId) {
                $q->where('category_id', $categoryId);
            });
        }

        $orders = $query->orderBy('created_at', 'desc')->get();

        // add a few convenient fields used by the mobile client
        $payload = $orders->map(function ($o) {
            $customerName = $o->user->name ?? null;
            // derive a category name from the first item's product category if available
            $categoryName = null;
            if ($o->items && $o->items->count() > 0) {
                $firstProduct = $o->items->first()->product ?? null;
                $categoryName = $firstProduct && $firstProduct->category ? $firstProduct->category->name : null;
            }

            return array_merge($o->toArray(), [
                'customer_name' => $customerName,
                'category_name' => $categoryName,
                'items_count' => $o->items->count(),
            ]);
        });

        return response()->json(['orders' => $payload]);
    }

    public function show($id, Request $request)
    {
    $order = Order::with('user', 'items.product.category', 'assignedStaff')->find($id);
        if (! $order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        $orderArr = $order->toArray();
        $orderArr['customer_name'] = $order->user->name ?? null;
        $orderArr['items_count'] = $order->items->count();
        $firstProduct = $order->items->first()->product ?? null;
        $orderArr['category_name'] = $firstProduct && $firstProduct->category ? $firstProduct->category->name : null;

        return response()->json(['order' => $orderArr]);
    }

    // Allow an authenticated staff user to update the status of an order assigned to them
    public function updateStatus($id, Request $request)
    {
        $user = $request->user();

        // validate incoming status
        $validated = $request->validate([
            'status' => 'required|string|in:pending,processing,out_for_delivery,delivered,cancelled',
        ]);

        $order = Order::with('items.product', 'assignedStaff')->find($id);
        if (! $order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        // Verify the staff user is allowed to update this order: either assigned_staff_id matches or at least one item matches their assigned category
        $allowed = false;
        if ($order->assigned_staff_id && $user->id === $order->assigned_staff_id) {
            $allowed = true;
        } else if ($user->assignedCategory) {
            $catId = $user->assignedCategory->id;
            foreach ($order->items as $it) {
                if ($it->product && $it->product->category_id == $catId) {
                    $allowed = true;
                    break;
                }
            }
        }

        if (! $allowed) {
            return response()->json(['message' => 'Not authorized to update this order'], 403);
        }

        // Map canonical incoming status tokens to the database/display values
        // (the orders.status column uses capitalized / human-friendly strings)
        $statusMap = [
            'pending' => 'Pending',
            'processing' => 'Processing',
            'out_for_delivery' => 'Out for Delivery',
            'delivered' => 'Delivered',
            'cancelled' => 'Cancelled',
        ];

        $dbStatus = $statusMap[$validated['status']] ?? $validated['status'];
        $order->status = $dbStatus;
        if ($validated['status'] === 'delivered') {
            $order->delivered_at = now();
        }
        $order->save();

        return response()->json(['order' => $order]);
    }
}
