<?php

namespace App\Http\Controllers;

use App\Http\Requests\OnboardingCompanyRequest;
use App\Http\Requests\StoreCompanyRequest;
use App\Http\Requests\UpdateCompanyRequest;
use App\Models\Company;
use App\Models\CompanyOnboardingChecklist;
use App\Models\OnboardingChecklist;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class CompanyController extends Controller
{
    public function index(Request $request)
    {
        $companies = QueryBuilder::for(Company::class)
            ->with(['owners.profilePicture', 'companyLogo'])
            ->where('is_verified', true)
            ->select('companies.*')
            ->selectSub(function ($query) {
                $query->from('users')
                    ->selectRaw('COUNT(*)')
                    ->whereColumn('users.company_id', 'companies.id');
            }, 'owners_count')
            ->selectSub(function ($query) {
                $query->from('company_onboarding_checklists')
                    ->selectRaw('
                ROUND(
                    (SUM(is_completed) / NULLIF(COUNT(*), 0)),
                    4
                )
            ')
                    ->whereColumn('company_onboarding_checklists.company_id', 'companies.id');
            }, 'onboarding_percentage')
            ->allowedFilters([
                AllowedFilter::partial('search', 'name'),
            ])
            ->allowedSorts([
                'name',
                'notarization_status',
                'erp_status',
                'sales_activity',
                'level',
                'owners_count',
                'onboarding_percentage',
            ])
            ->paginate(20);

        return Inertia::render('companies/index', [
            'companies' => $companies,
            'query' => [
                ...$request->only(['sort', 'perPage', 'page']),
                'filter' => $request->input('filter', []),
            ],
        ]);
    }

    public function create()
    {
        $companies = Company::select(['id', 'name'])
            ->orderBy('name', 'asc')
            ->get();

        $coaches = User::select(['id', 'name'])
            ->whereNull('company_id')
            ->orderBy('name', 'asc')
            ->get();

        return Inertia::render('companies/create', [
            'companies' => $companies,
            'coaches' => $coaches,
        ]);
    }

    /**
     * @return RedirectResponse
     *
     * @throws \Throwable
     */
    public function store(StoreCompanyRequest $request)
    {
        DB::beginTransaction();

        try {
            $company = Company::create([
                ...collect($request->validated())
                    ->except(['owners', 'logo'])
                    ->toArray(),
                'is_verified' => true,
            ]);

            $companyOnboardingChecklist = [];

            OnboardingChecklist::get()->each(function ($checklist) use ($company, &$companyOnboardingChecklist) {
                $companyOnboardingChecklist[] = [
                    'company_id' => $company->id,
                    'title' => $checklist->title,
                ];
            });

            CompanyOnboardingChecklist::insert($companyOnboardingChecklist);

            if ($request->hasFile('logo')) {
                $company->addMediaFromRequest('logo')
                    ->toMediaCollection('COMPANY_LOGO');
            }

            foreach ($request->validated()['owners'] as $owner) {
                $companyOwner = $company->owners()->create([
                    'name' => $owner['name'],
                    'email' => $owner['email'],
                    'phone' => $owner['phone'],
                    'address' => $owner['address'],
                    'facebook' => $owner['facebook'],
                    'birthdate' => $owner['birthdate'],
                    'password' => bcrypt('password@123'),
                    'company_id' => $company->id,
                ]);

                if ($owner['profile_picture']) {
                    $companyOwner->addMedia($owner['profile_picture'])
                        ->toMediaCollection('PROFILE_PICTURE');
                }
            }

            DB::commit();

            return redirect()->route('companies.index');

        } catch (\Exception $exception) {
            DB::rollBack();

            return back()
                ->withErrors([
                    'error' => $exception->getMessage(),
                    'server_error' => 'An error occurred while creating the company. Please try again. If the problem persists, contact support.',
                ])->withInput();
        }
    }

    public function show(Company $company)
    {
        $company = $company->load('owners', 'coach:id,name,photo', 'sponsor:id,name,logo', 'companyLogo');
        $company->onboarding_percentage = $company->getOnboardingPercentage();

        return Inertia::render('companies/company/detail-tab', [
            'company' => $company,
            'sponsors' => \App\Models\Company::all(),
            'coaches' => \App\Models\User::all(),
        ]);
    }

    public function showUnverified(Company $company)
    {
        $company = $company->load('owners.signature', 'owners.profilePicture', 'proofOfPayment', 'companyLogo');

        return Inertia::render('companies/show', [
            'company' => $company,
        ]);
    }

    public function edit(Company $company)
    {
        $company = $company->load('owners.profilePicture', 'coach:id,name,photo', 'sponsor:id,name,logo', 'companyLogo');

        $companies = Company::select(['id', 'name'])
            ->orderBy('name', 'asc')
            ->get();

        $coaches = User::select(['id', 'name'])
            ->whereNull('company_id')
            ->orderBy('name', 'asc')
            ->get();

        return Inertia::render('companies/edit', [
            'company' => $company,
            'companies' => $companies,
            'coaches' => $coaches,
        ]);
    }
    // Index tab

    public function update(UpdateCompanyRequest $request, Company $company)
    {
        DB::beginTransaction();

        try {
            $company->update(
                collect($request->validated())
                    ->except(['owners', 'logo', 'new_logo'])
                    ->toArray()
            );

            if ($request->hasFile('new_logo')) {
                $company->companyLogo()->delete();

                $company->addMediaFromRequest('new_logo')
                    ->toMediaCollection('COMPANY_LOGO');
            }

            foreach ($request->validated()['owners'] as $owner) {
                $companyOwner = User::updateOrCreate([
                    'email' => $owner['email'],
                    'company_id' => $company->id,
                ], [
                    'name' => $owner['name'],
                    'email' => $owner['email'],
                    'phone' => $owner['phone'],
                    'address' => $owner['address'],
                    'facebook' => $owner['facebook'],
                    'birthdate' => $owner['birthdate'],
                    'password' => bcrypt('password@123'),
                ]);

                if ($owner['new_profile_picture']) {
                    $companyOwner->profilePicture()->delete();

                    $companyOwner->addMedia($owner['new_profile_picture'])
                        ->toMediaCollection('PROFILE_PICTURE');
                }
            }

            DB::commit();

            return redirect()->route('companies.edit', $company);

        } catch (\Exception $exception) {
            DB::rollBack();

            return back()
                ->withErrors([
                    'error' => $exception->getMessage(),
                    'server_error' => 'An error occurred while creating the company. Please try again. If the problem persists, contact support.',
                ])->withInput();
        }
    }

    public function destroy(Company $company)
    {
        if ($company->logo) {
            Storage::delete($company->logo);
        }

        $company->owners()->delete();

        $company->delete();

        return redirect()
            ->route('companies')
            ->with('success', 'Company deleted successfully.');
    }

    public function submit(OnboardingCompanyRequest $request)
    {
        DB::beginTransaction();

        try {
            $company = Company::create([
                ...collect($request->validated())
                    ->except(['owners', 'logo', 'proof_of_payment'])
                    ->toArray(),
                'is_verified' => false,
                'status' => 'active',
                'erp_status' => 'inactive',
                'sales_activity' => 'inactive',
                'notarization_status' => 'pending',
            ]);

            if ($request->hasFile('logo')) {
                $company->addMediaFromRequest('logo')
                    ->toMediaCollection('COMPANY_LOGO');
            }

            if ($request->hasFile('proof_of_payment')) {
                $company->addMediaFromRequest('proof_of_payment')
                    ->toMediaCollection('PROOF_OF_PAYMENT');
            }

            foreach ($request->validated()['owners'] as $owner) {
                $companyOwner = $company->owners()->create([
                    'name' => $owner['name'],
                    'email' => $owner['email'],
                    'phone' => $owner['phone'],
                    'address' => $owner['address'],
                    'facebook' => $owner['facebook'],
                    'birthdate' => $owner['birthdate'],
                    'password' => bcrypt('password@123'),
                    'company_id' => $company->id,
                ]);

                if ($owner['profile_picture']) {
                    $companyOwner->addMedia($owner['profile_picture'])
                        ->toMediaCollection('PROFILE_PICTURE');
                }

                if ($owner['signature']) {
                    $companyOwner->addMedia($owner['signature'])
                        ->toMediaCollection('SIGNATURE');
                }
            }

            DB::commit();

            return redirect()->back();

        } catch (\Exception $exception) {
            DB::rollBack();

            return back()
                ->withErrors([
                    'error' => $exception->getMessage(),
                    'server_error' => 'An error occurred while creating the company. Please try again. If the problem persists, contact support.',
                ])->withInput();
        }
    }

    public function unverified(Request $request)
    {
        $companies = QueryBuilder::for(Company::class)
            ->with(['owners.profilePicture', 'companyLogo'])
            ->where('is_verified', false)
            ->select('companies.*')
            ->selectSub(function ($query) {
                $query->from('users')
                    ->selectRaw('COUNT(*)')
                    ->whereColumn('users.company_id', 'companies.id');
            }, 'owners_count')
            ->allowedFilters([
                AllowedFilter::partial('search', 'name'),
            ])
            ->allowedSorts([
                'name',
                'owners_count',
                'created_at',
            ])
            ->paginate(20);

        return Inertia::render('companies/unverified', [
            'companies' => $companies,
            'query' => [
                ...$request->only(['sort', 'perPage', 'page']),
                'filter' => $request->input('filter', []),
            ],
        ]);
    }

    public function verify(Company $company)
    {
        $company->update(['is_verified' => true]);

        return redirect('/companies');
    }
}
