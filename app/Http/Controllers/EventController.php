<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEventRequest;
use App\Http\Sorts\AttendanceStatusSort;
use App\Models\Company;
use App\Models\CompanyEvent;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\AllowedSort;
use Spatie\QueryBuilder\QueryBuilder;

class EventController extends Controller
{
    public function index(Request $request)
    {
        $companies = Company::all();

        $events = QueryBuilder::for(Event::class)
            ->with('companies')
            ->allowedFilters([
                AllowedFilter::partial('name', 'search'),
            ])
            ->allowedSorts([
                'name',
                'date',
                'type',
                'location',
            ])
            ->paginate();

        return Inertia::render('events/performance', [
            'events' => $events,
            'companies' => $companies,
            'query' => [
                ...$request->only(['sort', 'perPage', 'page']),
                'filter' => $request->input('filter', []),
            ],
        ]);
    }

    public function store(StoreEventRequest $request)
    {
        try {
            $event = Event::create([
                'name' => $request->name,
                'date' => $request->date,
                'type' => $request->type,
                'location' => $request->location,
            ]);

            foreach ($request->company_ids as $company_id) {
                CompanyEvent::create([
                    'company_id' => $company_id,
                    'event_id' => $event->id,
                    'status' => 'upcoming',
                ]);
            }

            return redirect('/events')->with('success', 'Event created successfully.');

        } catch (\Exception $exception) {

            \Log::error('Event creation failed: '.$exception->getMessage());

            return redirect('/events')->withErrors($exception->getMessage());
        }

    }

    public function show(Request $request, Event $event)
    {
        $companies = QueryBuilder::for(Company::class)
            ->with(['companyLogo'])
            ->select('companies.*')
            ->when($event->companies()->exists(), function ($query) use ($event) {
                $query->whereHas('events', function ($q) use ($event) {
                    $q->where('events.id', $event->id);
                });
            })
            ->selectSub(function ($query) use ($event) {
                $query->from('attendances')
                    ->selectRaw('status')
                    ->whereColumn('attendances.company_id', 'companies.id')
                    ->where('attendances.event_id', $event->id)
                    ->limit(1);
            }, 'attendance_status')
            ->allowedFilters([
                AllowedFilter::partial('search', 'name'),
            ])
            ->allowedSorts([
                'name',
                AllowedSort::custom('attendance_status', new AttendanceStatusSort),
            ])
            ->paginate(20);

        return Inertia::render('events/show', [
            'event' => $event,
            'companies' => $companies,
            'query' => [
                ...$request->only(['sort', 'perPage', 'page']),
                'filter' => $request->input('filter', []),
            ],
        ]);
    }

    public function update(StoreEventRequest $request, Event $event)
    {
        try {
            $event->update($request->validated());

            $event->companies()->sync($request->company_ids);

            return redirect()->back()->with('success', 'Event updated successfully.');
        } catch (\Exception $exception) {
            Log::error('Event update failed: '.$exception->getMessage());

            return redirect()->back()
                ->withErrors(['error' => 'Failed to update event. Please try again.'])
                ->withInput();
        }
    }

    public function destroy(Event $event)
    {
        $event->delete();

        return redirect()->back()->with('success', 'Event deleted successfully.');
    }
}
