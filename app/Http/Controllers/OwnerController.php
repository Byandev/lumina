<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class OwnerController extends Controller
{

    public function store(Request $request, Company $company)
    {

        $validated = $request->validate(
            [
                'name' => ['required', 'string', 'max:255'],
                'email' => ['required', 'email', 'max:255'],
                'phone' => ['nullable', 'string', 'max:30'],
                'facebook' => ['nullable', 'string', 'max:255'],
                'address' => ['nullable', 'string', 'max:255'],
                'birthdate' => ['nullable', 'date'],
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

            ]
        );

        User::create([
            ...$validated,
            'password' => Hash::make('password123'),
            'company_id' => $company->id,
        ]);



        return back()->with('success', 'Owner created successfully.');
    }

    public function update(Request $request, $id)
    {

        dd($request->toArray());

        $user = User::find($id);
        $validated = $request->validate(
            [
                'name' => ['required', 'string', 'max:255'],
                'email' => [
                    'required',
                    'email',
                    'max:255',
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
                'facebook.url' => 'Facebook must be a valid URL.',

                'birthdate.date' => 'Birthdate must be a valid date.',
                'birthdate.before' => 'Birthdate must be in the past.',
            ]
        );

        $user->update($validated);

        return back()->with('success', 'Owner updated successfully.');
    }

    public function destroy($id)
    {
        $user = User::find($id);
        $user->delete();

        if ($user->photo) {
            Storage::disk('public')->delete($user->photo);
        }


        return back()->with('success', 'Owner removed successfully.');
    }

}
