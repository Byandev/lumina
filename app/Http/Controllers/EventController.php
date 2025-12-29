<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEventRequest;
use App\Models\Company;
use App\Models\CompanyEvent;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class EventController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search', '');

        $companies = Company::get(['id', 'name']);

        $events = Event::with('companies:id,name')
            ->when($search, function ($query, $search) {
                return $query->where('events.name', 'LIKE', "%{$search}%");
            })
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('events/index', [
            'companies' => $companies,
            'events' => $events,
            'search' => $search,
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
                ]);
            }

            return redirect()->back()->with('success', 'Event created successfully.');

        }catch (\Exception $exception){

            \Log::error('Event creation failed: ' . $exception->getMessage());
            return Redirect::back()->withErrors($exception->getMessage());
        }

    }

    public function show(Event $event)
    {
        $event->load(['companies' => function ($query) {
            $query->select('companies.id', 'companies.name', 'companies.logo')
                ->withPivot('event_id', 'company_id', 'status');
        }]);

        return Inertia::render('events/show', [
            'event' => $event,
        ]);
    }

    public function update(StoreEventRequest $request, Event $event)
    {
        try {
            $event->update($request->validated());

            $event->companies()->sync($request->company_ids);


            return redirect()->back()->with('success', 'Event updated successfully.');
        } catch (\Exception $exception) {
            Log::error('Event update failed: ' . $exception->getMessage());

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
