<?php

namespace App\Http\Controllers;

use App\Http\Requests\Company\StorePerformanceRecordRequest;
use App\Models\Company;
use App\Models\PerformanceRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PerformanceRecordController extends Controller
{
    public function index(Company $company)
    {
        $records = PerformanceRecord::where('company_id', $company->id)
            ->latest()
            ->paginate(10);

        return Inertia::render('companies/company/performance/index', [
            'records' => $records,
            'company' => $company,
        ]);
    }

    public function create(Company $company)
    {
        return Inertia::render('companies/company/performance/create', [
            'company' => $company,
        ]);
    }

    public function store(StorePerformanceRecordRequest $request, Company $company)
    {
        $record = PerformanceRecord::create([
            'company_id' => $company->id,
            ...collect($request->validated())->except(['attachment', 'new_attachment'])->toArray(),
        ]);

        if ($request->hasFile('attachment')) {
            $record->addMediaFromRequest('attachment')
                ->toMediaCollection('PERFORMANCE_RECORD_ATTACHMENT');
        }

        return redirect()
            ->route('companies.performance-records.index', ['company' => $company])
            ->with('success', 'Record created successfully.');
    }

    public function show(Company $company, PerformanceRecord $record)
    {
        $record->load('attachment');

        return Inertia::render('companies/company/performance/show', [
            'record' => $record,
            'company' => $company,
        ]);
    }

    public function edit(Company $company, PerformanceRecord $record)
    {
        $record->load('attachment');

        return Inertia::render('companies/company/performance/edit', [
            'record' => $record,
            'company' => $company,
        ]);
    }

    public function update(StorePerformanceRecordRequest $request, Company $company, PerformanceRecord $record)
    {
        if ($record->company_id !== $company->id) {
            return back()->with('error', 'Index record not found for this company.');
        }

        $record->load('attachment');

        $record->update(collect($request->validated())->except(['attachment', 'new_attachment'])->toArray());

        if ($request->hasFile('new_attachment')) {
            $record->attachment()->delete();

            $record->addMediaFromRequest('new_attachment')
                ->toMediaCollection('PERFORMANCE_RECORD_ATTACHMENT');
        }

        return redirect()
            ->route('companies.performance-records.index', ['company' => $company])
            ->with('success', 'Record updated successfully.');
    }

    public function destroy(Company $company, PerformanceRecord $record)
    {
        if ($record->company_id !== $company->id) {
            return back()->with('error', 'Index record not found for this company.');
        }

        $record->delete();

        return redirect()
            ->route('companies.performance-records.index', ['company' => $company])
            ->with('success', 'Record deleted successfully.');
    }
}
