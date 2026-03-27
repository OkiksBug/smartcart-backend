<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategoryStaffSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = Category::all();
        
        // Get all staff members (excluding admin)
        $staffMembers = User::where('role', 'staff')->get();
        
        if ($staffMembers->count() < 5) {
            $this->command->warn('Not enough staff members. Please run StaffSeeder first.');
            return;
        }

        // Assign at least 5 staff to each category
        foreach ($categories as $category) {
            // Get 5 random staff members and attach them to this category
            $randomStaff = $staffMembers->random(min(5, $staffMembers->count()))->pluck('id');
            
            foreach ($randomStaff as $staffId) {
                // Use insertOrIgnore to avoid duplicates
                \DB::table('category_staff')->insertOrIgnore([
                    'category_id' => $category->id,
                    'staff_id' => $staffId,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        $this->command->info('Category staff assignments completed!');
    }
}
