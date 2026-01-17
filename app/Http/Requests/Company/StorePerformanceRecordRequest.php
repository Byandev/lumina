<?php

namespace App\Http\Requests\Company;

use Illuminate\Foundation\Http\FormRequest;

class StorePerformanceRecordRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'start_date' => ['required', 'date', 'before_or_equal:end_date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'phase' => ['required', 'in:Testing,Scaling,Maintaining'],
            'no_of_items' => ['required', 'integer', 'min:0'],
            'avg_ads_spent' => ['required', 'numeric', 'min:0', 'max:99999999.99'],
            'roas' => ['nullable', 'numeric', 'min:0'],
            'rts' => ['nullable', 'numeric'],
            'highlights' => ['nullable', 'string', 'max:2000'],
            'challenges' => ['nullable', 'string', 'max:2000'],
            'action_plan' => ['nullable', 'string', 'max:2000'],
            'attachment' => [
                'nullable',
                'file',
                'max:5120',
            ],
        ];
    }
}
