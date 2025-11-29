<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TodoController;
use App\Http\Controllers\Api\RoleController; // <-- WAJIB ADA
use App\Models\User;

// Public
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// Protected: semua user harus login
Route::middleware('auth:sanctum')->group(function () {

    // CRUD todo milik user login
    Route::apiResource('todos', TodoController::class);

    // logout
    Route::post('/logout', [AuthController::class, 'logout']);

    // ------------------
    // ADMIN ONLY ROUTES
    // ------------------
    Route::middleware('role:admin')->group(function () {

        Route::get('/admin/users', function () {
            return User::select('id','name','email','role','created_at')->get();
        });

        Route::get('/admin/todos', function () {
            return \App\Models\Todo::with('user')->get();
        });

        // >>>> INI YANG WAJIB KAMU TAMBAHKAN
        Route::apiResource('roles', RoleController::class);

    });
});
