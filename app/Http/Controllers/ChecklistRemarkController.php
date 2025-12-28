<?php

namespace App\Http\Controllers;

use App\Models\ChecklistRemark;
use App\Models\Company;
use App\Models\OnboardingChecklist;
use Illuminate\Http\Request;

class ChecklistRemarkController extends Controller
{
    public function store(Request $request, Company $company)
    {


        $validated = $request->validate([
            'remarks' => 'required|string|min:10|max:2000',
            'checklist_item_id' => 'required|exists:onboarding_checklists,id',
            'attachment' => 'nullable|file|mimes:jpg,jpeg,png,pdf,doc,docx,xls,xlsx|max:5120',
        ]);





        // Create the remark
        $remark = ChecklistRemark::create([
            'checklist_id' => $validated['checklist_item_id'],
            'company_id' => $company->id,
            'remark' => $validated['remarks'],
        ]);

        // Handle single file upload
        if ($request->hasFile('attachment')) {
            $file = $request->file('attachment');
            $path = $file->store('remarks/attachments', 'public');

            $attachment = [
                'original_name' => $file->getClientOriginalName(),
                'path' => $path,
                'mime_type' => $file->getMimeType(),
                'size' => $file->getSize(),
            ];

            // Save as JSON in the file column
            $remark->file = $attachment;
            $remark->save();
        }

        // Update the specific checklist item to completed
        $checklist = OnboardingChecklist::find($validated['checklist_item_id']);
        if ($checklist) {
            $checklist->update(['is_completed' => true]);
        }

        return redirect()
            ->back()
            ->with('success', 'Remark added successfully.');
    }
}
