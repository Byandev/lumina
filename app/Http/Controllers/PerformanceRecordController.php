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

        return Inertia::render('companies/company/performance-tab', [
            'records' => $records,
            'company' => $company,
        ]);
    }

    public function store(Request $request, Company $company)
    {
        $validated = $request->validate($this->rules());

        DB::beginTransaction();

        try {
            $validated['company_id'] = $company->id;
            $validated['attachment_path'] = $this->uploadAttachment($request, $company);

            PerformanceRecord::create($validated);

            DB::commit();

            return back()->with('success', 'Performance record created successfully.');
        } catch (\Throwable $e) {
            DB::rollBack();

            // If a file was uploaded, remove it
            if (! empty($validated['attachment_path'])) {
                $this->deleteAttachment($validated['attachment_path']);
            }

            \Log::error('Performance record creation failed: '.$e->getMessage());

            return back()->with('error', 'Failed to create performance record. Please try again.');
        }
    }

    public function update(Request $request, Company $company, PerformanceRecord $performance)
    {
        if ($performance->company_id !== $company->id) {
            return back()->with('error', 'Performance record not found for this company.');
        }

        $validated = $request->validate($this->rules());

        DB::beginTransaction();

        try {
            $oldPath = $performance->attachment_path;

            // Upload new file only if provided, otherwise keep old path
            $newPath = $request->hasFile('attachment')
                ? $this->uploadAttachment($request, $company)
                : $oldPath;

            $validated['attachment_path'] = $newPath;

            $performance->update($validated);

            // Only delete old after DB update succeeded
            if ($request->hasFile('attachment') && $oldPath && $oldPath !== $newPath) {
                $this->deleteAttachment($oldPath);
            }

            DB::commit();

            return back()->with('success', 'Performance record updated successfully.');
        } catch (\Throwable $e) {
            DB::rollBack();

            // If we uploaded a new file in this request, delete it
            if ($request->hasFile('attachment') && ! empty($validated['attachment_path'])) {
                $this->deleteAttachment($validated['attachment_path']);
            }

            \Log::error('Performance record update failed: '.$e->getMessage());

            return back()->with('error', 'Failed to update performance record. Please try again.');
        }
    }

    public function destroy(Company $company, PerformanceRecord $performance)
    {
        if ($performance->company_id !== $company->id) {
            return back()->with('error', 'Performance record not found for this company.');
        }

        DB::beginTransaction();

        try {
            $path = $performance->attachment_path;

            $performance->delete();

            if ($path) {
                $this->deleteAttachment($path);
            }

            DB::commit();

            return back()->with('success', 'Performance record deleted successfully.');
        } catch (\Throwable $e) {
            DB::rollBack();

            \Log::error('Performance record deletion failed: '.$e->getMessage());

            return back()->with('error', 'Failed to delete performance record. Please try again.');
        }
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
