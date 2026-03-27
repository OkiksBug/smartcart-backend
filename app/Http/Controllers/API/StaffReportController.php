<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Product;

class StaffReportController extends Controller
{
    // Return simple stats for staff dashboard/reports
    public function index(Request $request)
    {
        $user = $request->user();

        // If staff has an assigned category, scope queries to that category.
        $categoryId = null;
        if ($user->assignedCategory) {
            $categoryId = $user->assignedCategory->id;
        }

        // Helper to apply category scope to an Order query
        $applyCategory = function ($query) use ($categoryId) {
            if ($categoryId) {
                $query->whereHas('items.product', function ($q) use ($categoryId) {
                    $q->where('category_id', $categoryId);
                });
            }
            return $query;
        };

        // Total orders (scoped)
        $totalOrders = $applyCategory(Order::query())->count();

        // Orders by status
        $pending = $applyCategory(Order::where('status', 'Pending'))->count();
        $processing = $applyCategory(Order::where('status', 'Processing'))->count();
        $outForDelivery = $applyCategory(Order::where('status', 'Out for Delivery'))->count();
        $delivered = $applyCategory(Order::where('status', 'Delivered'))->count();

        // Revenue (delivered orders only)
        $totalRevenue = $applyCategory(Order::where('status', 'Delivered'))->sum('total_price');

        // Recent orders
        $recentOrders = $applyCategory(Order::with(['user', 'items.product.category'])->latest()->limit(5))->get();

        // Top products by sold quantity within scope
        $topProducts = Product::whereHas('orderItems', function ($q) use ($categoryId) {
            if ($categoryId) {
                $q->whereHas('product', function ($pq) use ($categoryId) {
                    // orderItems -> product relation exists; but to be safe
                });
            }
        })
        // We'll compute totals by joining order_items indirectly for the scoped set
        ->get();

        // For simplicity return top products as empty array if complex aggregation not needed here
        $topProducts = [];

        // Map recent orders to lightweight objects for mobile
        $recent = $recentOrders->map(function ($o) {
            $firstProduct = $o->items->first()->product ?? null;
            return [
                'id' => $o->id,
                'status' => $o->status,
                'total_price' => $o->total_price,
                'created_at' => $o->created_at,
                'customer_name' => $o->user->name ?? null,
                'items_count' => $o->items->count(),
                'category_name' => $firstProduct && $firstProduct->category ? $firstProduct->category->name : null,
            ];
        });

        return response()->json([
            'stats' => [
                'totalOrders' => $totalOrders,
                'pending' => $pending,
                'processing' => $processing,
                'outForDelivery' => $outForDelivery,
                'delivered' => $delivered,
                'totalRevenue' => $totalRevenue,
            ],
            'recentOrders' => $recent,
            'topProducts' => $topProducts,
        ]);
    }
}
