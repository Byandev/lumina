import { Head, Link, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    Building2,
    CreditCard,
    FileText,
    Plus,
    Trash2,
    Upload,
    User,
    X,
} from 'lucide-react';
import React from 'react';

import ComponentCard from '@/components/component-card';
import InputError from '@/components/input-error';
import { AvatarEditor } from '@/components/ui/avatar-editor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import FileInput from '@/components/ui/file-input';
import SectionHeader from '@/components/ui/seachtion-header';

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
    const [companyLogoUrl, setCompanyLogoUrl] = React.useState<string | null>(
        null,
    );
    const [companyOwnersPhotoUrl, setCompanyOwnersPhotoUrl] = React.useState<
        string | null
    >(null);
    const [ownerPhotoUrls, setOwnerPhotoUrls] = React.useState<
        Record<number, string | null>
    >({});

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

    const updateOwnerFile = (
        index: number,
        key: keyof OwnerForm,
        file: File | null,
    ) => {
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
            <Head title="Partnership Application" />

            <div className="min-h-screen bg-zinc-50">
                {/* Top bar */}
                <div className="border-b border-zinc-200 bg-white">
                    <div className="sticky mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white">
                                <img
                                    src="/favicon.png"
                                    alt="logo"
                                    className="h-6 w-6"
                                />
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-zinc-900">
                                    Gencys
                                </div>
                                <div className="text-xs text-zinc-500">
                                    Partner onboarding
                                </div>
                            </div>
                        </div>

                        <Link
                            href="/"
                            className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
                        >
                            Back to home
                        </Link>
                    </div>
                </div>

                <div className="mx-auto w-full max-w-5xl px-4 py-10">
                    <div className="space-y-8">
                        {/* Header block */}
                        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm md:p-8">
                            <div className="space-y-3">
                                <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 md:text-3xl">
                                    Welcome to Gencys!
                                </h1>

                                <p className="max-w-2xl text-sm leading-relaxed text-zinc-600 md:text-base">
                                    Let's just get things in order for the
                                    smooth onboarding process.
                                </p>

                                <div className="space-y-2 text-sm leading-relaxed text-zinc-600 md:text-base">
                                    <p>
                                        Please provide all necessary details
                                        below.
                                    </p>

                                    <p className="text-xs leading-relaxed text-zinc-500 md:text-sm">
                                        Your Company details will be dedicated
                                        in your contract. Should you wish to
                                        change your company name, you will be
                                        required to sign new contract under your
                                        Desired COMPANY NAME.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 md:p-6">
                            <div className="flex items-start gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-amber-200 bg-white">
                                    <AlertCircle className="h-5 w-5 text-amber-700" />
                                </div>

                                <div className="space-y-1">
                                    <div className="text-sm font-semibold text-amber-900">
                                        Prepare these before you start
                                    </div>

                                    <p className="text-sm leading-relaxed text-amber-900/80">
                                        <span className="italic">
                                            PLEASE PREPARE YOUR{' '}
                                            <span className="font-semibold text-amber-900">
                                                e-SIGNATURE, PAYMENT PROOF,
                                                PHOTO & COMPANY LOGO
                                            </span>{' '}
                                            AS YOU WILL HAVE TO UPLOAD those in
                                            this form.
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={submit} className="mt-8 space-y-6">
                        {/* Company Information */}
                        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm md:p-10">
                            <div className="space-y-8">
                                <SectionHeader
                                    icon={
                                        <Building2 className="h-6 w-6 text-zinc-800" />
                                    }
                                    title="Company Information"
                                    subtitle="These details will be used for your contract and onboarding."
                                />

                                <div className="h-px w-full bg-zinc-200/70" />

                                {/* Upload tiles */}
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-zinc-800">
                                            Company Logo{' '}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </Label>
                                        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                                            <AvatarEditor
                                                fallbackText="CL"
                                                value={{ url: companyLogoUrl }}
                                                onChange={(result) => {
                                                    if (!result) {
                                                        setCompanyLogoUrl(null);
                                                        setData(
                                                            'company_logo',
                                                            null,
                                                        );
                                                        return;
                                                    }
                                                    setCompanyLogoUrl(
                                                        result.previewUrl,
                                                    );
                                                    setData(
                                                        'company_logo',
                                                        result.file,
                                                    );
                                                }}
                                                maxFileMB={5}
                                            />
                                            <p className="mt-3 text-xs text-zinc-500">
                                                Recommended: square image,
                                                transparent background if
                                                available.
                                            </p>
                                            <InputError
                                                message={errors.company_logo}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-zinc-800">
                                            Company Owners Photo{' '}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </Label>
                                        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                                            <AvatarEditor
                                                fallbackText="CO"
                                                value={{
                                                    url: companyOwnersPhotoUrl,
                                                }}
                                                onChange={(result) => {
                                                    if (!result) {
                                                        setCompanyOwnersPhotoUrl(
                                                            null,
                                                        );
                                                        setData(
                                                            'company_owners_image',
                                                            null,
                                                        );
                                                        return;
                                                    }
                                                    setCompanyOwnersPhotoUrl(
                                                        result.previewUrl,
                                                    );
                                                    setData(
                                                        'company_owners_image',
                                                        result.file,
                                                    );
                                                }}
                                                maxFileMB={5}
                                            />
                                            <p className="mt-3 text-xs text-zinc-500">
                                                Upload a group photo of owners
                                                (recommended: clear faces, good
                                                lighting).
                                            </p>
                                            <InputError
                                                message={
                                                    errors.company_owners_image
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Fields */}
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="space-y-2 md:col-span-2">
                                        <Label
                                            htmlFor="company_name"
                                            className="text-sm font-medium text-zinc-800"
                                        >
                                            Company Name{' '}
                                            <span className="text-red-600">
                                                *
                                            </span>
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
                                            className="h-11"
                                            required
                                        />
                                        <InputError
                                            message={errors.company_name}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="company_email"
                                            className="text-sm font-medium text-zinc-800"
                                        >
                                            Company Email{' '}
                                            <span className="text-red-600">
                                                *
                                            </span>
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
                                            className="h-11"
                                            required
                                        />
                                        <InputError
                                            message={errors.company_email}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="company_phone"
                                            className="text-sm font-medium text-zinc-800"
                                        >
                                            Company Phone{' '}
                                            <span className="text-red-600">
                                                *
                                            </span>
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
                                            className="h-11"
                                            required
                                        />
                                        <InputError
                                            message={errors.company_phone}
                                        />
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <Label
                                            htmlFor="address"
                                            className="text-sm font-medium text-zinc-800"
                                        >
                                            Business Address{' '}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </Label>
                                        <textarea
                                            id="address"
                                            value={data.address}
                                            onChange={(e) =>
                                                setData(
                                                    'address',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Complete registered business address"
                                            rows={3}
                                            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm outline-none placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
                                            required
                                        />
                                        <InputError message={errors.address} />
                                    </div>

                                    {/* Segmented control */}
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-zinc-800">
                                            Existing E-commerce Process?{' '}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </Label>

                                        <div className="inline-flex rounded-xl border border-zinc-200 bg-white p-1">
                                            {(['yes', 'no'] as const).map(
                                                (v) => {
                                                    const active =
                                                        data.has_existing_ecomm_process ===
                                                        v;
                                                    return (
                                                        <button
                                                            key={v}
                                                            type="button"
                                                            onClick={() =>
                                                                setData(
                                                                    'has_existing_ecomm_process',
                                                                    v,
                                                                )
                                                            }
                                                            className={[
                                                                'text-md rounded-lg px-4 font-semibold transition',
                                                                active
                                                                    ? 'bg-zinc-900 text-white'
                                                                    : 'text-zinc-700 hover:bg-zinc-50',
                                                            ].join(' ')}
                                                        >
                                                            {v === 'yes'
                                                                ? 'Yes'
                                                                : 'No'}
                                                        </button>
                                                    );
                                                },
                                            )}
                                        </div>

                                        <InputError
                                            message={
                                                errors.has_existing_ecomm_process
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Information */}
                        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm md:p-10">
                            <div className="space-y-8">
                                <SectionHeader
                                    icon={
                                        <CreditCard className="h-6 w-6 text-zinc-800" />
                                    }
                                    title="Payment & Documents"
                                    subtitle="Upload your proof of payment and e-signature."
                                />

                                <div className="h-px w-full bg-zinc-200/70" />

                                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
                                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                                        <div>
                                            <div className="text-sm font-semibold text-zinc-900">
                                                Enrollment Fee
                                            </div>
                                            <div className="mt-1 text-sm text-zinc-600">
                                                One-time partnership fee
                                            </div>
                                        </div>
                                        <div className="text-3xl font-bold tracking-tight text-zinc-900">
                                            ₱150,000.00
                                        </div>
                                    </div>

                                    <div className="mt-6 grid gap-3 border-t border-zinc-200 pt-6 text-sm">
                                        <div className="flex items-center justify-between">
                                            <span className="text-zinc-600">
                                                Bank
                                            </span>
                                            <span className="font-medium text-zinc-900">
                                                BDO
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-zinc-600">
                                                Account Name
                                            </span>
                                            <span className="font-medium text-zinc-900">
                                                Gencys Digital Trading Inc
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-zinc-600">
                                                Account Number
                                            </span>
                                            <span className="font-mono text-base font-semibold text-zinc-900">
                                                0080 28.00 6132
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                                        Partnership fee is non-refundable.
                                    </div>
                                </div>

                                {/* FIX: grid wrapper so inputs align nicely */}
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <FileInput
                                        label="Proof of Payment"
                                        accept="image/*,.pdf"
                                        value={data.proof_of_payment}
                                        onChange={(file) =>
                                            setData('proof_of_payment', file)
                                        }
                                        error={errors.proof_of_payment}
                                        required
                                        description="Screenshot or scanned receipt (JPEG/PNG/PDF)"
                                    />

                                    <FileInput
                                        label="E-Signature"
                                        accept="image/*"
                                        value={data.e_signature}
                                        onChange={(file) =>
                                            setData('e_signature', file)
                                        }
                                        error={errors.e_signature}
                                        required
                                        description="PNG with transparent background preferred"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Owner Information */}
                        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm md:p-10">
                            <div className="space-y-8">
                                <SectionHeader
                                    icon={
                                        <User className="h-6 w-6 text-zinc-800" />
                                    }
                                    title="Owner Information"
                                    subtitle="Add details for each owner."
                                    right={
                                        <Button
                                            type="button"
                                            onClick={addOwner}
                                            variant="outline"
                                            className="h-10 gap-2 rounded-xl border-zinc-200 bg-white px-4 text-sm hover:border-zinc-300"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Add Owner
                                        </Button>
                                    }
                                />

                                <div className="h-px w-full bg-zinc-200/70" />

                                <div className="space-y-10">
                                    {data.owners.map((owner, index) => (
                                        <div
                                            key={index}
                                            className="rounded-2xl border border-zinc-200 bg-white p-5 md:p-6"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex items-start gap-3">
                                                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 text-sm font-semibold text-zinc-700">
                                                        {index + 1}
                                                    </div>
                                                    <div>
                                                        <div className="text-base font-semibold text-zinc-900">
                                                            Owner {index + 1}
                                                        </div>
                                                        <div className="mt-0.5 text-sm text-zinc-500">
                                                            {owner.name
                                                                ? owner.name
                                                                : 'Provide owner details below.'}
                                                        </div>
                                                    </div>
                                                </div>

                                                {data.owners.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeOwner(index)
                                                        }
                                                        className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:border-zinc-300 hover:text-zinc-900"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        Remove
                                                    </button>
                                                )}
                                            </div>

                                            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium text-zinc-800">
                                                        Full Name{' '}
                                                        <span className="text-red-600">
                                                            *
                                                        </span>
                                                    </Label>
                                                    <Input
                                                        value={owner.name}
                                                        onChange={(e) => {
                                                            const owners = [
                                                                ...data.owners,
                                                            ];
                                                            owners[index].name =
                                                                e.target.value;
                                                            setData(
                                                                'owners',
                                                                owners,
                                                            );
                                                        }}
                                                        placeholder="Legal full name"
                                                        className="h-11"
                                                        required
                                                    />
                                                    <InputError
                                                        message={
                                                            errors[
                                                                `owners.${index}.name`
                                                            ]
                                                        }
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium text-zinc-800">
                                                        Email Address{' '}
                                                        <span className="text-red-600">
                                                            *
                                                        </span>
                                                    </Label>
                                                    <Input
                                                        type="email"
                                                        value={owner.email}
                                                        onChange={(e) => {
                                                            const owners = [
                                                                ...data.owners,
                                                            ];
                                                            owners[
                                                                index
                                                            ].email =
                                                                e.target.value;
                                                            setData(
                                                                'owners',
                                                                owners,
                                                            );
                                                        }}
                                                        placeholder="owner@email.com"
                                                        className="h-11"
                                                        required
                                                    />
                                                    <InputError
                                                        message={
                                                            errors[
                                                                `owners.${index}.email`
                                                            ]
                                                        }
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium text-zinc-800">
                                                        Phone Number{' '}
                                                        <span className="text-red-600">
                                                            *
                                                        </span>
                                                    </Label>
                                                    <Input
                                                        value={owner.phone}
                                                        onChange={(e) => {
                                                            const owners = [
                                                                ...data.owners,
                                                            ];
                                                            owners[
                                                                index
                                                            ].phone =
                                                                e.target.value;
                                                            setData(
                                                                'owners',
                                                                owners,
                                                            );
                                                        }}
                                                        placeholder="+63 XXX XXX XXXX"
                                                        className="h-11"
                                                        required
                                                    />
                                                    <InputError
                                                        message={
                                                            errors[
                                                                `owners.${index}.phone`
                                                            ]
                                                        }
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium text-zinc-800">
                                                        Date of Birth{' '}
                                                        <span className="text-red-600">
                                                            *
                                                        </span>
                                                    </Label>
                                                    <Input
                                                        type="date"
                                                        value={owner.birthdate}
                                                        onChange={(e) => {
                                                            const owners = [
                                                                ...data.owners,
                                                            ];
                                                            owners[
                                                                index
                                                            ].birthdate =
                                                                e.target.value;
                                                            setData(
                                                                'owners',
                                                                owners,
                                                            );
                                                        }}
                                                        className="h-11"
                                                        required
                                                    />
                                                    <InputError
                                                        message={
                                                            errors[
                                                                `owners.${index}.birthdate`
                                                            ]
                                                        }
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium text-zinc-800">
                                                        Facebook Profile
                                                    </Label>
                                                    <Input
                                                        value={
                                                            owner.facebook_link
                                                        }
                                                        onChange={(e) => {
                                                            const owners = [
                                                                ...data.owners,
                                                            ];
                                                            owners[
                                                                index
                                                            ].facebook_link =
                                                                e.target.value;
                                                            setData(
                                                                'owners',
                                                                owners,
                                                            );
                                                        }}
                                                        placeholder="facebook.com/username"
                                                        className="h-11"
                                                    />
                                                    <InputError
                                                        message={
                                                            errors[
                                                                `owners.${index}.facebook_link`
                                                            ]
                                                        }
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium text-zinc-800">
                                                        Owner Photo{' '}
                                                        <span className="text-red-600">
                                                            *
                                                        </span>
                                                    </Label>

                                                    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                                                        <AvatarEditor
                                                            fallbackText="OP"
                                                            value={{
                                                                url:
                                                                    ownerPhotoUrls[
                                                                        index
                                                                    ] || null,
                                                            }}
                                                            onChange={(
                                                                result,
                                                            ) => {
                                                                if (!result) {
                                                                    setOwnerPhotoUrls(
                                                                        (
                                                                            prev,
                                                                        ) => ({
                                                                            ...prev,
                                                                            [index]:
                                                                                null,
                                                                        }),
                                                                    );
                                                                    updateOwnerFile(
                                                                        index,
                                                                        'photo',
                                                                        null,
                                                                    );
                                                                    return;
                                                                }
                                                                setOwnerPhotoUrls(
                                                                    (prev) => ({
                                                                        ...prev,
                                                                        [index]:
                                                                            result.previewUrl,
                                                                    }),
                                                                );
                                                                updateOwnerFile(
                                                                    index,
                                                                    'photo',
                                                                    result.file,
                                                                );
                                                            }}
                                                            maxFileMB={5}
                                                        />
                                                        <InputError
                                                            message={
                                                                errors[
                                                                    `owners.${index}.photo`
                                                                ]
                                                            }
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2 md:col-span-2">
                                                    <Label className="text-sm font-medium text-zinc-800">
                                                        Residential Address{' '}
                                                        <span className="text-red-600">
                                                            *
                                                        </span>
                                                    </Label>
                                                    <textarea
                                                        value={owner.address}
                                                        onChange={(e) => {
                                                            const owners = [
                                                                ...data.owners,
                                                            ];
                                                            owners[
                                                                index
                                                            ].address =
                                                                e.target.value;
                                                            setData(
                                                                'owners',
                                                                owners,
                                                            );
                                                        }}
                                                        placeholder="Current residential address"
                                                        rows={2}
                                                        className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm outline-none placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
                                                        required
                                                    />
                                                    <InputError
                                                        message={
                                                            errors[
                                                                `owners.${index}.address`
                                                            ]
                                                        }
                                                    />
                                                </div>

                                                <div className="space-y-2 md:col-span-2">
                                                    <FileInput
                                                        label="ID with 3 Specimen Signatures"
                                                        accept="image/*,.pdf"
                                                        value={
                                                            owner.id_with_signature
                                                        }
                                                        onChange={(file) =>
                                                            updateOwnerFile(
                                                                index,
                                                                'id_with_signature',
                                                                file,
                                                            )
                                                        }
                                                        required
                                                        description="Valid ID with 3 different signatures (JPEG/PNG/PDF)"
                                                    />
                                                    <InputError
                                                        message={
                                                            errors[
                                                                `owners.${index}.id_with_signature`
                                                            ]
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-10 text-center text-sm text-zinc-500">
                            Need assistance? Contact{' '}
                            <a
                                href="mailto:onboarding@gencys.com"
                                className="font-medium text-zinc-700 hover:text-zinc-900 hover:underline"
                            >
                                onboarding@gencys.com
                            </a>
                            .
                        </div>

                        {/* Sticky submit bar */}
                        <div className="sticky bottom-0 -mx-4 mt-8 border-t border-zinc-200 bg-white/80 px-4 py-4 backdrop-blur">
                            <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div className="text-sm">
                                    <div className="font-semibold text-zinc-900">
                                        Ready to submit?
                                    </div>
                                    <div className="text-zinc-500">
                                        Double-check all details. Changes cannot
                                        be made after submission.
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <Link
                                        href="/"
                                        className="inline-flex h-9.5 items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 text-sm font-medium text-zinc-700 hover:border-zinc-300 hover:text-zinc-900"
                                    >
                                        Cancel
                                    </Link>

                                    <Button type="submit" disabled={processing}>
                                        {processing ? (
                                            <>
                                                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                                Submitting...
                                            </>
                                        ) : (
                                            'Submit Application'
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
