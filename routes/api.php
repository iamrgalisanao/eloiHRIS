<?php

use App\Http\Controllers\Api\EmployeeController;
use App\Http\Controllers\Api\TimeOffRequestController;
use Illuminate\Support\Facades\Route;

Route::get('/me', [EmployeeController::class, 'me']);
Route::get('/time-off/balance', [EmployeeController::class, 'timeOffBalance']);
Route::post('/time-off/request', [TimeOffRequestController::class, 'store']);
Route::get('/custom-tabs', [EmployeeController::class, 'customTabs']);
