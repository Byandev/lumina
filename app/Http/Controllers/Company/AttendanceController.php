<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use App\Http\Sorts\AttendanceStatusSort;
use App\Models\Company;
use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\AllowedSort;
use Spatie\QueryBuilder\QueryBuilder;

class AttendanceController extends Controller
{
    public function index(Request $request, Company $company)
    {
        $events = QueryBuilder::for(Event::class)
            ->select('events.*')
            ->selectSub(function ($query) use ($company) {
                $query->from('attendances')
                    ->select('status')
                    ->whereColumn('attendances.event_id', 'events.id')
                    ->where('attendances.company_id', $company->id)
                    ->limit(1);
            }, 'attendance_status')
            ->where(function ($query) use ($company) {
                $query->doesntHave('companies')
                    ->orWhereHas('companies', function ($q) use ($company) {
                        $q->where('companies.id', $company->id);
                    });
            })
            ->allowedSorts([
                'name',
                'date',
                'type',
                'location',
                AllowedSort::custom('attendance_status', new AttendanceStatusSort),
            ])
            ->allowedFilters([
                AllowedFilter::partial('search', 'name'),
            ])
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('companies/company/attendance', [
            'company' => $company,
            'events' => $events,
            'query' => [
                ...$request->only(['sort', 'perPage', 'page']),
                'filter' => $request->input('filter', []),
            ],
        ]);
    }
}
