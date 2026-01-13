<?php

use App\Http\Controllers\CompanyController;
use App\Http\Controllers\CompanyEventController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\OwnerController;
use App\Http\Controllers\PerformanceRecordController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('/partnership-application', function () {
    return Inertia::render('companies/welcome');
});

Route::post('/partnership-application', [CompanyController::class, 'submit'])->name('company.submit');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->middleware(['auth'])->name('dashboard');

    Route::get('companies', [CompanyController::class, 'index'])->name('companies');
    Route::get('companies/create', [CompanyController::class, 'create'])->name('companies.create');
    Route::post('companies/store', [CompanyController::class, 'store'])->name('companies.store');
    Route::get('/events', [EventController::class, 'index'])->name('events');
    Route::post('/events', [EventController::class, 'store'])->name('events.store');
    Route::get('/events/{event}', [EventController::class, 'show'])->name('events.show');
    Route::put('/events/{event}', [EventController::class, 'update'])->name('events.update');
    Route::delete('/events/{event}', [EventController::class, 'destroy'])->name('events.update');
    Route::post('/events/{event}/attendance', [CompanyEventController::class, 'store'])->name('attendance.store');
    Route::post('/companies/{company}/records', [PerformanceRecordController::class, 'store'])->name('remark.store');
    Route::get('/users', [UserController::class, 'index'])->name('users');
    Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::put('/users/{user}/change-password', [UserController::class, 'changePassword'])->name('users.change-password');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
});

Route::prefix('companies/{company}')->group(function () {
    Route::get('/details', [CompanyController::class, 'show'])->name('companies.show');
    Route::put('/details', [CompanyController::class, 'update'])->name('companies.update');
    Route::post('/owners', [OwnerController::class, 'store'])->name('owners.store');
    Route::put('/owners/{id}', [OwnerController::class, 'update'])->name('owners.update');
    Route::delete('/owners/{id}', [OwnerController::class, 'destroy'])->name('owners.delete');
    Route::get('/onboarding', [\App\Http\Controllers\OnboardingChecklistController::class, 'index'])->name('companies.onboarding');
    Route::post('/onboarding', [\App\Http\Controllers\CompanyChecklistController::class, 'remark'])->name('remark.store');
    Route::get('/attendance', [CompanyEventController::class, 'index'])->name('companies.attendance');
    Route::get('/performance-records', [PerformanceRecordController::class, 'index'])->name('companies.performance-records.index');
    Route::get('/performance-records/add-record', [PerformanceRecordController::class, 'create'])->name('companies.performance-records.create');
    Route::post('/performance-records/add-record', [PerformanceRecordController::class, 'store'])->name('companies.performance-records.store');
//    Route::post('performance-records/{performance}/', [PerformanceRecordController::class, 'update'])->name('companies.performance-records.update');
//    Route::delete('performance-records/{performance}', [PerformanceRecordController::class, 'destroy'])->name('companies.performance-records.destroy');
});

require __DIR__.'/settings.php';
