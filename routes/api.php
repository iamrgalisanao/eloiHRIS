<?php

use App\Http\Controllers\Api\EmployeeController;
use App\Http\Controllers\Api\TimeOffRequestController;
use App\Http\Controllers\Api\DocumentController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\HiringController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\SettingsController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\EmployeeFieldController;

Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
Route::get('/hiring/stats', [HiringController::class, 'stats']);
Route::get('/hiring/jobs', [HiringController::class, 'index']);
Route::get('/hiring/jobs/{id}', [HiringController::class, 'show']);

Route::get('/reports', [ReportController::class, 'index']);
Route::get('/reports/headcount', [ReportController::class, 'headcount']);
Route::get('/reports/time-off', [ReportController::class, 'timeOff']);

Route::get('/settings', [SettingsController::class, 'show']);
Route::put('/settings', [SettingsController::class, 'update']);

Route::get('/employees', [EmployeeController::class, 'index']);
// Specific route must come before parameterized one to avoid capturing 'me' as {id}
Route::get('/employees/me', [EmployeeController::class, 'me']);
Route::get('/employees/{id}', [EmployeeController::class, 'show']);
Route::get('/employees/{id}/time-off', [EmployeeController::class, 'timeOffBalance']);
Route::get('/employees/{id}/custom-tabs', [EmployeeController::class, 'customTabs']);
Route::get('/employees/{id}/documents', [DocumentController::class, 'index']);
Route::post('/employees/{id}/documents', [DocumentController::class, 'store']);
Route::post('/time-off/request', [TimeOffRequestController::class, 'store']);

// Employee Fields (Settings) — protected (relaxed in local)
Route::middleware(app()->environment('local') ? ['throttle:60,1'] : ['auth:sanctum', 'can:manage-settings', 'throttle:60,1'])
    ->prefix('employee-fields')
    ->group(function () {
        Route::get('/', [EmployeeFieldController::class, 'index']);
        Route::post('/{category}', [EmployeeFieldController::class, 'store']);
        Route::put('/{category}/{id}', [EmployeeFieldController::class, 'update']);
        Route::delete('/{category}/{id}', [EmployeeFieldController::class, 'destroy']);
    });
