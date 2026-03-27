<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Review;
use App\Models\Product;
use App\Models\User;

class ReviewSeeder extends Seeder
{
    public function run()
    {
        // assign a seller to products if any staff or users exist
        $users = User::all();
        $products = Product::all();
        if ($users->count() && $products->count()) {
            $seller = $users->first();
            foreach ($products as $p) {
                if (!$p->seller_id) {
                    $p->seller_id = $seller->id;
                    $p->save();
                }
            }
        }

        // create a few sample reviews for up to 5 products
        $sampleUsers = User::take(5)->get();
        foreach (Product::take(5)->get() as $product) {
            foreach ($sampleUsers as $u) {
                Review::create([
                    'product_id' => $product->id,
                    'user_id' => $u->id,
                    'rating' => rand(3,5),
                    'comment' => "Sample review for {$product->name} by {$u->name}",
                ]);
            }
        }
    }
}
