<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\CompanyOnboardingChecklist;
use App\Models\OnboardingChecklist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class CompanyChecklistController extends Controller
{
    public function remark(Request $request, Company $company, CompanyOnboardingChecklist $onboardingChecklist)
    {
        $validated = $request->validate([
            'remark' => 'required|string|min:10|max:2000',
            'new_attachment' => 'nullable|file|mimes:jpg,jpeg,png,pdf,doc,docx,xls,xlsx|max:5120',
        ]);

        try {
            DB::beginTransaction();

            $onboardingChecklist->update([
                'remark' => $request->remark,
            ]);

            // Handle attachment
            if ($request->hasFile('new_attachment')) {
                if ($onboardingChecklist->attachment) {
                    $onboardingChecklist->attachment->delete();
                }

                $onboardingChecklist
                    ->addMediaFromRequest('new_attachment')
                    ->toMediaCollection('ONBOARDING_CHECKLIST_ATTACHMENT');
            }

            DB::commit();

            return redirect()
                ->back()
                ->with('success', 'Remark saved successfully!');

        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()
                ->back()
                ->withErrors(['error' => 'Failed to save remark: '.$e->getMessage()])
                ->withInput();
        }
    }
}
