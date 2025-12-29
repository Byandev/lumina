<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;

class CompanyEventController extends Controller
{
    public function store(Request $request, Event $event)
    {
        $validated = $request->validate([
            'event_id' => 'required|exists:events,id',
            'attendance' => 'required|array|min:1',
            'attendance.*.company_id' => 'required|integer|exists:companies,id',
            'attendance.*.status' => 'required|in:present,absent,late,cleared',
        ]);

        // Debug FIRST to confirm payload is arriving
        // dd($validated);

        foreach ($validated['attendance'] as $row) {
            $event->syncAttendance($row['company_id'], $row['status']);
        }

        return back()->with('success', 'Attendance saved.');
    }
}
