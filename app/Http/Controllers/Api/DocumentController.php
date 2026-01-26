<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Document;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DocumentController extends Controller
{
    public function index($id)
    {
        $employee = Employee::find($id);
        if (!$employee)
            return response()->json(['message' => 'Not found'], 404);

        $documents = Document::where('employee_id', $employee->id)->get();
        return response()->json($documents);
    }

    public function store(Request $request, $id)
    {
        $request->validate([
            'file' => 'required|file|max:51200', // 50MB limit
        ]);

        $employee = Employee::find($id);
        if (!$employee)
            return response()->json(['message' => 'Not found'], 404);

        $file = $request->file('file');
        $path = $file->store('documents/' . $employee->id, 'public');

        $document = Document::create([
            'organization_id' => $employee->organization_id,
            'employee_id' => $employee->id,
            'original_name' => $file->getClientOriginalName(),
            'file_path' => $path,
            'file_size' => $this->formatBytes($file->getSize()),
            'mime_type' => $file->getClientMimeType(),
        ]);

        return response()->json($document);
    }

    private function formatBytes($bytes, $precision = 2)
    {
        $units = array('B', 'KB', 'MB', 'GB', 'TB');
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        $bytes /= pow(1024, $pow);
        return round($bytes, $precision) . ' ' . $units[$pow];
    }
}
