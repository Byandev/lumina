<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class OwnerController extends Controller
{

    public function store(Request $request)
    {
        $validated = $request->validate(
            [
                'name' => ['required', 'string', 'max:255'],
                'email' => ['required', 'email', 'max:255'],
                'phone' => ['nullable', 'string', 'max:30'],
                'facebook' => ['nullable', 'string', 'max:255'],
                'address' => ['nullable', 'string', 'max:255'],
                'birthdate' => ['nullable', 'date'],
                'company_id' => ['required', 'integer', 'exists:companies,id'],
            ],
            [
                // 🔹 Custom messages
                'name.required' => 'Owner name is required.',
                'name.max' => 'Owner name may not exceed 255 characters.',

                'email.required' => 'Email address is required.',
                'email.email' => 'Please enter a valid email address.',
                'email.max' => 'Email may not exceed 255 characters.',

                'phone.max' => 'Phone number is too long.',

                'birthdate.date' => 'Birthdate must be a valid date.',

                'company_id.required' => 'Company is required.',
                'company_id.exists' => 'The selected company does not exist.',
            ]
        );

        User::create([
            ...$validated,
            'password' => Hash::make('password123'),
        ]);

        return back()->with('success', 'Owner created successfully.');
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate(
            [
                'name' => ['required', 'string', 'max:255'],
                'email' => [
                    'required',
                    'email',
                    'max:255',
                    'unique:users,email,' . $user->id,
                ],
                'phone' => ['nullable', 'string', 'max:30'],
                'facebook' => ['nullable', 'url', 'max:255'],
                'address' => ['nullable', 'string', 'max:255'],
                'birthdate' => ['nullable', 'date', 'before:today'],
            ],
            [
                'name.required' => 'Name is required.',
                'email.required' => 'Email is required.',
                'email.email' => 'Please enter a valid email address.',
                'email.unique' => 'This email is already in use.',

                'facebook.url' => 'Facebook must be a valid URL.',

                'birthdate.date' => 'Birthdate must be a valid date.',
                'birthdate.before' => 'Birthdate must be in the past.',
            ]
        );

        $user->update($validated);

        return back()->with('success', 'Owner updated successfully.');
    }

}
