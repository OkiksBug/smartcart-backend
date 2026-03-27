<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    // Create a new order (mobile)
    public function store(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'recipient_name' => 'required|string|max:255',
            'phone' => 'required|string',
            'address' => 'required|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|integer|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'total' => 'required|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Wrap order creation and stock updates in a transaction
        try {
            $order = DB::transaction(function () use ($request, $user) {
                // Create order
                $order = Order::create([
                    'user_id' => $user->id,
                    'status' => 'pending',
                    'total_price' => $request->input('total'),
                ]);

                // For each item, lock the product row and ensure sufficient stock, then create order item and decrement stock
                foreach ($request->input('items') as $it) {
                    $product = Product::where('id', $it['product_id'])->lockForUpdate()->first();
                    if (! $product) {
                        throw new \Exception('Product not found: ' . $it['product_id']);
                    }

                    $qty = (int) $it['quantity'];
                    if ($product->stock < $qty) {
                        // Throw an exception to rollback transaction and return an error to client
                        throw new \RuntimeException('Insufficient stock for product: ' . $product->name);
                    }

                    // create order item
                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $it['product_id'],
                        'quantity' => $qty,
                        'price' => isset($it['price']) ? $it['price'] : 0,
                    ]);

                    // decrement stock
                    $product->decrement('stock', $qty);
                }

                return $order;
            });
        } catch (\RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        } catch (\Exception $e) {
            // Generic error
            return response()->json(['message' => 'Could not create order', 'error' => $e->getMessage()], 500);
        }

        // Assign staff to the order automatically based on product category assignments.
        // Strategy: look through ordered products in request order and pick the first
        // category-assigned staff_id that is present. If none found, leave null.
        $productIds = collect($request->input('items'))->pluck('product_id')->unique()->toArray();
        if (!empty($productIds)) {
            $products = Product::with('category')->whereIn('id', $productIds)->get()->keyBy('id');
            $assignedStaffId = null;
            foreach ($request->input('items') as $it) {
                $pid = $it['product_id'];
                if (isset($products[$pid]) && $products[$pid]->category && $products[$pid]->category->assigned_staff_id) {
                    $assignedStaffId = $products[$pid]->category->assigned_staff_id;
                    break;
                }
            }
            if ($assignedStaffId) {
                $order->assigned_staff_id = $assignedStaffId;
            }
        }

        // attach metadata if present (recipient_name, phone, address, delivery instructions)
        $order->recipient_name = $request->input('recipient_name');
        $order->phone = $request->input('phone');
        $order->address = $request->input('address');
        $order->delivery_instructions = $request->input('delivery_instructions');
        $order->delivery_type = $request->input('delivery_type');
        $order->scheduled_at = $request->input('scheduled_at');
        $order->payment_method = $request->input('payment_method');
        $order->payment_details = $request->input('payment_details');
    $order->save();

    // include assignedStaff for convenience on the client
    $order->load('items.product', 'assignedStaff');

    return response()->json(['order' => $order], 201);
    }

    // Return orders for authenticated customer
    public function myOrders(Request $request)
    {
        $user = $request->user();
    $orders = Order::with('items.product', 'assignedStaff')->where('user_id', $user->id)->orderBy('created_at', 'desc')->get();

        $payload = $orders->map(function ($o) {
            $oArr = $o->toArray();
            // include customer_name convenience
            $oArr['customer_name'] = $o->user->name ?? null;
            // include assigned staff basic info if present
            $oArr['assigned_staff'] = $o->assignedStaff ? [
                'id' => $o->assignedStaff->id,
                'name' => $o->assignedStaff->name,
                'email' => $o->assignedStaff->email,
            ] : null;
            return $oArr;
        });

        return response()->json(['orders' => $payload]);
    }

    public function show($id, Request $request)
    {
        $order = Order::with('items.product', 'assignedStaff', 'user')->find($id);
        if (! $order) {
            return response()->json(['message' => 'Order not found'], 404);
        }
        $orderArr = $order->toArray();
        $orderArr['customer_name'] = $order->user->name ?? null;
        return response()->json(['order' => $orderArr]);
    }
}
