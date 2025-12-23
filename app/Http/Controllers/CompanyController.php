<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCompanyRequest;
use App\Models\Company;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CompanyController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search', '');

        $companies = Company::with('owners')
            ->when($search, function ($query, $search) {
                return $query->where('companies.name', 'LIKE', "%{$search}%");
            })
            ->latest()
            ->paginate(20);

        return Inertia::render('companies/companies-index', [
            'companies' => $companies,
            'search' => $search,
        ]);
    }

    public function create(){
        return Inertia::render('companies/companies-create');
    }

    /**
     * @param StoreCompanyRequest $request
     * @return RedirectResponse
     * @throws \Throwable
     */
    public function store(StoreCompanyRequest $request)
    {
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

            // 2. Create the company
            $company = Company::create([
                'name' => trim($request->name),
                'email' => $request->email ? trim($request->email) : null,
                'phone' => $request->phone ? trim($request->phone) : null,
                'address' => $request->address ? trim($request->address) : null,
                'logo' => $logoPath,
            ]);

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

            dd($e->getMessage());

            // Return error response
            return back()->withErrors([
                'server_error' => 'An error occurred while creating the company. Please try again. If the problem persists, contact support.'
            ])->withInput();
        }
    }
}
