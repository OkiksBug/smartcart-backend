<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    // Update basic profile (name, email)
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'notifications_enabled' => 'sometimes|boolean',
            // avatar can be uploaded file or a URL string
            'avatar' => 'sometimes|file|image|max:5120', // max 5MB
            'avatar_url' => 'sometimes|url',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();
        $user->name = $data['name'];
        $user->email = $data['email'];

        if (array_key_exists('notifications_enabled', $data)) {
            $user->notifications_enabled = (bool) $data['notifications_enabled'];
        }

        // handle avatar upload (multipart) or avatar_url
        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->store('avatars', 'public');
            $user->avatar = '/storage/' . $path; // public path
        } elseif (! empty($data['avatar_url'] ?? null)) {
            // store the provided URL directly (client may provide hosted image)
            $user->avatar = $data['avatar_url'];
        }

        $user->save();

        return response()->json(['user' => $user]);
    }

    // Change password
    public function changePassword(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();

        if (! Hash::check($data['current_password'], $user->password)) {
            return response()->json(['message' => 'Current password is incorrect'], 403);
        }

        $user->password = Hash::make($data['new_password']);
        $user->save();

        return response()->json(['message' => 'Password updated']);
    }
}
