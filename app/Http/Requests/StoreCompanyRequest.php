<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCompanyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Change based on your authorization logic
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            // Company Information
            'name' => [
                'required',
                'string',
                'max:255',
            ],
            'email' => [
                'nullable',
                'email',
                'max:255',
            ],
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
            'logo' => [
                'nullable',
                'image',
                'mimes:jpeg,png,jpg,gif,webp',
                'max:5120', // 5MB
                'dimensions:min_width=100,min_height=100,max_width=2000,max_height=2000',
            ],

            // Owners - array validation
            'owners' => 'required|array|min:1',
            'owners.*.name' => 'required|string|max:255',
            'owners.*.email' => [
                'required',
                'email',
                'max:255',
            ],
            'owners.*.phone' => 'required|string|max:20',
            'owners.*.address' => 'nullable|string|max:500',
            'owners.*.facebook' => [
                'nullable',
                'string',
                'max:255',
                'url',
                'regex:/^(https?:\/\/)?(www\.)?facebook\.com\/.+/i',
            ],
            'owners.*.birthdate' => [
                'nullable',
                'date',
                'before_or_equal:today',
                'after_or_equal:1900-01-01',
            ],
            'owners.*.photo' => [
                'nullable',
                'image',
                'mimes:jpeg,png,jpg,gif,webp',
                'max:5120', // 5MB
                'dimensions:max_width=2000,max_height=2000',
            ],
            'owners.*.id_file' => [
                'required',
                'file',
                'mimes:jpeg,png,jpg,pdf',
                'max:10240', // 10MB for ID files
            ],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            // Company messages
            'name.required' => 'Company name is required.',
            'name.unique' => 'A company with this name already exists.',
            'email.email' => 'Please enter a valid email address for the company.',
            'email.unique' => 'This company email is already registered.',
            'logo.image' => 'The logo must be an image file.',
            'logo.mimes' => 'Logo must be a JPEG, PNG, JPG, GIF, or WebP file.',
            'logo.max' => 'Logo size should not exceed 5MB.',
            'logo.dimensions' => 'Logo dimensions should be between 100x100 and 2000x2000 pixels.',

            // Owners messages
            'owners.required' => 'At least one company owner is required.',
            'owners.min' => 'At least one company owner is required.',
            'owners.*.name.required' => 'Owner name is required.',
            'owners.*.email.required' => 'Owner email is required.',
            'owners.*.email.email' => 'Please enter a valid email address for the owner.',
            'owners.*.email.unique' => 'This owner email is already registered.',
            'owners.*.phone.required' => 'Owner phone number is required.',
            'owners.*.phone.max' => 'Owner phone number should not exceed 20 characters.',
            'owners.*.facebook.url' => 'Please enter a valid Facebook URL.',
            'owners.*.facebook.regex' => 'Please enter a valid Facebook profile URL.',
            'owners.*.birthdate.date' => 'Please enter a valid birth date.',
            'owners.*.birthdate.before_or_equal' => 'Birth date cannot be in the future.',
            'owners.*.birthdate.after_or_equal' => 'Birth date must be after 1900-01-01.',
            'owners.*.photo.image' => 'Owner photo must be an image file.',
            'owners.*.photo.mimes' => 'Owner photo must be a JPEG, PNG, JPG, GIF, or WebP file.',
            'owners.*.photo.max' => 'Owner photo size should not exceed 5MB.',
            'owners.*.photo.dimensions' => 'Owner photo dimensions should not exceed 2000x2000 pixels.',
            'owners.*.id_file.required' => 'Owner ID document is required.',
            'owners.*.id_file.file' => 'Owner ID must be a valid file.',
            'owners.*.id_file.mimes' => 'Owner ID must be a JPEG, PNG, JPG, or PDF file.',
            'owners.*.id_file.max' => 'Owner ID file size should not exceed 10MB.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'name' => 'company name',
            'email' => 'company email',
            'phone' => 'company phone',
            'address' => 'company address',
            'logo' => 'company logo',
            'owners' => 'company owners',
            'owners.*.name' => 'owner name',
            'owners.*.email' => 'owner email',
            'owners.*.phone' => 'owner phone',
            'owners.*.address' => 'owner address',
            'owners.*.facebook' => 'owner facebook profile',
            'owners.*.birthdate' => 'owner birth date',
            'owners.*.photo' => 'owner photo',
            'owners.*.id_file' => 'owner ID document',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Trim string inputs
        $this->merge([
            'name' => trim($this->name),
            'email' => trim($this->email),
            'phone' => trim($this->phone),
            'address' => trim($this->address),
        ]);

        // Trim owner fields
        if ($this->has('owners') && is_array($this->owners)) {
            $owners = collect($this->owners)->map(function ($owner) {
                return [
                    'name' => trim($owner['name'] ?? ''),
                    'email' => trim($owner['email'] ?? ''),
                    'phone' => trim($owner['phone'] ?? ''),
                    'address' => trim($owner['address'] ?? ''),
                    'facebook' => trim($owner['facebook'] ?? ''),
                    'birthdate' => $owner['birthdate'] ?? null,
                    'photo' => $owner['photo'] ?? null,
                    'id_file' => $owner['id_file'] ?? null,
                ];
            })->toArray();

            $this->merge(['owners' => $owners]);
        }
    }

    /**
     * Get the validated data from the request.
     */
    public function validated($key = null, $default = null)
    {
        $validated = parent::validated($key, $default);

        // Ensure owners array is properly formatted
        if (isset($validated['owners'])) {
            $validated['owners'] = array_map(function ($owner) {
                return [
                    'name' => $owner['name'],
                    'email' => $owner['email'],
                    'phone' => $owner['phone'],
                    'address' => $owner['address'] ?? null,
                    'facebook' => $owner['facebook'] ?? null,
                    'birthdate' => $owner['birthdate'] ?? null,
                    // 'photo' and 'id_file' will be handled separately in controller for file storage
                ];
            }, $validated['owners']);
        }

        return $validated;
    }
}
