<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OnboardingChecklistController extends Controller
{
    public function index(Company $company)
    {

        $company->load([
            'checklists' => function ($query) {
                $query->with('remarks');
            }
        ])->paginate(15);



        return Inertia::render('companies/company/onboarding-tab', [
            'company' => $company
        ]);
    }
}
