<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

In addition, [Laracasts](https://laracasts.com) contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

You can also watch bite-sized lessons with real-world projects on [Laravel Learn](https://laravel.com/learn), where you will be guided through building a Laravel application from scratch while learning PHP fundamentals.

## Agentic Development

Laravel's predictable structure and conventions make it ideal for AI coding agents like Claude Code, Cursor, and GitHub Copilot. Install [Laravel Boost](https://laravel.com/docs/ai) to supercharge your AI workflow:

```bash
composer require laravel/boost --dev

php artisan boost:install
```

Boost provides your agent 15+ tools and skills that help agents build Laravel applications while following best practices.

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

---

## Project: SmartCart (Laravel backend)

This repository contains the Laravel backend for the SmartCart mobile and admin applications. The backend provides REST API endpoints for products, categories, orders, notifications and admin pages.

### Quick start (backend)

- Prerequisites: PHP 8+, Composer, SQLite/MySQL (configured in `.env`), and Node/npm if you run the frontend admin assets.
- Copy `.env.example` to `.env` and set your database and mail settings.
- Install dependencies:

```bash
composer install
cp .env.example .env
php artisan key:generate
```

- Run migrations and seeders (this will set up demo categories and products used by the mobile app):

```bash
php artisan migrate --seed
# Or to seed only products (after categories exist):
php artisan db:seed --class=ProductSeeder
```

If you want a clean database and fresh seed data:

```bash
php artisan migrate:fresh --seed
```

### Seeders
- `CategorySeeder` — creates example categories (Electronics, Clothing, Shoes, Accessories, Home & Garden).
- `ProductSeeder` — generates sample products for each category. Edit `database/seeders/ProductSeeder.php` and change `$perCategory` to control how many sample products are created per category.

### API (useful endpoints)
- GET /api/products — returns products. (Current behavior: returns the full list; mobile performs client-side pagination by default.)
- GET /api/products/{id} — product detail with relations (category, seller, reviews).
- POST /api/orders — create order (server enforces stock decrement with transactional locking; returns 422 if insufficient stock).
- GET /api/notifications — returns notifications. Customer notifications are scoped to the authenticated user's orders.

For a complete list of routes, see `routes/api.php`.

### Notes on order and stock handling
- Order creation is transactional and uses row-level locks to avoid overselling. If an item is out of stock the API responds with HTTP 422 and an informative message.

### Admin UI / Frontend
The Laravel repo also contains admin assets (Inertia/Vite). If you wish to run the admin UI during development you'll need Node and npm installed and then:

```bash
npm install
npm run dev
```

### Tests
- PHPUnit is configured; run tests with:

```bash
./vendor/bin/phpunit
```

### Troubleshooting
- If seeders report missing categories, run `php artisan db:seed --class=CategorySeeder` first.
- If you change models or migrations, run `php artisan migrate` and consider `migrate:fresh --seed` when safe.

---
