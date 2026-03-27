<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AdminNotification;

class NotificationsController extends Controller
{
    // GET /admin/notifications?page=1
    public function index(Request $request)
    {
        $perPage = 6;
        $page = max(1, (int) $request->query('page', 1));

        $query = AdminNotification::orderBy('created_at', 'desc');
        $total = $query->count();
        $items = $query->skip(($page - 1) * $perPage)->take($perPage)->get();

        return response()->json([
            'data' => $items,
            'meta' => [
                'page' => $page,
                'perPage' => $perPage,
                'total' => $total,
                'hasMore' => ($page * $perPage) < $total,
            ]
        ]);
    }

    // POST /admin/notifications/mark-seen
    public function markSeen(Request $request)
    {
        $ids = $request->input('ids', []);
        AdminNotification::whereIn('id', $ids)->update(['is_seen' => true]);
        return response()->json(['ok' => true]);
    }
}
