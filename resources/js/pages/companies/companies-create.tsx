import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { companies } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import {
    Camera,
    Mail,
    MapPin,
    Phone,
    Plus,
    Trash2,
    Upload,
    User,
    X,
    CalendarIcon,
    Link as LinkIcon,
    Loader2,
    FileText,
} from 'lucide-react';
import React, { useRef, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Companies',
        href: companies().url,
    },
    {
        title: 'Create',
        href: '/companies/create',
    },
];

type Owner = {
    name: string;
    email: string;
    phone: string;
    address: string;
    photo: File | null;
    facebook: string;
    birthdate: string;
    id_file: File | null;
};

interface Company {
    id: number;
    name: string | null;
    logo: string | null;
}

interface User {
    id: number;
    name: string;
    photo: string | null;
}

interface CompaniesProps {
    companies: Company[];
    users: User[];
}

type FormData = {
    name: string;
    email: string;
    phone: string;
    address: string;
    logo: File | null;
    owners: Owner[];
    sponsor_id: string;
    coach_id: string;
};

export default function CompaniesCreate({ companies, users }: CompaniesProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [ownerPreviewUrls, setOwnerPreviewUrls] = useState<
        Record<number, string>
    >({});
    const [idFileNames, setIdFileNames] = useState<Record<number, string>>({});

    const { data, setData, post, processing, errors, reset } =
        useForm<FormData>({
            name: '',
            email: '',
            phone: '',
            address: '',
            logo: null,
            owners: [] as Owner[],
            sponsor_id: '',
            coach_id: '',
        });

    function submit(e: React.FormEvent) {
        e.preventDefault();

        post('/companies/store', {
            forceFormData: true,
        });
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setData(name as keyof FormData, value);
    }

    function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            const validTypes = [
                'image/jpeg',
                'image/png',
                'image/gif',
                'image/webp',
            ];
            if (!validTypes.includes(file.type)) {
                alert(
                    'Please upload a valid image file (JPEG, PNG, GIF, WebP)',
                );
                return;
            }

            const maxSize = 5 * 1024 * 1024;
            if (file.size > maxSize) {
                alert('File size should not exceed 5MB');
                return;
            }

            setData('logo', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    }

    function handleOwnerPhotoChange(
        index: number,
        e: React.ChangeEvent<HTMLInputElement>,
    ) {
        const file = e.target.files?.[0];
        if (file) {
            const validTypes = [
                'image/jpeg',
                'image/png',
                'image/gif',
                'image/webp',
                'application/pdf',
            ];
            if (!validTypes.includes(file.type)) {
                alert(
                    'Please upload a valid image file (JPEG, PNG, GIF, WebP) or PDF',
                );
                return;
            }

            const maxSize = 5 * 1024 * 1024;
            if (file.size > maxSize) {
                alert('File size should not exceed 5MB');
                return;
            }

            const updatedOwners = [...data.owners];
            updatedOwners[index] = {
                ...updatedOwners[index],
                photo: file,
            };
            setData('owners', updatedOwners);

            const reader = new FileReader();
            reader.onloadend = () => {
                setOwnerPreviewUrls((prev) => ({
                    ...prev,
                    [index]: reader.result as string,
                }));
            };
            reader.readAsDataURL(file);
        }
    }

    function handleIdFileChange(
        index: number,
        e: React.ChangeEvent<HTMLInputElement>,
    ) {
        const file = e.target.files?.[0];
        if (file) {
            const validTypes = [
                'image/jpeg',
                'image/png',
                'image/gif',
                'image/webp',
                'application/pdf',
            ];
            if (!validTypes.includes(file.type)) {
                alert(
                    'Please upload a valid image file (JPEG, PNG, GIF, WebP) or PDF',
                );
                return;
            }

            const maxSize = 10 * 1024 * 1024; // 10MB for ID files
            if (file.size > maxSize) {
                alert('File size should not exceed 10MB');
                return;
            }

            const updatedOwners = [...data.owners];
            updatedOwners[index] = {
                ...updatedOwners[index],
                id_file: file,
            };
            setData('owners', updatedOwners);

            setIdFileNames((prev) => ({
                ...prev,
                [index]: file.name,
            }));
        }
    }

    function removeLogo() {
        setData('logo', null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }

    function removeOwnerPhoto(index: number) {
        const updatedOwners = [...data.owners];
        updatedOwners[index] = {
            ...updatedOwners[index],
            photo: null,
        };
        setData('owners', updatedOwners);

        setOwnerPreviewUrls((prev) => {
            const newUrls = { ...prev };
            delete newUrls[index];
            return newUrls;
        });
    }

    function removeIdFile(index: number) {
        const updatedOwners = [...data.owners];
        updatedOwners[index] = {
            ...updatedOwners[index],
            id_file: null,
        };
        setData('owners', updatedOwners);

        setIdFileNames((prev) => {
            const newNames = { ...prev };
            delete newNames[index];
            return newNames;
        });
    }

    function handleOwnerChange(
        index: number,
        field: keyof Owner,
        value: string,
    ) {
        const updatedOwners = [...data.owners];
        updatedOwners[index] = {
            ...updatedOwners[index],
            [field]: value,
        };
        setData('owners', updatedOwners);
    }

    function addOwner() {
        setData('owners', [
            ...data.owners,
            {
                name: '',
                email: '',
                phone: '',
                address: '',
                photo: null,
                facebook: '',
                birthdate: '',
                id_file: null,
            },
        ]);
    }

    function removeOwner(index: number) {
        const updatedOwners = data.owners.filter((_, i) => i !== index);
        setData('owners', updatedOwners);

        setOwnerPreviewUrls((prev) => {
            const newUrls = { ...prev };
            delete newUrls[index];
            return newUrls;
        });

        setIdFileNames((prev) => {
            const newNames = { ...prev };
            delete newNames[index];
            return newNames;
        });
    }

    function handleReset() {
        reset();
        setPreviewUrl(null);
        setOwnerPreviewUrls({});
        setIdFileNames({});
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Company" />
            <div className="px-4 py-7">
                <div className="items-center mb-8">
                    <h1 className="text-lg md:text-xl font-bold text-gray-900">
                        Create New Company
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Add a new company to your system
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-8">
                    {/* Company Information */}
                    <div className="rounded-lg border border-gray-200 bg-white p-6">
                        <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-gray-900">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                                <svg
                                    className="h-4 w-4 text-blue-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                    />
                                </svg>
                            </div>
                            Company Information
                        </h2>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="name"
                                        className="text-sm font-medium text-gray-700"
                                    >
                                        Company Name *
                                    </Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={data.name}
                                        required
                                        autoFocus
                                        className="w-full"
                                        placeholder="My Company"
                                        onChange={handleChange}
                                        disabled={processing}
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="email"
                                        className="text-sm font-medium text-gray-700"
                                    >
                                        Company Email
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="w-full"
                                        placeholder="company@example.com"
                                        onChange={handleChange}
                                        disabled={processing}
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="phone"
                                        className="text-sm font-medium text-gray-700"
                                    >
                                        Phone
                                    </Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        name="phone"
                                        value={data.phone}
                                        className="w-full"
                                        placeholder="+1 (555) 123-4567"
                                        onChange={handleChange}
                                        disabled={processing}
                                    />
                                    <InputError message={errors.phone} />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="address"
                                        className="text-sm font-medium text-gray-700"
                                    >
                                        Company Address
                                    </Label>
                                    <Input
                                        id="address"
                                        type="text"
                                        name="address"
                                        value={data.address}
                                        className="w-full"
                                        placeholder="123 Main St, City, State, ZIP"
                                        onChange={handleChange}
                                        disabled={processing}
                                    />
                                    <InputError message={errors.address} />
                                </div>

                                {/* Sponsor Select */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">
                                        Sponsor Company
                                    </Label>
                                    <Select
                                        value={data.sponsor_id}
                                        onValueChange={(value) =>
                                            setData('sponsor_id', value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select sponsor company" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">
                                                None
                                            </SelectItem>
                                            {companies.map((company) => (
                                                <SelectItem
                                                    key={company.id}
                                                    value={company.id.toString()}
                                                >
                                                    {company.name ||
                                                        `Company #${company.id}`}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.sponsor_id} />
                                </div>

                                {/* Coach Select */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">
                                        Coach
                                    </Label>
                                    <Select
                                        value={data.coach_id}
                                        onValueChange={(value) =>
                                            setData('coach_id', value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select coach" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">
                                                None
                                            </SelectItem>
                                            {users.map((user) => (
                                                <SelectItem
                                                    key={user.id}
                                                    value={user.id.toString()}
                                                >
                                                    {user.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.coach_id} />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">
                                        Company Logo
                                    </Label>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <Input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={handleLogoChange}
                                                disabled={processing}
                                                className="hidden"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    fileInputRef.current?.click()
                                                }
                                                disabled={processing}
                                                className="flex-1"
                                            >
                                                <Upload className="mr-2 h-4 w-4" />
                                                Choose Logo
                                            </Button>
                                            {previewUrl && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={removeLogo}
                                                    disabled={processing}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>

                                        {previewUrl && (
                                            <div className="mt-2">
                                                <div className="relative h-24 w-24 overflow-hidden rounded-lg border">
                                                    <img
                                                        src={previewUrl}
                                                        alt="Logo preview"
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <InputError message={errors.logo} />
                                    <p className="text-xs text-gray-500">
                                        Supports: JPEG, PNG, GIF, WebP. Max 5MB
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Company Owners */}
                    <div className="rounded-lg border border-gray-200 bg-white p-6">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
                                    <User className="h-4 w-4 text-purple-600" />
                                </div>
                                Company Owners
                            </h2>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addOwner}
                                disabled={processing}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Add Owner
                            </Button>
                        </div>

                        {data.owners.length === 0 ? (
                            <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                                <User className="mx-auto h-12 w-12 text-gray-400" />
                                <p className="mt-2 text-sm font-medium text-gray-900">
                                    No owners added
                                </p>
                                <p className="mt-1 text-sm text-gray-500">
                                    Add at least one company owner
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {data.owners.map((owner, index) => (
                                    <div
                                        key={index}
                                        className="rounded-lg border border-gray-200 p-5"
                                    >
                                        <div className="mb-4 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                                                    <User className="h-5 w-5 text-gray-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-gray-900">
                                                        Owner #{index + 1}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">
                                                        {owner.name ||
                                                            'Unnamed owner'}
                                                    </p>
                                                </div>
                                            </div>
                                            {data.owners.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        removeOwner(index)
                                                    }
                                                    disabled={processing}
                                                    className="text-gray-500 hover:text-red-600"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>

                                        <div className="grid gap-5">
                                            {/* First Row: Name, Email, Phone */}
                                            <div className="grid gap-4 md:grid-cols-3">
                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor={`owner-name-${index}`}
                                                        className="text-sm font-medium text-gray-700"
                                                    >
                                                        Full Name *
                                                    </Label>
                                                    <div className="relative">
                                                        <User className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                                        <Input
                                                            id={`owner-name-${index}`}
                                                            type="text"
                                                            value={owner.name}
                                                            required
                                                            className="pl-10"
                                                            placeholder="John Doe"
                                                            onChange={(e) =>
                                                                handleOwnerChange(
                                                                    index,
                                                                    'name',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            disabled={
                                                                processing
                                                            }
                                                        />
                                                    </div>
                                                    <InputError
                                                        message={
                                                            errors[
                                                                `owners.${index}.name`
                                                                ]
                                                        }
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor={`owner-email-${index}`}
                                                        className="text-sm font-medium text-gray-700"
                                                    >
                                                        Email Address *
                                                    </Label>
                                                    <div className="relative">
                                                        <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                                        <Input
                                                            id={`owner-email-${index}`}
                                                            type="email"
                                                            value={owner.email}
                                                            required
                                                            className="pl-10"
                                                            placeholder="owner@example.com"
                                                            onChange={(e) =>
                                                                handleOwnerChange(
                                                                    index,
                                                                    'email',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            disabled={
                                                                processing
                                                            }
                                                        />
                                                    </div>
                                                    <InputError
                                                        message={
                                                            errors[
                                                                `owners.${index}.email`
                                                                ]
                                                        }
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor={`owner-phone-${index}`}
                                                        className="text-sm font-medium text-gray-700"
                                                    >
                                                        Phone *
                                                    </Label>
                                                    <div className="relative">
                                                        <Phone className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                                        <Input
                                                            id={`owner-phone-${index}`}
                                                            type="tel"
                                                            value={owner.phone}
                                                            required
                                                            className="pl-10"
                                                            placeholder="+1 (555) 123-4567"
                                                            onChange={(e) =>
                                                                handleOwnerChange(
                                                                    index,
                                                                    'phone',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            disabled={
                                                                processing
                                                            }
                                                        />
                                                    </div>
                                                    <InputError
                                                        message={
                                                            errors[
                                                                `owners.${index}.phone`
                                                                ]
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            {/* Second Row: Facebook, Birthdate, Address */}
                                            <div className="grid gap-4 md:grid-cols-3">
                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor={`owner-facebook-${index}`}
                                                        className="text-sm font-medium text-gray-700"
                                                    >
                                                        Facebook Profile
                                                    </Label>
                                                    <div className="relative">
                                                        <LinkIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                                        <Input
                                                            id={`owner-facebook-${index}`}
                                                            type="url"
                                                            value={
                                                                owner.facebook
                                                            }
                                                            className="pl-10"
                                                            placeholder="https://facebook.com/username"
                                                            onChange={(e) =>
                                                                handleOwnerChange(
                                                                    index,
                                                                    'facebook',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            disabled={
                                                                processing
                                                            }
                                                        />
                                                    </div>
                                                    <InputError
                                                        message={
                                                            errors[
                                                                `owners.${index}.facebook`
                                                                ]
                                                        }
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor={`owner-birthdate-${index}`}
                                                        className="text-sm font-medium text-gray-700"
                                                    >
                                                        Birth Date
                                                    </Label>
                                                    <div className="relative">
                                                        <CalendarIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                                        <Input
                                                            id={`owner-birthdate-${index}`}
                                                            type="date"
                                                            value={
                                                                owner.birthdate
                                                            }
                                                            className="pl-10"
                                                            onChange={(e) =>
                                                                handleOwnerChange(
                                                                    index,
                                                                    'birthdate',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            disabled={
                                                                processing
                                                            }
                                                        />
                                                    </div>
                                                    <InputError
                                                        message={
                                                            errors[
                                                                `owners.${index}.birthdate`
                                                                ]
                                                        }
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor={`owner-address-${index}`}
                                                        className="text-sm font-medium text-gray-700"
                                                    >
                                                        Address
                                                    </Label>
                                                    <div className="relative">
                                                        <MapPin className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                                        <Input
                                                            id={`owner-address-${index}`}
                                                            type="text"
                                                            value={
                                                                owner.address
                                                            }
                                                            className="pl-10"
                                                            placeholder="Owner's address"
                                                            onChange={(e) =>
                                                                handleOwnerChange(
                                                                    index,
                                                                    'address',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            disabled={
                                                                processing
                                                            }
                                                        />
                                                    </div>
                                                    <InputError
                                                        message={
                                                            errors[
                                                                `owners.${index}.address`
                                                                ]
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            {/* Third Row: Profile Photo and ID File */}
                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div className="space-y-3">
                                                    <Label className="text-sm font-medium text-gray-700">
                                                        Profile Photo
                                                    </Label>
                                                    <div className="space-y-3">
                                                        <div className="flex items-center gap-3">
                                                            <Input
                                                                id={`owner-photo-${index}`}
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={(e) =>
                                                                    handleOwnerPhotoChange(
                                                                        index,
                                                                        e,
                                                                    )
                                                                }
                                                                disabled={
                                                                    processing
                                                                }
                                                                className="hidden"
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                onClick={() =>
                                                                    document
                                                                        .getElementById(
                                                                            `owner-photo-${index}`,
                                                                        )
                                                                        ?.click()
                                                                }
                                                                disabled={
                                                                    processing
                                                                }
                                                                className="flex-1"
                                                            >
                                                                <Camera className="mr-2 h-4 w-4" />
                                                                Choose Photo
                                                            </Button>
                                                            {ownerPreviewUrls[
                                                                index
                                                                ] && (
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        removeOwnerPhoto(
                                                                            index,
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        processing
                                                                    }
                                                                >
                                                                    <X className="h-4 w-4" />
                                                                </Button>
                                                            )}
                                                        </div>

                                                        {ownerPreviewUrls[
                                                            index
                                                            ] && (
                                                            <div className="mt-2">
                                                                <div className="relative h-20 w-20 overflow-hidden rounded-full border">
                                                                    <img
                                                                        src={
                                                                            ownerPreviewUrls[
                                                                                index
                                                                                ]
                                                                        }
                                                                        alt="Owner preview"
                                                                        className="h-full w-full object-cover"
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-500">
                                                        Optional. Max 5MB (JPEG,
                                                        PNG, GIF, WebP)
                                                    </p>
                                                </div>

                                                <div className="space-y-3">
                                                    <Label className="text-sm font-medium text-gray-700">
                                                        ID Document *
                                                    </Label>
                                                    <div className="space-y-3">
                                                        <div className="flex items-center gap-3">
                                                            <Input
                                                                id={`owner-id-file-${index}`}
                                                                type="file"
                                                                accept="image/*,.pdf"
                                                                onChange={(e) =>
                                                                    handleIdFileChange(
                                                                        index,
                                                                        e,
                                                                    )
                                                                }
                                                                disabled={
                                                                    processing
                                                                }
                                                                className="hidden"
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                onClick={() =>
                                                                    document
                                                                        .getElementById(
                                                                            `owner-id-file-${index}`,
                                                                        )
                                                                        ?.click()
                                                                }
                                                                disabled={
                                                                    processing
                                                                }
                                                                className="flex-1"
                                                            >
                                                                <FileText className="mr-2 h-4 w-4" />
                                                                Upload ID
                                                            </Button>
                                                            {idFileNames[
                                                                index
                                                                ] && (
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        removeIdFile(
                                                                            index,
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        processing
                                                                    }
                                                                >
                                                                    <X className="h-4 w-4" />
                                                                </Button>
                                                            )}
                                                        </div>

                                                        {idFileNames[index] && (
                                                            <div className="mt-2 flex items-center gap-2 rounded border bg-gray-50 px-3 py-2">
                                                                <FileText className="h-4 w-4 text-gray-500" />
                                                                <span className="text-sm text-gray-700">
                                                                    {
                                                                        idFileNames[
                                                                            index
                                                                            ]
                                                                    }
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-500">
                                                        Required. Max 10MB
                                                        (JPEG, PNG, PDF)
                                                    </p>
                                                    <InputError
                                                        message={
                                                            errors[
                                                                `owners.${index}.id_file`
                                                                ]
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Form Actions */}
                    <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleReset}
                            disabled={processing}
                        >
                            Reset
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="min-w-[120px]"
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                'Create Company'
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
