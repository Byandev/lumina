<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\CompanyEvent;
use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CompanyEventController extends Controller
{

    public function index(Company $company)
    {
        $attendance = CompanyEvent::with('event')
        ->where('company_id', $company->id)
            ->latest()
            ->paginate(15);


        return Inertia::render('companies/company/attendance-tab', [
            'company' => $company,
            'attendances' => $attendance,
        ]);
    }
    public function store(Request $request, Event $event)
    {




        $validated = $request->validate([
            'event_id' => 'required|exists:events,id',
            'attendance' => 'required|array|min:1',
            'attendance.*.company_id' => 'required|integer|exists:companies,id',
            'attendance.*.status' => 'required|in:present,absent,late,cleared',
        ]);


        foreach ($validated['attendance'] as $row) {
            $event->syncAttendance($row['company_id'], $row['status']);
        }

        return back()->with('success', 'Attendance saved.');
    }
}
