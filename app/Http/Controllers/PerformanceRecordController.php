<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\PerformanceRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PerformanceRecordController extends Controller
{
    public function index(Company $company)
    {
        return Inertia::render('companies/company/performance-tab', [
            'company' => $company->load('records'),
        ]);
    }

    /**
     * Store a newly created performance record.
     */
    public function store(Request $request, Company $company)
    {
        // Validate the request
        $validated = $request->validate([
            'start_date' => [
                'required',
                'date',
                'before_or_equal:end_date',
                function ($attribute, $value, $fail) use ($request, $company) {
                    // Check if the date range overlaps with existing records for the same company
                    $existing = PerformanceRecord::where('company_id', $company->id)
                        ->where(function ($query) use ($value, $request) {
                            $query->whereBetween('start_date', [$value, $request->end_date])
                                ->orWhereBetween('end_date', [$value, $request->end_date])
                                ->orWhere(function ($q) use ($value, $request) {
                                    $q->where('start_date', '<=', $value)
                                        ->where('end_date', '>=', $request->end_date);
                                });
                        })
                        ->exists();

                    if ($existing) {
                        $fail('This date range overlaps with an existing performance record.');
                    }
                }
            ],
            'end_date' => 'required|date|after_or_equal:start_date',
            'phase' => 'required|in:Testing,Scaling',
            'no_of_items' => 'required|integer|min:0',
            'avg_ads_spent' => 'required|numeric|min:0|max:99999999.99',
            'roas' => 'required|numeric|min:0|max:999.99',
            'rts' => 'required|numeric|min:0|max:100',
            'highlights' => 'nullable|string|max:2000',
            'challenges' => 'nullable|string|max:2000',
            'action_plan' => 'nullable|string|max:2000',
            'attachment' => 'nullable|file|mimes:pdf,doc,docx,xls,xlsx,jpg,jpeg,png|max:10240',
        ]);

        try {
            DB::beginTransaction();

            // Handle file upload if present
            $attachmentPath = null;
            if ($request->hasFile('attachment')) {
                $file = $request->file('attachment');
                $filename = 'performance_' . Str::slug($company->name) . '_' . time() . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs('performance_records', $filename, 'public');
                $attachmentPath = $path;
            }

            // Calculate additional metrics
            $totalRevenue = $validated['avg_ads_spent'] * $validated['roas'];
            $grossProfit = $totalRevenue - $validated['avg_ads_spent'];
            $profitMargin = $validated['avg_ads_spent'] > 0 ? ($grossProfit / $validated['avg_ads_spent']) * 100 : 0;

            // Create the performance record
            $performanceRecord = PerformanceRecord::create([
                'company_id' => $company->id,
                'start_date' => $validated['start_date'],
                'end_date' => $validated['end_date'],
                'phase' => $validated['phase'],
                'no_of_items' => $validated['no_of_items'],
                'avg_ads_spent' => $validated['avg_ads_spent'],
                'roas' => $validated['roas'],
                'rts' => $validated['rts'],
                'highlights' => $validated['highlights'] ?? null,
                'challenges' => $validated['challenges'] ?? null,
                'action_plan' => $validated['action_plan'] ?? null,
                'attachment_path' => $attachmentPath,

            ]);

            // Update company's latest performance metrics if this is the most recent record
            $this->updateCompanyPerformanceMetrics($company, $performanceRecord);

            DB::commit();

            return redirect()->back()->with('success', 'Performance record created successfully.');

        } catch (\Exception $e) {
            DB::rollBack();

            // Delete uploaded file if transaction failed
            if (isset($attachmentPath) && Storage::disk('public')->exists($attachmentPath)) {
                Storage::disk('public')->delete($attachmentPath);
            }

            \Log::error('Performance record creation failed: ' . $e->getMessage());

            return redirect()->back()->with('error', 'Failed to create performance record. Please try again.');
        }
    }

    /**
     * Update the specified performance record.
     */
    public function update(Request $request, Company $company, PerformanceRecord $performance)
    {
        // Check if the performance record belongs to the company
        if ($performance->company_id !== $company->id) {
            return redirect()->back()->with('error', 'Performance record not found for this company.');
        }

        // Validate the request
        $validated = $request->validate([
            'start_date' => [
                'required',
                'date',
                'before_or_equal:end_date',
                function ($attribute, $value, $fail) use ($request, $company, $performance) {
                    // Check if the date range overlaps with existing records for the same company (excluding current record)
                    $existing = PerformanceRecord::where('company_id', $company->id)
                        ->where('id', '!=', $performance->id)
                        ->where(function ($query) use ($value, $request) {
                            $query->whereBetween('start_date', [$value, $request->end_date])
                                ->orWhereBetween('end_date', [$value, $request->end_date])
                                ->orWhere(function ($q) use ($value, $request) {
                                    $q->where('start_date', '<=', $value)
                                        ->where('end_date', '>=', $request->end_date);
                                });
                        })
                        ->exists();

                    if ($existing) {
                        $fail('This date range overlaps with an existing performance record.');
                    }
                }
            ],
            'end_date' => 'required|date|after_or_equal:start_date',
            'phase' => 'required|in:Testing,Scaling',
            'no_of_items' => 'required|integer|min:0',
            'avg_ads_spent' => 'required|numeric|min:0|max:99999999.99',
            'roas' => 'required|numeric|min:0|max:999.99',
            'rts' => 'required|numeric|min:0|max:100',
            'highlights' => 'nullable|string|max:2000',
            'challenges' => 'nullable|string|max:2000',
            'action_plan' => 'nullable|string|max:2000',
            'attachment' => 'nullable|file|mimes:pdf,doc,docx,xls,xlsx,jpg,jpeg,png|max:10240',
        ]);

        try {
            DB::beginTransaction();

            $oldAttachmentPath = $performance->attachment_path;
            $attachmentPath = $oldAttachmentPath;

            // Handle new file upload if present
            if ($request->hasFile('attachment')) {
                $file = $request->file('attachment');
                $filename = 'performance_' . Str::slug($company->name) . '_' . time() . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs('performance_records', $filename, 'public');
                $attachmentPath = $path;

                // Delete old file if exists
                if ($oldAttachmentPath && Storage::disk('public')->exists($oldAttachmentPath)) {
                    Storage::disk('public')->delete($oldAttachmentPath);
                }
            }

            // Recalculate metrics if financial fields are updated
            $totalRevenue = $validated['avg_ads_spent'] * $validated['roas'];
            $grossProfit = $totalRevenue - $validated['avg_ads_spent'];
            $profitMargin = $validated['avg_ads_spent'] > 0 ? ($grossProfit / $validated['avg_ads_spent']) * 100 : 0;

            // Update the performance record
            $performance->update([
                'start_date' => $validated['start_date'],
                'end_date' => $validated['end_date'],
                'phase' => $validated['phase'],
                'no_of_items' => $validated['no_of_items'],
                'avg_ads_spent' => $validated['avg_ads_spent'],
                'roas' => $validated['roas'],
                'rts' => $validated['rts'],
                'highlights' => $validated['highlights'] ?? null,
                'challenges' => $validated['challenges'] ?? null,
                'action_plan' => $validated['action_plan'] ?? null,
                'attachment_path' => $attachmentPath,
            ]);

            // Update company metrics if this is the latest record
            $this->updateCompanyPerformanceMetrics($company, $performance);

            DB::commit();

            return redirect()->back()->with('success', 'Performance record updated successfully.');

        } catch (\Exception $e) {
            DB::rollBack();

            // Delete newly uploaded file if transaction failed
            if (isset($path) && $oldAttachmentPath !== $attachmentPath && Storage::disk('public')->exists($attachmentPath)) {
                Storage::disk('public')->delete($attachmentPath);
            }

            \Log::error('Performance record update failed: ' . $e->getMessage());

            return redirect()->back()->with('error', 'Failed to update performance record. Please try again.');
        }
    }

    /**
     * Remove the specified performance record.
     */
    public function destroy(Company $company, PerformanceRecord $performance)
    {

        try {
            DB::beginTransaction();

            $attachmentPath = $performance->attachment_path;

            // Delete the performance record
            $performance->delete();

            // Delete associated file if exists
            if ($attachmentPath && Storage::disk('public')->exists($attachmentPath)) {
                Storage::disk('public')->delete($attachmentPath);
            }

            // Update company's latest metrics if needed
            $latestRecord = PerformanceRecord::where('company_id', $company->id)
                ->orderBy('end_date', 'desc')
                ->first();

            if ($latestRecord) {
                $this->updateCompanyPerformanceMetrics($company, $latestRecord);
            } else {
                // Clear performance metrics if no records remain
                $company->update([
                    'latest_roas' => null,
                    'latest_rts' => null,
                    'latest_avg_ads_spent' => null,
                    'latest_no_of_items' => null,
                    'latest_performance_phase' => null,
                    'performance_updated_at' => null,
                ]);
            }

            DB::commit();

            return redirect()->back()->with('success', 'Performance record deleted successfully.');

        } catch (\Exception $e) {

            dd($e->getMessage());
            \Log::error('Performance record deletion failed: ' . $e->getMessage());

            return redirect()->back()->with('error', 'Failed to delete performance record. Please try again.');
        }
    }


}
