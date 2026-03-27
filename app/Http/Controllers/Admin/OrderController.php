<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Inertia\Inertia;

class OrderController extends Controller
{
    // Admin: view all orders
    public function index()
    {
        $orders = Order::with(['user','assignedStaff','items.product'])->latest()->get();
        return Inertia::render('Orders/OrderList', ['orders' => $orders]);
    }

    // Admin: view single order details
    public function show(Order $order)
    {
        $order->load(['user','assignedStaff','items.product.category']);
        $staffs = User::where('role', 'staff')->select('id', 'name', 'email')->get();
        return Inertia::render('Orders/OrderDetails', ['order' => $order, 'staffs' => $staffs]);
    }

    // Admin: assign staff to an order
    public function assignStaff(Request $request, Order $order)
    {
        $request->validate([
            'staff_id' => 'required|exists:users,id',
        ]);

        $staff = User::find($request->staff_id);
        if($staff->role !== 'staff'){
            return back()->withErrors(['staff_id' => 'User is not a staff member']);
        }

        $order->update(['assigned_staff_id'=>$staff->id]);

        return back()->with('success', 'Staff assigned successfully');
    }

    // Admin: update order status
    public function updateStatus(Request $request, Order $order)
    {
        $request->validate([
            'status'=>'required|in:Pending,Processing,Out for Delivery,Delivered,Cancelled'
        ]);

        $order->update(['status'=>$request->status]);
        return back()->with('success', 'Order status updated');
    }

    // Admin: delete an order
    public function destroy(Order $order)
    {
        $order->delete();
        return back()->with('success', 'Order deleted successfully');
    }
}