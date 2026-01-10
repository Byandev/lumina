import { Head, Link, useForm, usePage } from '@inertiajs/react';
import React from 'react';
import {
    Building2,
    Upload,
    CreditCard,
    FileSignature,
    User,
    // Facebook,
    Calendar,
    Phone,
    Mail,
    MapPin,
    AlertCircle,
    Plus,
    Trash2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { route } from 'ziggy-js';

type OwnerForm = {
    name: string;
    facebook_link: string;
    email: string;
    phone: string;
    address: string;
    birthdate: string;
    photo: File | null;
    id_with_signature: File | null;
};

type WelcomeForm = {
    company_name: string;
    company_email: string;
    company_phone: string;
    address: string;
    company_logo: File | null;
    company_owners_image: File | null;
    proof_of_payment: File | null;
    e_signature: File | null;
    has_existing_ecomm_process: 'yes' | 'no';
    owners: OwnerForm[];
};

const emptyOwner = (): OwnerForm => ({
    name: '',
    facebook_link: '',
    email: '',
    phone: '',
    address: '',
    birthdate: '',
    photo: null,
    id_with_signature: null,
});

export default function Welcome() {
    const { data, setData, post, processing, errors } = useForm<WelcomeForm>({
        company_name: '',
        company_email: '',
        company_phone: '',
        address: '',
        company_logo: null,
        company_owners_image: null,
        proof_of_payment: null,
        e_signature: null,
        has_existing_ecomm_process: 'no',
        owners: [emptyOwner()],
    });

    const onFile =
        (key: keyof WelcomeForm) =>
            (e: React.ChangeEvent<HTMLInputElement>) => {
                const file = e.target.files?.[0] ?? null;
                setData(key, file as any);
            };

    const onOwnerChange =
        (index: number, key: keyof OwnerForm) =>
            (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                const owners = [...data.owners];
                owners[index] = { ...owners[index], [key]: e.target.value };
                setData('owners', owners);
            };

    const onOwnerFile =
        (index: number, key: keyof OwnerForm) =>
            (e: React.ChangeEvent<HTMLInputElement>) => {
                const file = e.target.files?.[0] ?? null;
                const owners = [...data.owners];
                owners[index] = { ...owners[index], [key]: file };
                setData('owners', owners);
            };

    const addOwner = () => setData('owners', [...data.owners, emptyOwner()]);
    const removeOwner = (index: number) =>
        setData(
            'owners',
            data.owners.filter((_, i) => i !== index),
        );

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/partnership-application', {
            forceFormData: true,
            preserveScroll: true,
        });
    };






    return (
        <>
            <Head title="Welcome" />

            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
                <div className="mx-auto w-full max-w-4xl px-4 py-8">
                    {/* Header */}
                    <div className="mb-10">
                        <div className="flex flex-row items-center justify-center text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-pink-50 to-blue-50">
                                <img src={'/favicon.png'} alt="logo" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Welcome to Gencys!
                            </h1>
                        </div>

                        <p className="mt-2 max-w-2xl text-gray-600">
                            Let's just get things in order for the smooth
                            onboarding process.
                        </p>

                        <p className="mt-2 text-gray-600">
                            Please provide all necessary details below.
                        </p>
                        <p className="mt-2 text-sm text-gray-600">
                            Your Company details will be dedicated in your contract. Should you wish to change your company name, you will be required to sign new contract under your Desired COMPANY NAME.
                        </p>
                        <div className="mt-4 rounded-lg bg-gradient-to-r from-pink-50 to-blue-50 p-4">
                            <p className="text-gray-600 italic">
                                PLEASE PREPARE YOUR <span className='font-bold text-pink-600'>e-SIGNATURE, PAYMENT PROOF, PHOTO & COMPANY LOGO</span> AS YOU WILL HAVE TO UPLOAD those in this form.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={submit} className="space-y-8">
                        {/* Company Information */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Company Information
                                </h2>
                                <p className="mt-1 text-gray-600">
                                    Basic details about your company
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="col-span-2 space-y-2">
                                        <Label
                                            htmlFor="company_name"
                                            className="font-medium text-gray-700"
                                        >
                                            Company Name *
                                        </Label>
                                        <Input
                                            id="company_name"
                                            value={data.company_name}
                                            onChange={(e) =>
                                                setData(
                                                    'company_name',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Enter legal company name"
                                            className="h-11 focus:border-pink-300 focus:ring-1 focus:ring-pink-200"
                                            required
                                        />
                                        {errors.company_name && (
                                            <p className="text-sm text-pink-600">
                                                {errors.company_name}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="company_email"
                                            className="flex items-center gap-1 font-medium text-gray-700"
                                        >
                                            <Mail className="h-4 w-4 text-pink-500" />
                                            Company Email *
                                        </Label>
                                        <Input
                                            id="company_email"
                                            type="email"
                                            value={data.company_email}
                                            onChange={(e) =>
                                                setData(
                                                    'company_email',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="legal@company.com"
                                            className="h-11 focus:border-blue-300 focus:ring-1 focus:ring-blue-200"
                                            required
                                        />
                                        {errors.company_email && (
                                            <p className="text-sm text-pink-600">
                                                {errors.company_email}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="company_phone"
                                            className="flex items-center gap-1 font-medium text-gray-700"
                                        >
                                            <Phone className="h-4 w-4 text-blue-500" />
                                            Company Phone *
                                        </Label>
                                        <Input
                                            id="company_phone"
                                            value={data.company_phone}
                                            onChange={(e) =>
                                                setData(
                                                    'company_phone',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="+63 XXX XXX XXXX"
                                            className="h-11 focus:border-sky-300 focus:ring-1 focus:ring-sky-200"
                                            required
                                        />
                                        {errors.company_phone && (
                                            <p className="text-sm text-pink-600">
                                                {errors.company_phone}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="company_logo"
                                            className="font-medium text-gray-700"
                                        >
                                            Company Logo
                                        </Label>
                                        <div className="relative">
                                            <div className="flex h-11 items-center rounded-lg border border-gray-300 bg-white px-3 transition-colors hover:border-pink-300">
                                                <Upload className="mr-3 h-4 w-4 text-gray-500" />
                                                <span className="truncate text-sm text-gray-600">
                                                    {data.company_logo
                                                        ? data.company_logo.name
                                                        : 'Upload company logo'}
                                                </span>
                                            </div>
                                            <input
                                                id="company_logo"
                                                type="file"
                                                onChange={onFile(
                                                    'company_logo',
                                                )}
                                                className="absolute inset-0 cursor-pointer opacity-0"
                                            />
                                        </div>
                                        {errors.company_logo && (
                                            <p className="text-sm text-pink-600">
                                                {errors.company_logo}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="company_owners_image"
                                            className="font-medium text-gray-700"
                                        >
                                            Company Owner Photo
                                        </Label>
                                        <div className="relative">
                                            <div className="flex h-11 items-center rounded-lg border border-gray-300 bg-white px-3 transition-colors hover:border-blue-300">
                                                <Upload className="mr-3 h-4 w-4 text-gray-500" />
                                                <span className="truncate text-sm text-gray-600">
                                                    {data.company_owners_image
                                                        ? data
                                                            .company_owners_image
                                                            .name
                                                        : 'Upload group photo'}
                                                </span>
                                            </div>
                                            <input
                                                id="company_owners_image"
                                                type="file"
                                                onChange={onFile(
                                                    'company_owners_image',
                                                )}
                                                className="absolute inset-0 cursor-pointer opacity-0"
                                            />
                                        </div>
                                        {errors.company_owners_image && (
                                            <p className="text-sm text-pink-600">
                                                {errors.company_owners_image}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="address"
                                        className="flex items-center gap-1 font-medium text-gray-700"
                                    >
                                        <MapPin className="h-4 w-4 text-sky-500" />
                                        Business Address *
                                    </Label>
                                    <textarea
                                        id="address"
                                        value={data.address}
                                        onChange={(e) =>
                                            setData('address', e.target.value)
                                        }
                                        placeholder="Complete registered business address"
                                        rows={3}
                                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm focus:border-pink-300 focus:ring-1 focus:ring-pink-200 focus:outline-none"
                                        required
                                    />
                                    {errors.address && (
                                        <p className="text-sm text-pink-600">
                                            {errors.address}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <div className="rounded-lg bg-gradient-to-r from-pink-50 to-blue-50 p-4">
                                        <p className="font-medium text-gray-900">
                                            Do you have an existing e-commerce
                                            company or warehouse fulfillment
                                            process? *
                                        </p>
                                        <div className="mt-3 flex items-center gap-6">
                                            <label className="flex cursor-pointer items-center gap-3">
                                                <div className="relative">
                                                    <input
                                                        type="radio"
                                                        value="yes"
                                                        checked={
                                                            data.has_existing_ecomm_process ===
                                                            'yes'
                                                        }
                                                        onChange={() =>
                                                            setData(
                                                                'has_existing_ecomm_process',
                                                                'yes',
                                                            )
                                                        }
                                                        className="h-4 w-4 border-gray-300 text-pink-600 focus:ring-pink-500"
                                                    />
                                                </div>
                                                <span className="text-gray-700">
                                                    Yes
                                                </span>
                                            </label>
                                            <label className="flex cursor-pointer items-center gap-3">
                                                <div className="relative">
                                                    <input
                                                        type="radio"
                                                        value="no"
                                                        checked={
                                                            data.has_existing_ecomm_process ===
                                                            'no'
                                                        }
                                                        onChange={() =>
                                                            setData(
                                                                'has_existing_ecomm_process',
                                                                'no',
                                                            )
                                                        }
                                                        className="h-4 w-4 border-gray-300 text-pink-600 focus:ring-pink-500"
                                                    />
                                                </div>
                                                <span className="text-gray-700">
                                                    No
                                                </span>
                                            </label>
                                        </div>
                                        {errors.has_existing_ecomm_process && (
                                            <p className="mt-2 text-sm text-pink-600">
                                                {
                                                    errors.has_existing_ecomm_process
                                                }
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment & Documents */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Payment & Documents
                                </h2>
                                <p className="mt-1 text-gray-600">
                                    Payment details and required documents
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="rounded-lg bg-gradient-to-r from-blue-50 to-sky-50 p-5">
                                    <div className="flex items-start gap-3">
                                        <CreditCard className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                                        <div className="flex-1">
                                            <p className="font-medium text-blue-900">
                                                Enrollment Fee: ₱150,000.00
                                            </p>
                                            <div className="mt-3 space-y-2">
                                                <div className="flex items-center">
                                                    <span className="w-32 text-gray-600">
                                                        Bank:
                                                    </span>
                                                    <span className="font-medium">
                                                        BDO
                                                    </span>
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="w-32 text-gray-600">
                                                        Account Name:
                                                    </span>
                                                    <span className="font-medium">
                                                        Gencys Digital Trading
                                                        Inc
                                                    </span>
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="w-32 text-gray-600">
                                                        Account Number:
                                                    </span>
                                                    <span className="font-mono font-bold">
                                                        0080 28.00 6132
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3">
                                                <p className="text-center text-sm font-bold text-red-600">
                                                    PARTNERSHIP FEE IS
                                                    NON-REFUNDABLE
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-1 font-medium text-gray-700">
                                            <CreditCard className="h-4 w-4 text-blue-500" />
                                            Proof of Payment *
                                        </Label>
                                        <div className="relative">
                                            <div className="flex h-11 items-center rounded-lg border border-gray-300 bg-white px-3 transition-colors hover:border-blue-300">
                                                <Upload className="mr-3 h-4 w-4 text-gray-500" />
                                                <span className="truncate text-sm text-gray-600">
                                                    {data.proof_of_payment
                                                        ? data.proof_of_payment
                                                            .name
                                                        : 'Upload payment proof'}
                                                </span>
                                            </div>
                                            <input
                                                type="file"
                                                onChange={onFile(
                                                    'proof_of_payment',
                                                )}
                                                className="absolute inset-0 cursor-pointer opacity-0"
                                                required
                                            />
                                        </div>
                                        {errors.proof_of_payment && (
                                            <p className="text-sm text-pink-600">
                                                {errors.proof_of_payment}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-1 font-medium text-gray-700">
                                            <FileSignature className="h-4 w-4 text-pink-500" />
                                            E-Signature *
                                        </Label>
                                        <div className="relative">
                                            <div className="flex h-11 items-center rounded-lg border border-gray-300 bg-white px-3 transition-colors hover:border-pink-300">
                                                <Upload className="mr-3 h-4 w-4 text-gray-500" />
                                                <span className="truncate text-sm text-gray-600">
                                                    {data.e_signature
                                                        ? data.e_signature.name
                                                        : 'Upload e-signature'}
                                                </span>
                                            </div>
                                            <input
                                                type="file"
                                                onChange={onFile('e_signature')}
                                                className="absolute inset-0 cursor-pointer opacity-0"
                                                required
                                            />
                                        </div>
                                        {errors.e_signature && (
                                            <p className="text-sm text-pink-600">
                                                {errors.e_signature}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Owners */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="mb-6 flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        Owner Information
                                    </h2>
                                    <p className="mt-1 text-gray-600">
                                        Details for all company owners
                                    </p>
                                </div>
                                <Button
                                    type="button"
                                    onClick={addOwner}
                                    variant="outline"
                                    className="gap-2 border-blue-200 text-blue-600 hover:bg-blue-50"
                                >
                                    <Plus className="h-4 w-4" />
                                    Add Owner
                                </Button>
                            </div>

                            <div className="space-y-6">
                                {data.owners.map((owner, index) => (
                                    <div
                                        key={index}
                                        className="rounded-lg bg-gradient-to-br from-gray-50 to-white p-6"
                                    >
                                        <div className="mb-6 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-pink-100 to-blue-100">
                                                    <User className="h-5 w-5 text-pink-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-gray-900">
                                                        Owner #{index + 1}
                                                    </h3>
                                                    {owner.name && (
                                                        <p className="text-sm text-gray-600">
                                                            {owner.name}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            {data.owners.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeOwner(index)
                                                    }
                                                    className="flex items-center gap-2 text-sm text-pink-600 hover:text-pink-700"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    Remove
                                                </button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium text-gray-700">
                                                    Full Name *
                                                </Label>
                                                <Input
                                                    value={owner.name}
                                                    onChange={onOwnerChange(
                                                        index,
                                                        'name',
                                                    )}
                                                    placeholder="Legal full name"
                                                    className="h-11 focus:border-pink-300 focus:ring-1 focus:ring-pink-200"
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="flex items-center gap-1 text-sm font-medium text-gray-700">
                                                    {/*<Facebook className="h-4 w-4" />*/}
                                                    Facebook Profile
                                                </Label>
                                                <Input
                                                    value={owner.facebook_link}
                                                    onChange={onOwnerChange(
                                                        index,
                                                        'facebook_link',
                                                    )}
                                                    placeholder="facebook.com/username"
                                                    className="h-11 focus:border-blue-300 focus:ring-1 focus:ring-blue-200"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium text-gray-700">
                                                    Email Address *
                                                </Label>
                                                <Input
                                                    type="email"
                                                    value={owner.email}
                                                    onChange={onOwnerChange(
                                                        index,
                                                        'email',
                                                    )}
                                                    placeholder="owner@email.com"
                                                    className="h-11 focus:border-sky-300 focus:ring-1 focus:ring-sky-200"
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium text-gray-700">
                                                    Phone Number *
                                                </Label>
                                                <Input
                                                    value={owner.phone}
                                                    onChange={onOwnerChange(
                                                        index,
                                                        'phone',
                                                    )}
                                                    placeholder="+63 XXX XXX XXXX"
                                                    className="h-11 focus:border-pink-300 focus:ring-1 focus:ring-pink-200"
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2 md:col-span-2">
                                                <Label className="text-sm font-medium text-gray-700">
                                                    Residential Address *
                                                </Label>
                                                <textarea
                                                    value={owner.address}
                                                    onChange={onOwnerChange(
                                                        index,
                                                        'address',
                                                    )}
                                                    placeholder="Current residential address"
                                                    rows={2}
                                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm focus:border-blue-300 focus:ring-1 focus:ring-blue-200 focus:outline-none"
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="flex items-center gap-1 text-sm font-medium text-gray-700">
                                                    <Calendar className="h-4 w-4 text-blue-500" />
                                                    Date of Birth *
                                                </Label>
                                                <Input
                                                    type="date"
                                                    value={owner.birthdate}
                                                    onChange={onOwnerChange(
                                                        index,
                                                        'birthdate',
                                                    )}
                                                    className="h-11 focus:border-sky-300 focus:ring-1 focus:ring-sky-200"
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium text-gray-700">
                                                    Owner Photo *
                                                </Label>
                                                <div className="relative">
                                                    <div className="flex h-11 items-center rounded-lg border border-gray-300 bg-white px-3 transition-colors hover:border-pink-300">
                                                        <Upload className="mr-3 h-4 w-4 text-gray-500" />
                                                        <span className="truncate text-sm text-gray-600">
                                                            {owner.photo
                                                                ? owner.photo
                                                                    .name
                                                                : 'Upload photo'}
                                                        </span>
                                                    </div>
                                                    <input
                                                        type="file"
                                                        onChange={onOwnerFile(
                                                            index,
                                                            'photo',
                                                        )}
                                                        className="absolute inset-0 cursor-pointer opacity-0"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2 md:col-span-2">
                                                <Label className="text-sm font-medium text-gray-700">
                                                    ID with 3 Specimen
                                                    Signatures *
                                                </Label>
                                                <div className="relative">
                                                    <div className="flex h-11 items-center rounded-lg border border-gray-300 bg-white px-3 transition-colors hover:border-blue-300">
                                                        <Upload className="mr-3 h-4 w-4 text-gray-500" />
                                                        <span className="truncate text-sm text-gray-600">
                                                            {owner.id_with_signature
                                                                ? owner
                                                                    .id_with_signature
                                                                    .name
                                                                : 'Upload ID with signatures'}
                                                        </span>
                                                    </div>
                                                    <input
                                                        type="file"
                                                        onChange={onOwnerFile(
                                                            index,
                                                            'id_with_signature',
                                                        )}
                                                        className="absolute inset-0 cursor-pointer opacity-0"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="pt-8">
                            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                                <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                                    <div className="text-center sm:text-left">
                                        <p className="font-medium text-gray-900">
                                            Ready to submit your application?
                                        </p>
                                        <p className="mt-1 text-sm text-gray-600">
                                            Review all information before
                                            submitting.
                                        </p>
                                    </div>
                                    <div className='flex flex-col gap-3 sm:flex-row sm:gap-2'>
                                        <Link href='/' className='border rounded-lg text-gray-600 py-1.5 px-4 border-gray-300 hover:bg-gray-50 text-center transition-colors'>
                                            Cancel
                                        </Link>
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white"
                                        >
                                            {processing ? (
                                                <>
                                                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                                    Submitting...
                                                </>
                                            ) : (
                                                'Submit Application'
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>

                    <div className="mt-12 border-t border-gray-200 pt-8 text-center text-sm text-gray-500">
                        <p>
                            Need assistance? Contact our team at{' '}
                            <a
                                href="mailto:onboarding@gencys.com"
                                className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
                            >
                                onboarding@gencys.com
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
