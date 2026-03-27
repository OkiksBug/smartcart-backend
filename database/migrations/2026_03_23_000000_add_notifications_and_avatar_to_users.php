<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::table('users', function (Blueprint $table) {
            // store avatar path (relative to storage/app/public)
            $table->string('avatar')->nullable()->after('password');
            // notifications preference for staff (also useful for customers later)
            $table->boolean('notifications_enabled')->default(true)->after('avatar');
        });
    }

    public function down() {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['avatar', 'notifications_enabled']);
        });
    }
};
