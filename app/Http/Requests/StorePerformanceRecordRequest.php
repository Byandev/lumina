<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePerformanceRecordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // You might want to add authorization logic here
    }

    public function rules(): array
    {
        return [
            'start_date' => [
                'required',
                'date',
                'before_or_equal:end_date',
            ],
            'end_date' => 'required|date|after_or_equal:start_date',
            'phase' => 'required|in:Testing,Scaling',
            'no_of_items' => 'required|integer|min:0',
            'avg_ads_spent' => 'required|numeric|min:0|max:99999999.99',
            'roas' => 'required|numeric|min:0|max:999.99',
            'rts' => 'required|numeric|min:0|max:100',
            'highlights' => 'nullable|string|max:2000',
            'challenges' => 'nullable|string|max:2000',
            'action_plan' => 'nullable|string|max:2000',
            'attachment_path' => 'nullable|file|mimes:pdf,doc,docx,xls,xlsx,jpg,jpeg,png|max:10240',
        ];
    }

    public function messages(): array
    {
        return [
            'start_date.required' => 'Start date is required.',
            'start_date.before_or_equal' => 'Start date must be before or equal to end date.',
            'end_date.required' => 'End date is required.',
            'end_date.after_or_equal' => 'End date must be after or equal to start date.',
            'phase.required' => 'Phase selection is required.',
            'phase.in' => 'Selected phase is invalid.',
            'no_of_items.required' => 'Number of items sold is required.',
            'no_of_items.integer' => 'Number of items must be a whole number.',
            'no_of_items.min' => 'Number of items cannot be negative.',
            'avg_ads_spent.required' => 'Average ad spend is required.',
            'avg_ads_spent.numeric' => 'Average ad spend must be a number.',
            'avg_ads_spent.min' => 'Average ad spend cannot be negative.',
            'roas.required' => 'ROAS is required.',
            'roas.numeric' => 'ROAS must be a number.',
            'roas.min' => 'ROAS cannot be negative.',
            'rts.required' => 'RTS is required.',
            'rts.numeric' => 'RTS must be a number.',
            'rts.min' => 'RTS cannot be negative.',
            'rts.max' => 'RTS cannot exceed 100%.',
            'highlights.max' => 'Highlights cannot exceed 2000 characters.',
            'challenges.max' => 'Challenges cannot exceed 2000 characters.',
            'action_plan.max' => 'Action plan cannot exceed 2000 characters.',
            'attachment_path.file' => 'Attachment must be a file.',
            'attachment_path.mimes' => 'Attachment must be a PDF, Word, Excel, or image file.',
            'attachment_path.max' => 'Attachment cannot exceed 10MB.',
        ];
    }

    public function attributes(): array
    {
        return [
            'start_date' => 'start date',
            'end_date' => 'end date',
            'phase' => 'phase',
            'no_of_items' => 'number of items sold',
            'avg_ads_spent' => 'average ad spend',
            'roas' => 'ROAS',
            'rts' => 'RTS',
            'highlights' => 'highlights',
            'challenges' => 'challenges',
            'action_plan' => 'action plan',
            'attachment_path' => 'attachment',
        ];
    }

    protected function prepareForValidation()
    {
        // Add company_id from route parameter
        if ($this->route('company')) {
            $this->merge([
                'company_id' => $this->route('company')->id,
            ]);
        }
    }
}
