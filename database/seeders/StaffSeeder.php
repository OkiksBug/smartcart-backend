<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class StaffSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $staffMembers = [
            [
                'name' => 'Maria Santos',
                'email' => 'maria@smartcart.com',
                'role' => 'staff',
                'password' => Hash::make('password'),
            ],
            [
                'name' => 'Juan Dela Cruz',
                'email' => 'juan@smartcart.com',
                'role' => 'staff',
                'password' => Hash::make('password'),
            ],
            [
                'name' => 'Rosa Garcia',
                'email' => 'rosa@smartcart.com',
                'role' => 'staff',
                'password' => Hash::make('password'),
            ],
            [
                'name' => 'Miguel Lopez',
                'email' => 'miguel@smartcart.com',
                'role' => 'staff',
                'password' => Hash::make('password'),
            ],
            [
                'name' => 'Ana Reyes',
                'email' => 'ana@smartcart.com',
                'role' => 'staff',
                'password' => Hash::make('password'),
            ],
            [
                'name' => 'Carlos Ramos',
                'email' => 'carlos@smartcart.com',
                'role' => 'staff',
                'password' => Hash::make('password'),
            ],
            [
                'name' => 'Diana Torres',
                'email' => 'diana@smartcart.com',
                'role' => 'staff',
                'password' => Hash::make('password'),
            ],
        ];

        foreach ($staffMembers as $staff) {
            User::firstOrCreate(
                ['email' => $staff['email']],
                $staff
            );
        }
    }
}
