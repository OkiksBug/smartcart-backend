<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\StaffOrderController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Simple ping for connectivity checks from mobile devices
Route::get('/ping', function () {
    return response()->json(['ok' => true]);
});

// Database connectivity test (temporary - remove after diagnosis)
Route::get('/db-test', function () {
    try {
        \DB::connection()->getPdo();
        return response()->json(['status' => 'success', 'message' => 'Database connection OK']);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => $e->getMessage(),
            'db_host' => config('database.connections.mysql.host'),
            'db_port' => config('database.connections.mysql.port'),
            'db_database' => config('database.connections.mysql.database'),
        ], 500);
    }
});

// Public routes
use App\Http\Controllers\Api\AuthController;

// Auth
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::get('/categories', [CategoryController::class, 'index']);

// Protected auth routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Staff order routes
    Route::get('/staff/orders', [StaffOrderController::class, 'index']);
    Route::get('/staff/orders/{id}', [StaffOrderController::class, 'show']);
    // Staff reports/stats
    Route::get('/staff/reports', [\App\Http\Controllers\Api\StaffReportController::class, 'index']);

    // User profile routes
    Route::put('/user/profile', [\App\Http\Controllers\Api\UserController::class, 'updateProfile']);
    Route::post('/user/change-password', [\App\Http\Controllers\Api\UserController::class, 'changePassword']);
    // Note: /user/profile accepts multipart/form-data with an optional 'avatar' file or 'avatar_url' string.

    // Notifications (mobile)
    Route::get('/notifications', [\App\Http\Controllers\Api\NotificationController::class, 'index']);
    Route::post('/notifications/mark-seen', [\App\Http\Controllers\Api\NotificationController::class, 'markSeen']);
    
    // Orders (mobile)
    Route::post('/orders', [\App\Http\Controllers\Api\OrderController::class, 'store']);
    Route::get('/orders/my-orders', [\App\Http\Controllers\Api\OrderController::class, 'myOrders']);
    Route::get('/orders/{id}', [\App\Http\Controllers\Api\OrderController::class, 'show']);
    // Allow staff to update order status
    Route::put('/orders/{id}/status', [\App\Http\Controllers\Api\StaffOrderController::class, 'updateStatus']);
});