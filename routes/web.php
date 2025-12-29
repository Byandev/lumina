<?php

use App\Http\Controllers\ChecklistRemarkController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\OwnerController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('companies', [CompanyController::class, 'index'])->name('companies');
    Route::get('companies/create', [CompanyController::class, 'create'])->name('companies.create');
    Route::post('companies/store', [CompanyController::class, 'store'])->name('companies.store');
    Route::get('companies/{company}', [CompanyController::class, 'show'])->name('companies.show');
    Route::put('companies/{company}/update', [CompanyController::class, 'update'])->name('companies.update');
    Route::delete('companies/{company}/destroy', [CompanyController::class, 'destroy'])->name('companies.destroy');
    Route::post('companies/{company}/owners', [OwnerController::class, 'store'])->name('owner.store');
    Route::put('owners/{user}', [OwnerController::class, 'update'])->name('owner.update');
    Route::post('/companies/{company}/remarks', [ChecklistRemarkController::class, 'store'])->name('remark.store');


    Route::get('/events', [EventController::class, 'index'])->name('events');
    Route::post('/events', [EventController::class, 'store'])->name('events.store');
    Route::get('/events/{event}', [EventController::class, 'show'])->name('events.show');
    Route::put('/events/{event}', [EventController::class, 'update'])->name('events.update');
    Route::delete('/events/{event}', [EventController::class, 'destroy'])->name('events.update');

    Route::post('/events/{event}/attendance', [\App\Http\Controllers\CompanyEventController::class, 'store'])->name('attendance.store');
});




require __DIR__.'/settings.php';
