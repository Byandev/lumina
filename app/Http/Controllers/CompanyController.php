<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCompanyRequest;
use App\Models\Company;
use App\Models\OnboardingChecklist;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class CompanyController extends Controller
{
    public function index(Request $request)
    {
        $companies = QueryBuilder::for(Company::class)
            ->with('owners')
            ->select('companies.*')
            ->selectSub(function ($query) {
                $query->from('users')
                    ->selectRaw('COUNT(*)')
                    ->whereColumn('users.company_id', 'companies.id');
            }, 'owners_count')
            ->selectSub(function ($query) {
                $query->from('company_checklists')
                    ->selectRaw('
                ROUND(
                    (SUM(is_completed) / NULLIF(COUNT(*), 0)),
                    4
                )
            ')
                    ->whereColumn('company_checklists.company_id', 'companies.id');
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
        $companies = Company::get(['id', 'name', 'logo']);
        $users = User::get(['id', 'name', 'photo']);

        return Inertia::render('companies/companies-create', [
            'companies' => $companies,
            'users' => $users,
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

        $uploadedFiles = [];
        $createdCompany = null;

        try {
            // 1) Company logo
            $logoPath = null;
            if ($request->hasFile('logo') && $request->file('logo')->isValid()) {
                $logoFile = $request->file('logo');
                $logoFileName = 'logo_'.uniqid().'_'.time().'.'.$logoFile->getClientOriginalExtension();

                $logoPath = $logoFile->storeAs('companies/logos', $logoFileName);
                $uploadedFiles[] = $logoPath;
            }

            // 2) Create company
            $company = Company::create([
                'name' => trim($request->name),
                'email' => $request->email ? trim($request->email) : null,
                'phone' => $request->phone ? trim($request->phone) : null,
                'address' => $request->address ? trim($request->address) : null,
                'logo' => $logoPath,
                'sponsor_id' => $request->sponsor_id ?: null,
                'coach_id' => $request->coach_id ?: null,
            ]);

            // ATTACH CHECKLIST ITEMS TO COMPANY
            $checklistItems = OnboardingChecklist::all();

            foreach ($checklistItems as $checklistItem) {
                $company->checklists()->attach($checklistItem->id, [
                    'remark' => '',
                    'is_completed' => false,
                    'file' => null,
                ]);
            }

            $createdCompany = $company;

            // 3) Owners
            if ($request->has('owners') && is_array($request->owners) && count($request->owners) > 0) {
                foreach ($request->owners as $index => $ownerData) {

                    // photo
                    $ownerPhotoPath = null;
                    if (
                        isset($ownerData['photo']) &&
                        $ownerData['photo'] instanceof UploadedFile &&
                        $ownerData['photo']->isValid()
                    ) {
                        $photoFile = $ownerData['photo'];
                        $photoFileName = 'photo_'.uniqid().'_'.time().'_'.$index.'.'.$photoFile->getClientOriginalExtension();

                        $ownerPhotoPath = $photoFile->storeAs('owners/photos', $photoFileName);
                        $uploadedFiles[] = $ownerPhotoPath;
                    }

                    // id file
                    $idFilePath = null;
                    $idFileOriginalName = null;
                    if (
                        isset($ownerData['id_file']) &&
                        $ownerData['id_file'] instanceof UploadedFile &&
                        $ownerData['id_file']->isValid()
                    ) {
                        $idFile = $ownerData['id_file'];
                        $idFileOriginalName = $idFile->getClientOriginalName();
                        $idFileName = 'id_'.uniqid().'_'.time().'_'.$index.'.'.$idFile->getClientOriginalExtension();

                        $idFilePath = $idFile->storeAs('owners/ids', $idFileName);
                        $uploadedFiles[] = $idFilePath;
                    }

                    // find existing owner by email
                    $owner = User::where('email', trim($ownerData['email']))->first();

                    if ($owner) {
                        $updateData = [
                            'name' => trim($ownerData['name']),
                            'phone' => isset($ownerData['phone']) ? trim($ownerData['phone']) : null,
                            'address' => isset($ownerData['address']) ? trim($ownerData['address']) : null,
                            'facebook' => isset($ownerData['facebook']) ? trim($ownerData['facebook']) : null,
                            'birthdate' => isset($ownerData['birthdate']) ? $ownerData['birthdate'] : null,
                        ];

                        // Replace photo (delete old from S3)
                        if ($ownerPhotoPath) {
                            if ($owner->photo && Storage::exists($owner->photo)) {
                                Storage::delete($owner->photo);
                            }
                            $updateData['photo'] = $ownerPhotoPath;
                        }

                        // Replace ID (delete old from S3)
                        if ($idFilePath) {
                            // NOTE: your code uses $owner->id_file_path, but create uses 'ids'
                            // Make sure your User model column names are consistent.
                            $oldIdPath = $owner->id_file_path ?? $owner->ids ?? null;

                            if ($oldIdPath && Storage::exists($oldIdPath)) {
                                Storage::delete($oldIdPath);
                            }

                            $updateData['id_file_path'] = $idFilePath;
                            $updateData['id_file_name'] = $idFileOriginalName;
                        }

                        $owner->update($updateData);
                    } else {
                        User::create([
                            'name' => trim($ownerData['name']),
                            'email' => trim($ownerData['email']),
                            'password' => bcrypt('Password123`'),
                            'phone' => isset($ownerData['phone']) ? trim($ownerData['phone']) : null,
                            'address' => isset($ownerData['address']) ? trim($ownerData['address']) : null,
                            'facebook' => isset($ownerData['facebook']) ? trim($ownerData['facebook']) : null,
                            'birthdate' => isset($ownerData['birthdate']) ? $ownerData['birthdate'] : null,
                            'role' => 'owner',
                            'photo' => $ownerPhotoPath,
                            'ids' => $idFilePath,
                            'company_id' => $createdCompany->id,
                        ]);
                    }
                }
            }

            DB::commit();

            return redirect()->route('companies')
                ->with('success', 'Company created successfully with '.count($request->owners ?? []).' owner(s).');

        } catch (ValidationException $e) {
            dd($e->getMessage());
            DB::rollBack();
            throw $e;
        } catch (\Throwable $e) {
            dd($e->getMessage());
            DB::rollBack();

            // Cleanup: delete newly uploaded S3 objects
            foreach ($uploadedFiles as $filePath) {
                if ($filePath && Storage::exists($filePath)) {
                    Storage::delete($filePath);
                }
            }

            if ($createdCompany) {
                $createdCompany->delete();
            }

            Log::error('Company creation failed: '.$e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->except(['logo', 'owners.*.photo', 'owners.*.id_file']),
            ]);

            return back()->withErrors([
                'server_error' => 'An error occurred while creating the company. Please try again. If the problem persists, contact support.',
            ])->withInput();
        }
    }

    public function show(Company $company)
    {
        $company = $company->load('owners', 'coach:id,name,photo', 'sponsor:id,name,logo');
        $totalChecklists = $company->onboardingChecklists()->count();
        $completedChecklists = $company->onboardingChecklists()->where('is_completed', true)->count();

        $company->onboarding_percentage = $totalChecklists > 0
            ? $completedChecklists / $totalChecklists
            : 0;

        return Inertia::render('companies/company/detail-tab', [
            'company' => $company,
            'sponsors' => \App\Models\Company::all(),
            'coaches' => \App\Models\User::all(),
        ]);
    }

    // Performance tab

    public function update(Request $request, $id)
    {

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:30'],
            'address' => ['nullable', 'string', 'max:255'],
            'status' => ['required'],
            'notarization_status' => ['required'],
            'erp_status' => ['required'],
            'level' => ['required'],
            'sponsor_id' => ['nullable', 'integer', 'exists:companies,id'],
            'sales_activity' => ['nullable', 'string', 'max:255'],
            'coach_id' => ['nullable', 'integer', 'exists:users,id'],
        ]);

        $company = Company::findOrFail($id);

        $logoPath = null;
        if ($request->hasFile('logo') && $request->file('logo')->isValid()) {
            $logoFile = $request->file('logo');
            $logoFileName = 'logo_'.uniqid().'_'.time().'.'.$logoFile->getClientOriginalExtension();
            $logoPath = $logoFile->storeAs('companies/logos', $logoFileName, 'public');
            $uploadedFiles[] = $logoPath;
        }

        $company->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'address' => $validated['address'] ?? null,
            'status' => $validated['status'],
            'notarization_status' => $validated['notarization_status'],
            'erp_status' => $validated['erp_status'],
            'level' => $validated['level'],
            'sales_activity' => $validated['sales_activity'] ?? null,
            'sponsor_id' => $validated['sponsor_id'] ?? null,
            'coach_id' => $validated['coach_id'] ?? null,
            'logo' => $logoPath,
        ]);

        return back()->with('success', 'Company updated successfully.');
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

    public function submit(Request $request)
    {
        $validated = $request->validate([
            'company_name' => ['required', 'string', 'max:255'],
            'company_email' => ['nullable', 'email', 'max:255'],
            'company_phone' => ['nullable', 'string', 'max:20'],
            'address' => ['nullable', 'string', 'max:500'],
            'has_existing_ecomm_process' => ['required', 'in:yes,no'],

            'company_logo' => ['nullable', 'image', 'max:5120'],
            'company_owners_image' => ['nullable', 'image', 'max:5120'],
            'proof_of_payment' => ['required', 'file', 'max:10240'],
            'e_signature' => ['required', 'file', 'max:5120'],

            'owners' => ['required', 'array', 'min:1'],
            'owners.*.name' => ['required', 'string', 'max:255'],
            'owners.*.email' => ['required', 'email', 'max:255'],
            'owners.*.phone' => ['required', 'string', 'max:20'],
            'owners.*.address' => ['nullable', 'string', 'max:500'],
            'owners.*.facebook_link' => ['nullable', 'url', 'max:255'],
            'owners.*.birthdate' => ['nullable', 'date'],
            'owners.*.photo' => ['required', 'image', 'max:5120'],
            'owners.*.id_with_signature' => ['required', 'file', 'max:10240'],
        ]);

        $storedFiles = [];
        $companyLogoPath = null;
        $ownersImagePath = null;

        if ($request->hasFile('company_logo')) {
            $companyLogoPath = $request->file('company_logo')->store('companies/logos', 's3');
            $storedFiles[] = $companyLogoPath;
        }

        if ($request->hasFile('company_owners_image')) {
            $ownersImagePath = $request->file('company_owners_image')->store('companies/owners-group', 's3');
            $storedFiles[] = $ownersImagePath;
        }

        $proofPath = $request->file('proof_of_payment')->store('companies/payments', 's3');
        $storedFiles[] = $proofPath;

        $signaturePath = $request->file('e_signature')->store('companies/signatures', 's3');
        $storedFiles[] = $signaturePath;

        try {
            // CREATE COMPANY
            $company = Company::create([
                'name' => $validated['company_name'],
                'email' => $validated['company_email'] ?? null,
                'phone' => $validated['company_phone'] ?? null,
                'address' => $validated['address'] ?? null,
                'has_existing_ecomm_process' => $validated['has_existing_ecomm_process'],
                'logo' => $companyLogoPath,
                'owner_photo' => $ownersImagePath,
                'proof_of_payment' => $proofPath,
                'e_signature' => $signaturePath,
            ]);

            // CREATE OWNERS
            foreach ($validated['owners'] as $index => $ownerData) {
                $photoPath = $request->file("owners.$index.photo")->store('owners/photos', 's3');
                $storedFiles[] = $photoPath;

                $idPath = $request->file("owners.$index.id_with_signature")->store('owners/ids', 's3');
                $storedFiles[] = $idPath;

                User::create([
                    'name' => $ownerData['name'],
                    'email' => $ownerData['email'],
                    'password' => bcrypt('password'),
                    'phone' => $ownerData['phone'],
                    'address' => $ownerData['address'] ?? null,
                    'facebook' => $ownerData['facebook_link'] ?? null,
                    'birthdate' => $ownerData['birthdate'] ?? null,
                    'photo' => $photoPath,
                    'role' => 'owner',
                    'ids' => $idPath,
                    'company_id' => $company->id,
                ]);
            }

            // ATTACH CHECKLIST ITEMS TO COMPANY
            $checklistItems = OnboardingChecklist::all();

            foreach ($checklistItems as $checklistItem) {
                $company->onboardingChecklists()->create([
                    'title' => $checklistItem->title,
                ]);
            }

            return redirect()
                ->route('home')
                ->with('success', 'Company onboarding submitted successfully.');

        } catch (\Exception $e) {

            foreach ($storedFiles as $filePath) {
                if (Storage::exists($filePath)) {
                    Storage::delete($filePath);
                }
            }

            return redirect()
                ->back()
                ->withInput()
                ->withErrors(['error' => 'An error occurred while submitting the form. Please try again.']);
        }
    }
}
