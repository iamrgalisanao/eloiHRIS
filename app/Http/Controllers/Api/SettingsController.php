<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Organization;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function show()
    {
        $org = Organization::first(); // Demo Org
        return response()->json($org);
    }

    public function update(Request $request)
    {
        $org = Organization::first();

        $request->validate([
            'name' => 'required|string|max:255',
            'branding_json.primary_color' => 'required|string',
        ]);

        $org->update([
            'name' => $request->name,
            'branding_json' => $request->branding_json,
        ]);

        return response()->json($org);
    }
}
