<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'event_id' => 'required|exists:events,id',
            'company_id' => 'required|exists:companies,id',
            'status' => 'required|in:present,absent,clearing,late',
        ]);

        Attendance::updateOrCreate([
            'event_id' => $request->event_id,
            'company_id' => $request->company_id,
        ], [
            'status' => $request->status,
        ]);

        return redirect()->back();
    }
}
