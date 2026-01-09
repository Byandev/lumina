<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class CompanyChecklistController extends Controller
{

    public function remark(Request $request, Company $company)
    {
        $validated = $request->validate([
            'remarks' => 'required|string|min:10|max:2000',
            'checklist_item_id' => 'required|exists:onboarding_checklists,id',
            'attachment' => 'nullable|file|mimes:jpg,jpeg,png,pdf,doc,docx,xls,xlsx|max:5120',
        ]);

        try {
            DB::beginTransaction();

            $checklistId = $validated['checklist_item_id'];
            $filePath = null;

            // Handle file upload
            if ($request->hasFile('attachment')) {
                $file = $request->file('attachment');

                // Clean company name for filename
                $clientName = preg_replace('/[^a-zA-Z0-9_-]/', '_', $company->name);
                $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
                $originalName = preg_replace('/[^a-zA-Z0-9_-]/', '_', $originalName);
                $extension = $file->getClientOriginalExtension();

                // Create filename: CompanyName_ChecklistID_OriginalName_Timestamp.Extension
                $filename = $clientName . '_Checklist' . $checklistId . '_' . $originalName . '_' . time() . '.' . $extension;

                $filePath = $file->storeAs(
                    "checklist-remarks",
                    $filename,
                    's3'
                );
            }

            // Check if this checklist already exists in pivot table
            $existingPivot = DB::table('company_checklists')
                ->where('company_id', $company->id)
                ->where('checklist_id', $checklistId)
                ->first();

            $isUpdate = !is_null($existingPivot);

            if ($isUpdate) {
                // This is an update - delete old file if exists and new file is uploaded
                if ($existingPivot->file && $filePath && Storage::disk('s3')->exists($existingPivot->file)) {
                    Storage::disk('s3')->delete($existingPivot->file);
                }

                // Update existing pivot record
                DB::table('company_checklists')
                    ->where('company_id', $company->id)
                    ->where('checklist_id', $checklistId)
                    ->update([
                        'remark' => $validated['remarks'],
                        'file' => $filePath ?? $existingPivot->file, // Keep old file if no new file uploaded
                        'is_completed' => true,
                        'updated_at' => now(),
                    ]);
            } else {
                // This is a new entry
                DB::table('company_checklists')->insert([
                    'company_id' => $company->id,
                    'checklist_id' => $checklistId,
                    'remark' => $validated['remarks'],
                    'file' => $filePath,
                    'is_completed' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }



            DB::commit();

            return redirect()
                ->back()
                ->with('success', $isUpdate ? 'Remark updated successfully!' : 'Remark added successfully!');

        } catch (\Exception $e) {
            DB::rollBack();

            // Clean up uploaded file if error occurs
            if (isset($filePath) && Storage::disk('s3')->exists($filePath)) {
                Storage::disk('s3')->delete($filePath);
            }

            return redirect()
                ->back()
                ->withErrors(['error' => 'Failed to save remark: ' . $e->getMessage()])
                ->withInput();
        }
    }
}
