<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Contracts\Encryption\DecryptException;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        // 'canLogin' => Route::has('login'),
        // 'canRegister' => Route::has('register'),
        // 'laravelVersion' => Application::VERSION,
        // 'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/login', function () {
    return Inertia::render('Auth/Login');
})->name('login');

Route::get('/register', function () {
    return abort(404);
});


// Route::middleware([
//     'auth:sanctum',
//     config('jetstream.auth_session'),
//     'verified',
// ])->group(function () {
//     // Route::get('/dashboard', function () {
//     //     return Inertia::render('Dashboard');
//     // })->name('dashboard');
// });

Route::prefix('/dashboard')->name('dashboard.')->group(function () {
    Route::get('/', fn () => Inertia::render('Dashboard/Show', ['url' => 'dashboard']))->name('dashboard');
    Route::get('/user', fn () => Inertia::render('User/Show', ['url' => 'user']))->name('user');
    Route::get('/user-profile', fn () => Inertia::render('User-profile/Show', ['url' => 'user-profile']))->name('user-profile');
    Route::get('/product', fn () => Inertia::render('Product/Show', ['url' => 'product']))->name('product');
    Route::get('/category', fn () => Inertia::render('Category/Show', ['url' => 'category']))->name('category');
    Route::get('/role', fn () => Inertia::render('Role/Show', ['url' => 'role']))->name('role');
    Route::get('/permission', fn () => Inertia::render('Permission/Show', ['url' => 'permission']))->name('permission');
    Route::get('/report', fn () => Inertia::render('Report/Show', ['url' => 'report']))->name('report');
    Route::get('/stock-in', fn () => Inertia::render('StockIn/Show', ['url' => 'stock-in']))->name('stock-in');
    Route::get('/stock-out', fn () => Inertia::render('StockOut/Show', ['url' => 'stock-out']))->name('stock-out');
    Route::get('/transaction', fn () => Inertia::render('Transaction/Show', ['url' => 'transaction']))->name('transaction');
    Route::get('/generate-product', fn () => Inertia::render('Transaction/Show', ['url' => 'transaction']))->name('generate');
    Route::get('/role-permission', fn () => Inertia::render('AssignRolePermission/Show', ['url' => 'role-permission']))->name('role-permission');
    Route::get('/product/detail/{id}', fn () => Inertia::render('Scan/Show', ['url' => 'scan']))->name('role-permission');

});

Route::get('/encrypt', function() {
    dd(decrypt('eyJpdiI6IkhCVXBVZi95WERLS3hVVHZUZHZHTUE9PSIsInZhbHVlIjoiRjBsMGxPNTF2T3NZUWovL3VKYWg0UT09IiwibWFjIjoiMWYxNTBmNTQ3ZjllMjZkMWEwMTk0OGUzMTU1NDM4MWExYWFjYWJkMjUzMjQ5YTNlMjJlMDY3MzkwZjJmNjI4ZiIsInRhZyI6IiJ9'));
} );

