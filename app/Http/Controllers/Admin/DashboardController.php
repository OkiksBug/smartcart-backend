<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Product;
use App\Models\Order;
use App\Models\Category;

class DashboardController extends Controller
{
    public function index() {
        // Count statistics
        $usersCount = User::count();
        $productsCount = Product::count();
        $ordersCount = Order::count();
        $categoriesCount = Category::count();

        // Revenue calculation
        $totalRevenue = Order::where('status', 'Delivered')->sum('total_price');

        // Order status breakdown
        $pendingOrders = Order::where('status', 'Pending')->count();
        $processingOrders = Order::where('status', 'Processing')->count();
        $outForDeliveryOrders = Order::where('status', 'Out for Delivery')->count();
        $deliveredOrders = Order::where('status', 'Delivered')->count();

        // Recent orders (last 5)
        $recentOrders = Order::with(['user', 'assignedStaff'])
            ->latest()
            ->limit(5)
            ->get();

        // Top 5 products by sales
        $topProducts = Product::whereHas('orderItems')
            ->with(['category'])
            ->get()
            ->map(function($product) {
                $product->total_sold = $product->orderItems()->sum('quantity');
                return $product;
            })
            ->sortByDesc('total_sold')
            ->take(5)
            ->values();

        return Inertia::render('Dashboard', [
            'stats' => [
                'totalUsers' => $usersCount,
                'totalProducts' => $productsCount,
                'totalOrders' => $ordersCount,
                'totalCategories' => $categoriesCount,
                'totalRevenue' => $totalRevenue,
                'pendingOrders' => $pendingOrders,
                'processingOrders' => $processingOrders,
                'outForDeliveryOrders' => $outForDeliveryOrders,
                'deliveredOrders' => $deliveredOrders,
            ],
            'recentOrders' => $recentOrders,
            'topProducts' => $topProducts,
        ]);
    }
}