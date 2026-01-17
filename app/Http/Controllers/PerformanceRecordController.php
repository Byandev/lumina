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

        try {
            DB::beginTransaction();

            $record = PerformanceRecord::create([
                'company_id' => $company->id,
                ...collect($request->validated())->except('attachment')->toArray(),
            ]);

            if ($request->hasFile('attachment')) {
                if ($record->attachment) {
                    $record->attachment->delete();
                }
                $record
                    ->addMediaFromRequest('attachment')
                    ->toMediaCollection('PERFORMANCE_RECORD_ATTACHMENT');
            }

            DB::commit();

            return redirect()->route('companies.performance-records.index', ['company' => $company]);

        }catch (\Exception $exception){

            DB::rollBack();

            return back()
                ->withErrors([
                    'error' => $exception->getMessage(),
                    'server_error' => 'An error occurred while creating record. Please try again. If the problem persists, contact support.',
                ])->withInput();
        }


    }

    public function show(Company $company, PerformanceRecord $record)
    {
        $record->load(['attachment']);

        return Inertia::render('companies/company/performance/show', [
            'record' => $record,
            'company' => $company,
        ]);
    }

    public function edit(Company $company, PerformanceRecord $record)
    {
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

        $record->update(collect($request->validated())->except('attachment')->toArray());

        return redirect()->route('companies.performance-records.index', ['company' => $company]);
    }

    public function destroy(Company $company, PerformanceRecord $record)
    {
        if ($record->company_id !== $company->id) {
            return back()->with('error', 'Index record not found for this company.');
        }

        $record->delete();

        return redirect()->route('companies.performance-records.index', ['company' => $company]);
    }

    private function rules(): array
    {
        return [
            'start_date' => ['required', 'date', 'before_or_equal:end_date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'phase' => ['required', 'in:Testing,Scaling'],
            'no_of_items' => ['required', 'integer', 'min:0'],
            'avg_ads_spent' => ['required', 'numeric', 'min:0', 'max:99999999.99'],
            'roas' => ['required', 'numeric', 'min:0', 'max:999.99'],
            'rts' => ['required', 'numeric', 'min:0', 'max:100'],
            'highlights' => ['nullable', 'string', 'max:2000'],
            'challenges' => ['nullable', 'string', 'max:2000'],
            'action_plan' => ['nullable', 'string', 'max:2000'],
            'attachment' => ['nullable', 'file', 'mimes:pdf,doc,docx,xls,xlsx,jpg,jpeg,png', 'max:10240'],
        ];
    }

    private function uploadAttachment(Request $request, Company $company): ?string
    {
        if (! $request->hasFile('attachment')) {
            return null;
        }

        $file = $request->file('attachment');

        $filename = sprintf(
            'performance_%s_%s.%s',
            Str::slug($company->name),
            now()->timestamp,
            $file->getClientOriginalExtension()
        );

        return $file->storeAs('performance_records', $filename, 's3');
    }

    private function deleteAttachment(string $path): void
    {
        if (Storage::disk('s3')->exists($path)) {
            Storage::disk('s3')->delete($path);
        }
    }
}
