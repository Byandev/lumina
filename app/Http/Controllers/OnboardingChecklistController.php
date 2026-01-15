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
        $company = $company->load('onboardingChecklists');
        $company->onboarding_percentage = $company->getOnboardingPercentage();

        return Inertia::render('companies/company/onboarding', [
            'company' => $company,
        ]);
    }

    public function update(Request $request, Company $company, CompanyOnboardingChecklist $onboardingChecklist)
    {
        $company = $company->load('onboardingChecklists');
        $company->onboarding_percentage = $company->getOnboardingPercentage();

        $request->validate([
            'is_completed' => 'boolean',
        ]);

        $onboardingChecklist->update(['is_completed' => $request->is_completed]);

        return redirect()->back();
    }
}
