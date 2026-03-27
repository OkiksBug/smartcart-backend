<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::table('products', function (Blueprint $table) {
            if (!Schema::hasColumn('products', 'seller_id')) {
                $table->foreignId('seller_id')->nullable()->constrained('users')->nullOnDelete()->after('category_id');
            }
        });
    }

    public function down() {
        Schema::table('products', function (Blueprint $table) {
            if (Schema::hasColumn('products', 'seller_id')) {
                $table->dropConstrainedForeignId('seller_id');
            }
        });
    }
};
