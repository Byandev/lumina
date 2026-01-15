<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\CompanyOnboardingChecklist;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OnboardingChecklistController extends Controller
{
    public function index(Company $company)
    {
        $company = $company->load('onboardingChecklists.attachment');
        $company->onboarding_percentage = $company->getOnboardingPercentage();

        return Inertia::render('companies/company/onboarding', [
            'company' => $company,
        ]);
    }

    public function update(Request $request, Company $company, CompanyOnboardingChecklist $onboardingChecklist)
    {
        $company = $company->load(['onboardingChecklists']);
        $company->onboarding_percentage = $company->getOnboardingPercentage();
        $onboardingChecklist->load('attachment');

        $data = $request->validate([
            'is_completed' => 'boolean|sometimes',
            'remark' => 'string|nullable',
            'new_attachment' => 'file|nullable',
        ]);

        if ($request->hasFile('new_attachment')) {
            $onboardingChecklist->attachment()?->delete();

            $onboardingChecklist->addMediaFromRequest('new_attachment')
                ->toMediaCollection('ONBOARDING_CHECKLIST_ATTACHMENT');
        }

        $onboardingChecklist->update(collect($data)->except('new_attachment')->toArray());

        return redirect()->back();
    }
}
