<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCompanyRequest;
use App\Models\Company;
use App\Models\OnboardingChecklist;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class CompanyController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search', '');

        $companies = Company::with('owners', 'sponsor:id,name,logo')
            ->withCount([
                'checklists as total_checklist_count',
                'checklists as completed_checklist_count' => function ($query) {
                    $query->where('is_completed', true);
                }
            ])
            ->when($search, function ($query, $search) {
                return $query->where('companies.name', 'LIKE', "%{$search}%");
            })
            ->latest()
            ->paginate(20);

        $companies->getCollection()->transform(function ($company) {
            $company->checklist_progress = $company->total_checklist_count > 0
                ? round(($company->completed_checklist_count / $company->total_checklist_count) * 100)
                : 0;
            return $company;
        });



        return Inertia::render('companies/companies-index', [
            'companies' => $companies,
            'search' => $search,
        ]);
    }

    public function create()
    {
        $companies = Company::get([ 'id', 'name', 'logo']);
        $users = User::get(['id', 'name', 'photo']);

        return Inertia::render('companies/companies-create', [
            'companies' => $companies,
            'users' => $users,
        ]);
    }

    /**
     * @param StoreCompanyRequest $request
     * @return RedirectResponse
     * @throws \Throwable
     */
    public function store(Request $request)
    {

        dd($request->toArray());
        // Start database transaction
        DB::beginTransaction();

        $uploadedFiles = []; // Track all uploaded files for cleanup if needed
        $createdCompany = null;

        try {
            // 1. Handle company logo upload
            $logoPath = null;
            if ($request->hasFile('logo') && $request->file('logo')->isValid()) {
                $logoFile = $request->file('logo');
                $logoFileName = 'logo_' . uniqid() . '_' . time() . '.' . $logoFile->getClientOriginalExtension();
                $logoPath = $logoFile->storeAs('companies/logos', $logoFileName, 'public');
                $uploadedFiles[] = $logoPath;
            }

            // 2. Create the company with sponsor and coach
            $company = Company::create([
                'name' => trim($request->name),
                'email' => $request->email ? trim($request->email) : null,
                'phone' => $request->phone ? trim($request->phone) : null,
                'address' => $request->address ? trim($request->address) : null,
                'logo' => $logoPath,
                'sponsor_id' => $request->sponsor_id ?: null, // Already converted to null if 'none' in request
                'coach_id' => $request->coach_id ?: null, // Already converted to null if 'none' in request
            ]);

            if ($request->has('checklists') && is_array($request->checklists)) {
                foreach ($request->checklists as $checklistData) {
                    OnboardingChecklist::create([
                        'company_id' => $company->id,
                        'title' => $checklistData['title'],
                        'is_completed' => $checklistData['is_completed'] ?? false,
                    ]);
                }
            }


            $createdCompany = $company;



            // 3. Process company owners
            if ($request->has('owners') && is_array($request->owners) && count($request->owners) > 0) {
                $ownerIndex = 0;

                foreach ($request->owners as $index => $ownerData) {
                    // Handle owner photo upload
                    $ownerPhotoPath = null;
                    if (isset($ownerData['photo']) && $ownerData['photo'] instanceof \Illuminate\Http\UploadedFile && $ownerData['photo']->isValid()) {
                        $photoFile = $ownerData['photo'];
                        $photoFileName = 'photo_' . uniqid() . '_' . time() . '_' . $index . '.' . $photoFile->getClientOriginalExtension();
                        $ownerPhotoPath = $photoFile->storeAs('owners/photos', $photoFileName, 'public');
                        $uploadedFiles[] = $ownerPhotoPath;
                    }

                    // Handle ID file upload (required)
                    $idFilePath = null;
                    $idFileOriginalName = null;
                    if (isset($ownerData['id_file']) && $ownerData['id_file'] instanceof \Illuminate\Http\UploadedFile && $ownerData['id_file']->isValid()) {
                        $idFile = $ownerData['id_file'];
                        $idFileOriginalName = $idFile->getClientOriginalName();
                        $idFileName = 'id_' . uniqid() . '_' . time() . '_' . $index . '.' . $idFile->getClientOriginalExtension();
                        $idFilePath = $idFile->storeAs('owners/ids', $idFileName, 'public');
                        $uploadedFiles[] = $idFilePath;
                    }

                    // Check if user already exists with this email
                    $owner = User::where('email', trim($ownerData['email']))->first();

                    if ($owner) {
                        // Update existing user
                        $updateData = [
                            'name' => trim($ownerData['name']),
                            'phone' => isset($ownerData['phone']) ? trim($ownerData['phone']) : null,
                            'address' => isset($ownerData['address']) ? trim($ownerData['address']) : null,
                            'facebook' => isset($ownerData['facebook']) ? trim($ownerData['facebook']) : null,
                            'birthdate' => isset($ownerData['birthdate']) ? $ownerData['birthdate'] : null,
                        ];

                        // Update photo if provided
                        if ($ownerPhotoPath) {
                            // Delete old photo if exists
                            if ($owner->photo && Storage::disk('public')->exists($owner->photo)) {
                                Storage::disk('public')->delete($owner->photo);
                            }
                            $updateData['photo'] = $ownerPhotoPath;
                        }

                        // Update ID file if provided
                        if ($idFilePath) {
                            // Delete old ID file if exists
                            if ($owner->id_file_path && Storage::disk('public')->exists($owner->id_file_path)) {
                                Storage::disk('public')->delete($owner->id_file_path);
                            }
                            $updateData['id_file_path'] = $idFilePath;
                            $updateData['id_file_name'] = $idFileOriginalName;
                        }

                        $owner->update($updateData);
                    } else {
                        // Create new user/owner
                        $owner = User::create([
                            'name' => trim($ownerData['name']),
                            'email' => trim($ownerData['email']),
                            'password' => bcrypt('Password123`'),
                            'phone' => isset($ownerData['phone']) ? trim($ownerData['phone']) : null,
                            'address' => isset($ownerData['address']) ? trim($ownerData['address']) : null,
                            'facebook' => isset($ownerData['facebook']) ? trim($ownerData['facebook']) : null,
                            'birthdate' => isset($ownerData['birthdate']) ? $ownerData['birthdate'] : null,
                            'photo' => $ownerPhotoPath,
                            'ids' => $idFilePath,
                            'company_id' => $createdCompany->id,
                        ]);
                    }

                    $ownerIndex++;
                }
            }

            // Commit transaction
            DB::commit();

            return redirect()->route('companies')
                ->with('success', 'Company created successfully with ' . count($request->owners ?? []) . ' owner(s).');

        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            throw $e; // Let Laravel handle validation exceptions
        } catch (\Exception $e) {
            DB::rollBack();

            // Clean up uploaded files on failure
            foreach ($uploadedFiles as $filePath) {
                if ($filePath && Storage::disk('public')->exists($filePath)) {
                    Storage::disk('public')->delete($filePath);
                }
            }

            // Clean up created company if it exists
            if ($createdCompany) {
                $createdCompany->delete();
            }

            // Log the error
            \Log::error('Company creation failed: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->except(['logo', 'owners.*.photo', 'owners.*.id_file']),
            ]);

            return back()->withErrors([
                'server_error' => 'An error occurred while creating the company. Please try again. If the problem persists, contact support.'
            ])->withInput();
        }
    }


    public function show(Company $company)
    {

        $company = $company->load('owners', 'coach:id,name,photo', 'sponsor:id,name,logo');

        $totalChecklists = $company->checklists()->count();
        $completedChecklists = $company->checklists()->where('is_completed', true)->count();


        $checklistPercentage = $totalChecklists > 0
            ? round(($completedChecklists / $totalChecklists) * 100)
            : 0;


        return Inertia::render('companies/company/detail-tab', [
            'company' => [
                ...$company->toArray(),
                'checklist_percentage' => $checklistPercentage,
                'owners' => $company->owners,
            ],
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
            $logoFileName = 'logo_' . uniqid() . '_' . time() . '.' . $logoFile->getClientOriginalExtension();
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
            Storage::disk('public')->delete($company->logo);
        }

        $company->owners()->delete();

        $company->delete();

        return redirect()
            ->route('companies')
            ->with('success', 'Company deleted successfully.');
    }

    public function submit(Request $request)
    {

        try {
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
        } catch (ValidationException $e) {
            dd($e->errors()); // <-- THIS shows the exact failing fields + messages
        }


        $companyLogoPath = null;
        $ownersImagePath = null;

        if ($request->hasFile('company_logo')) {
            $companyLogoPath = $request->file('company_logo')->store('companies/logos', 'public');
                $storedFiles[] = $companyLogoPath;
        }

        if ($request->hasFile('company_owners_image')) {
            $ownersImagePath = $request->file('company_owners_image')->store('companies/owners-group', 'public');
            $storedFiles[] = $ownersImagePath;
        }

        $proofPath = $request->file('proof_of_payment')->store('companies/payments', 'public');
        $storedFiles[] = $proofPath;

        $signaturePath = $request->file('e_signature')->store('companies/signatures', 'public');
        $storedFiles[] = $signaturePath;

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
            $photoPath = $request->file("owners.$index.photo")->store('owners/photos', 'public');
            $storedFiles[] = $photoPath;

            $idPath = $request->file("owners.$index.id_with_signature")->store('owners/ids', 'public');
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
                'ids' => $idPath,
                'company_id' => $company->id,
            ]);
        }


        return redirect()
            ->route('home')
            ->with('success', 'Company onboarding submitted successfully.');
    }



}
