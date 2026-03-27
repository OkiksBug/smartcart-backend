<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Redirect;

class UserController extends Controller
{
    // List all users
    public function index()
    {
        // customers only
        $users = User::where('role', 'customer')->latest()->get();
        return Inertia::render('Users/UserList', compact('users'));
    }

    // Show user details
    public function show(User $user)
    {
        return Inertia::render('Users/UserDetails', compact('user'));
    }

    // No create/update/delete, per requirement

    // Show create staff form
    public function createStaff()
    {
        return Inertia::render('Users/StaffForm');
    }

    // Store new staff account
    public function storeStaff(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'role' => 'required|in:staff',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => 'staff',
        ]);

        return Redirect::route('staff.index')->with('success', 'Staff account created successfully.');
    }

    // Staff list (separate)
    public function staffIndex()
    {
        $users = User::where('role', 'staff')->latest()->get();
        return Inertia::render('Users/StaffList', compact('users'));
    }

    public function staffShow(User $user)
    {
        if ($user->role !== 'staff') {
            abort(404);
        }

        return Inertia::render('Users/StaffDetails', compact('user'));
    }

    // Admin: show profile/settings page for currently-authenticated admin
    public function profile(Request $request)
    {
        $user = $request->user();
        return Inertia::render('Users/AdminProfile', ['user' => $user]);
    }

    // Admin: update profile (name, email, password, avatar)
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'email',
                Rule::unique('users','email')->ignore($user->id),
            ],
            'password' => 'nullable|string|min:8|confirmed',
            'avatar' => 'nullable|image|max:2048',
        ]);

        $user->name = $data['name'];
        $user->email = $data['email'];

        if (!empty($data['password'])) {
            $user->password = Hash::make($data['password']);
        }

        if ($request->hasFile('avatar')) {
            $file = $request->file('avatar');
            // try to resize if Intervention Image is available
            if (class_exists('\Intervention\Image\ImageManagerStatic')) {
                try {
                    $img = \Intervention\Image\ImageManagerStatic::make($file->getRealPath());
                    $img->fit(512, 512, function ($constraint) {
                        $constraint->upsize();
                    });
                    $filename = (string) Str::uuid() . '.' . $file->getClientOriginalExtension();
                    $fullPath = storage_path('app/public/avatars/' . $filename);
                    // ensure directory exists
                    if (!file_exists(dirname($fullPath))) {
                        mkdir(dirname($fullPath), 0755, true);
                    }
                    $img->save($fullPath);
                    $path = 'avatars/' . $filename;
                } catch (\Exception $e) {
                    // fallback to default store
                    $path = $file->store('avatars', 'public');
                }
            } else {
                $path = $file->store('avatars', 'public');
            }
            // delete old avatar if exists
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }
            $user->avatar = $path;
        }

        $user->save();

        return Redirect::route('profile.show')->with('success', 'Profile updated successfully.');
    }

    // Remove avatar file and clear DB field
    public function removeAvatar(Request $request)
    {
        $user = $request->user();
        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar);
            $user->avatar = null;
            $user->save();
        }

        return response()->json(['success' => true]);
    }

    // Admin: view-only profile page
    public function profileView(Request $request)
    {
        $user = $request->user();
        return Inertia::render('Users/AdminProfileView', ['user' => $user]);
    }
}