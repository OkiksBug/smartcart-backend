<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AdminNotification;
use App\Models\Order;

class NotificationController extends Controller
{
    // GET /api/notifications
    public function index(Request $request)
    {
        $perPage = (int) $request->query('per_page', 20);
        $page = max(1, (int) $request->query('page', 1));

        $user = $request->user();

        // Get order ids that belong to this user
        $orderIds = Order::where('user_id', $user->id)->pluck('id')->toArray();

        // If user has no orders, return empty
        if (empty($orderIds)) {
            return response()->json([
                'items' => [],
                'meta' => [
                    'page' => $page,
                    'per_page' => $perPage,
                    'total' => 0,
                    'unseen_count' => 0,
                    'has_more' => false,
                ]
            ]);
        }

        // Only return notifications of type 'order' that reference this user's orders
        $query = AdminNotification::where('type', 'order')->whereIn('reference_id', $orderIds)->orderBy('created_at', 'desc');
        $total = $query->count();
        $items = $query->skip(($page - 1) * $perPage)->take($perPage)->get();

        $unseen = AdminNotification::where('type', 'order')->whereIn('reference_id', $orderIds)->where('is_seen', false)->count();

        return response()->json([
            'items' => $items,
            'meta' => [
                'page' => $page,
                'per_page' => $perPage,
                'total' => $total,
                'unseen_count' => $unseen,
                'has_more' => ($page * $perPage) < $total,
            ]
        ]);
    }

    // POST /api/notifications/mark-seen
    public function markSeen(Request $request)
    {
        $ids = $request->input('ids', []);
        AdminNotification::whereIn('id', $ids)->update(['is_seen' => true]);
        return response()->json(['ok' => true]);
    }
}
