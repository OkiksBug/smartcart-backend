<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = Category::all();

        if ($categories->isEmpty()) {
            $this->command->info('No categories found. Please run CategorySeeder first.');
            return;
        }

        // Create a set of sample products for each category.
        $perCategory = 8; // number of products to generate per category

        foreach ($categories as $category) {
            $tag = 'any';
            $nameLower = strtolower($category->name);
            if (strpos($nameLower, 'elect') !== false) $tag = 'tech';
            else if (strpos($nameLower, 'cloth') !== false || strpos($nameLower, 'shoe') !== false || strpos($nameLower, 'access') !== false) $tag = 'fashion';
            else if (strpos($nameLower, 'home') !== false || strpos($nameLower, 'garden') !== false) $tag = 'nature';

            for ($i = 1; $i <= $perCategory; $i++) {
                Product::create([
                    'name' => sprintf('%s Sample Product %d', $category->name, $i),
                    'description' => sprintf('Sample %s product number %d', $category->name, $i),
                    'price' => rand(199, 7999),
                    'stock' => rand(5, 200),
                    'category_id' => $category->id,
                    'image' => "https://placeimg.com/640/480/{$tag}",
                ]);
            }
        }
    }
}