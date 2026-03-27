<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    // Register a new customer user (role forced to 'customer')
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => 'customer', // enforce customer role on registration
        ]);

        // create token
        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json(['user' => $user, 'token' => $token], 201);
    }

    // Login with email/password
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        $validator = Validator::make($credentials, [
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::where('email', $credentials['email'])->first();

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        // Additional mobile guard for staff/admin: require a client key header if configured
        if (in_array($user->role, ['staff', 'admin'])) {
            $mobileClientKey = env('MOBILE_CLIENT_KEY', null);
            if ($mobileClientKey) {
                $provided = $request->header('X-CLIENT-KEY') ?? $request->header('x-client-key');
                if (! $provided || $provided !== $mobileClientKey) {
                    return response()->json(['message' => 'Staff mobile login requires a valid client key.'], 403);
                }
            }
        }

        // create token (allow all roles to login via API)
        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json(['user' => $user, 'token' => $token]);
    }

    // Return authenticated user
    public function me(Request $request)
    {
        $user = $request->user();

        // Provide lightweight counts for the mobile app. If the app later adds
        // wishlist/saved or reward tables we can compute these properly. For
        // now return sensible defaults so the mobile UI can display values.
        $ordersCount = $user->orders()->count();
        $savedCount = 0; // placeholder: no wishlist table implemented yet
        $rewardPoints = 0; // placeholder: implement loyalty points in future

        return response()->json([
            'user' => $user,
            'orders_count' => $ordersCount,
            'saved_count' => $savedCount,
            'reward_points' => $rewardPoints,
        ]);
    }

    // Logout (revoke current token)
    public function logout(Request $request)
    {
        $user = $request->user();
        if ($user) {
            $user->currentAccessToken()->delete();
        }
        return response()->json(['message' => 'Logged out']);
    }
}
