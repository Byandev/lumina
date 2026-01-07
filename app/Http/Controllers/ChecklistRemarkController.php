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

        if ($request->hasFile('attachment')) {
            $file = $request->file('attachment');

            $clientName = str_replace(' ', '_', $company->name); // Replace spaces with underscores
            $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
            $extension = $file->getClientOriginalExtension();

            // Create filename: ClientName_OriginalName_Timestamp.Extension
            $filename = $clientName . '_' . $originalName . '_' . time() . '.' . $extension;

            $path = $file->storeAs('remarks/attachments', $filename, 'public');

            $remark->file = $path;
            $remark->save();
        }

        $checklist = OnboardingChecklist::find($validated['checklist_item_id']);
        if ($checklist) {
            $checklist->update(['is_completed' => true]);
        }

        return redirect()
            ->back()
            ->with('success', 'Remark added successfully.');
    }
}
