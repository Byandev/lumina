<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Inertia\Inertia;

class OnboardingChecklistController extends Controller
{
    public function index(Company $company)
    {
        $checklists = $company->checklists()
            ->withPivot(['is_completed', 'remark', 'file'])
            ->orderBy('id')
            ->get();

        return Inertia::render('companies/company/onboarding-tab', [
            'company' => $company,
            'checklists' => $checklists,
        ]);
    }
}
