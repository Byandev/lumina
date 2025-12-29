<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $eventId = $this->route('event') ? $this->route('event')->id : null;

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('events', 'name')->ignore($eventId),
            ],
            'date' => [
                'required',
                'date',
                'after_or_equal:today',
            ],
            'type' => [
                'required',
                'string',
                'max:100',
                Rule::in(['Online', 'Face to Face']),
            ],
            'location' => [
                'required',
                'string',
                'max:255',
            ],
            'company_ids' => [
                'required',
                'array',
                'min:1',
            ],
            'company_ids.*' => [
                'required',
                'integer',
                'exists:companies,id',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'The event name is required.',
            'name.string' => 'The event name must be a valid text.',
            'name.max' => 'The event name may not be greater than 255 characters.',
            'name.unique' => 'An event with this name already exists.',

            'date.required' => 'The event date and time is required.',
            'date.date' => 'Please provide a valid date and time for the event.',
            'date.after_or_equal' => 'The event date must be today or in the future.',

            'type.required' => 'Please select an event type.',
            'type.string' => 'The event type must be a valid text.',
            'type.max' => 'The event type may not be greater than 100 characters.',
            'type.in' => 'Please select a valid event type.',

            'location.required' => 'The event location is required.',
            'location.string' => 'The event location must be a valid text.',
            'location.max' => 'The event location may not be greater than 255 characters.',

            'company_ids.required' => 'Please select at least one company for this event.',
            'company_ids.array' => 'Please select valid companies.',
            'company_ids.min' => 'Please select at least one company for this event.',
            'company_ids.*.required' => 'Each company selection is required.',
            'company_ids.*.integer' => 'Company ID must be a valid integer.',
            'company_ids.*.exists' => 'One or more selected companies do not exist in our records.',
        ];
    }

    public function attributes(): array
    {
        return [
            'name' => 'event name',
            'date' => 'event date',
            'type' => 'event type',
            'location' => 'event location',
            'company_ids' => 'companies',
            'company_ids.*' => 'company',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Ensure company_ids is always an array
        $this->merge([
            'company_ids' => is_array($this->company_ids)
                ? array_filter($this->company_ids)
                : [],
            'date' => $this->date ?: null,
        ]);
    }
}
