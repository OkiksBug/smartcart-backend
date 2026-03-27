<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use App\Models\Order;
use App\Models\AdminNotification;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Schema;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Force HTTPS in production
        if (config('app.env') === 'production') {
            \URL::forceScheme('https');
        }

        // NOTE: Disabled notifications during bootstrap to prevent DB timeout issues
        // Re-enable after database migrations complete
        /*
        if (class_exists(Inertia::class)) {
            Inertia::share('notifications', function () {
                try {
                    // If the notifications table hasn't been migrated yet, return empty payload
                    if (! Schema::hasTable('admin_notifications')) {
                        return ['items' => [], 'unseen_count' => 0];
                    }

                    // Create / sync notifications for new orders and low-stock products
                    $lowStockThreshold = 10;

                    // recent pending orders — only if orders table exists
                    if (Schema::hasTable('orders')) {
                        $orders = Order::with('user')
                            ->where('status', 'pending')
                            ->latest()
                            ->take(10)
                            ->get();

                        foreach ($orders as $order) {
                            $exists = AdminNotification::where('type', 'order')
                                ->where('reference_id', $order->id)
                                ->exists();

                            if (! $exists) {
                                AdminNotification::create([
                                    'type' => 'order',
                                    'reference_id' => $order->id,
                                    'title' => "New Order #{$order->id}",
                                    'message' => ($order->user ? $order->user->name : 'Guest') . " placed an order (₱" . number_format($order->total_price, 2) . ")",
                                    'url' => route('orders.show', ['order' => $order->id]),
                                ]);
                            }
                        }
                    }

                    // low stock products — only if products table exists
                    if (Schema::hasTable('products')) {
                        $lowProducts = \App\Models\Product::where('stock', '<=', $lowStockThreshold)
                            ->orderBy('stock', 'asc')
                            ->take(10)
                            ->get();

                        foreach ($lowProducts as $p) {
                            $exists = AdminNotification::where('type', 'stock')
                                ->where('reference_id', $p->id)
                                ->exists();

                            if (! $exists) {
                                AdminNotification::create([
                                    'type' => 'stock',
                                    'reference_id' => $p->id,
                                    'title' => "Low stock: {$p->name}",
                                    'message' => "Only {$p->stock} left in stock",
                                    'url' => route('products.show', ['product' => $p->id]),
                                ]);
                            }
                        }
                    }

                    // now fetch latest notifications (limit 8) and unseen count
                    $latest = AdminNotification::orderBy('created_at', 'desc')->take(8)->get();
                    $unseenCount = AdminNotification::where('is_seen', false)->count();

                    return [
                        'items' => $latest->map(function ($n) {
                            return [
                                'id' => $n->id,
                                'type' => $n->type,
                                'title' => $n->title,
                                'message' => $n->message,
                                'time' => Carbon::parse($n->created_at)->diffForHumans(),
                                'url' => $n->url,
                                'is_seen' => (bool) $n->is_seen,
                            ];
                        })->toArray(),
                        'unseen_count' => $unseenCount,
                    ];
                } catch (\Exception $e) {
                    // If anything goes wrong (DB not ready during migration/seeding), return empty payload
                    return ['items' => [], 'unseen_count' => 0];
                }
            });
        }
        */
    }
}
