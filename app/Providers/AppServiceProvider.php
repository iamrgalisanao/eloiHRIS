<?php

namespace App\Providers;

use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Temporary dev gate to unblock local settings pages
        if (app()->environment('local')) {
            Gate::define('manage-settings', fn ($user = null) => true);
        }
    }
}
