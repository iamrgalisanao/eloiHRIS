<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Candidate;
use App\Models\JobOpening;
use Illuminate\Http\Request;

class HiringController extends Controller
{
    public function index()
    {
        $jobs = JobOpening::withCount('candidates')->get();
        return response()->json($jobs);
    }

    public function show($id)
    {
        $job = JobOpening::with('candidates')->find($id);

        if (!$job) {
            return response()->json(['message' => 'Job not found'], 404);
        }

        return response()->json($job);
    }

    public function stats()
    {
        return response()->json([
            'open_jobs' => JobOpening::where('status', 'open')->count(),
            'total_candidates' => Candidate::count(),
            'interviews_today' => 2 // Mock for now
        ]);
    }
}
