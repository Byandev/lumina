import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, User } from '@/types';
import ComponentCard from '@/components/component-card';
import { Label } from '@/components/ui/label';
import { useForm, Link } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import React from 'react';
import { Company, CompanyForm } from '@/types/models/Company';
import {
    Select,
    SelectGroup,
    SelectContent,
    SelectTrigger,
    SelectItem,
    SelectValue,
} from '@/components/ui/select';
import CompanyOwnerForm from '@/components/companies/company-owner-form';
import { AvatarEditor } from '@/components/ui/avatar-editor';
import { startCase } from 'lodash';
import { Building2, Mail, Phone, MapPin, Users, Briefcase, ArrowLeft, Save, UserPlus } from 'lucide-react';

interface Props {
    companies: Company[];
    coaches: User[];
}

const Create = ({ coaches, companies: sponsorCompanies }: Props) => {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Companies', href: '/companies' },
        { title: 'Create', href: '/companies/create' },
    ];

    const [logoUrl, setLogoUrl] = React.useState<string | null>(null);
    const { data, errors, setData, post, processing } = useForm<CompanyForm>({
        name: '',
        email: null,
        phone: null,
        address: null,
        sponsor_id: '',
        coach_id: '',
        status: '',
        level: '',
        sales_activity: '',
        notarization_status: '',
        erp_status: '',
        logo: null,
        owners: [
            {
                name: '',
                email: '',
                phone: '',
                address: '',
                facebook: '',
                birthdate: '',
                profile_picture: null
            }
        ],
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/companies');
    };

    const addNewOwner = () => {
        setData('owners', [...data.owners, {
            name: '',
            email: '',
            phone: '',
            address: '',
            facebook: '',
            birthdate: '',
            profile_picture: null,
            new_profile_picture: null
        }]);
    };

    const removeOwner = (index: number) => {
        if (data.owners.length > 1) {
            const newOwners = [...data.owners];
            newOwners.splice(index, 1);
            setData('owners', newOwners);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="bg-white px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center space-x-3">
                                <Link
                                    href="/companies"
                                    className="p-2 hover:bg-gray-100 transition-colors duration-200"
                                >
                                    <ArrowLeft className="h-5 w-5 text-gray-600" />
                                </Link>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        Create Company
                                    </h1>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Add a new company to the system
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-8">
                    {/* Company Information Card */}
                    <div className="bg-white border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <div className="flex items-center space-x-2">
                                <Building2 className="h-5 w-5 text-pink-500" />
                                <h2 className="text-lg font-semibold text-gray-900">Company Information</h2>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="col-span-2 space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">
                                        Company Logo
                                    </Label>
                                    <AvatarEditor
                                        fallbackText="CL"
                                        value={{ url: logoUrl }}
                                        onChange={(result) => {
                                            if (!result) {
                                                setLogoUrl(null);
                                                setData('logo', null);
                                                return;
                                            }
                                            setLogoUrl(result.previewUrl);
                                            setData('logo', result.file);
                                        }}
                                        maxFileMB={5}
                                    />
                                    <InputError message={errors.logo} />
                                    <p className="text-xs text-gray-500">
                                        Upload company logo (Max: 5MB)
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">
                                        Name <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        placeholder="Company Name"
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full border-gray-300 focus:border-pink-500 focus:ring-0"
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">
                                        <div className="flex items-center space-x-1">
                                            <Mail className="h-4 w-4" />
                                            <span>Email</span>
                                        </div>
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email ?? ''}
                                        placeholder="company@example.com"
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full border-gray-300 focus:border-pink-500 focus:ring-0"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">
                                        <div className="flex items-center space-x-1">
                                            <Phone className="h-4 w-4" />
                                            <span>Phone Number</span>
                                        </div>
                                    </Label>
                                    <Input
                                        id="phone"
                                        value={data.phone ?? ''}
                                        placeholder="+1 234 567 8900"
                                        onChange={(e) => setData('phone', e.target.value)}
                                        className="w-full border-gray-300 focus:border-pink-500 focus:ring-0"
                                    />
                                    <InputError message={errors.phone} />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">
                                        <div className="flex items-center space-x-1">
                                            <MapPin className="h-4 w-4" />
                                            <span>Address</span>
                                        </div>
                                    </Label>
                                    <Input
                                        id="address"
                                        value={data.address ?? ''}
                                        placeholder="Company address"
                                        onChange={(e) => setData('address', e.target.value)}
                                        className="w-full border-gray-300 focus:border-pink-500 focus:ring-0"
                                    />
                                    <InputError message={errors.address} />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">
                                        Sponsor Company
                                    </Label>
                                    <Select
                                        value={(data.sponsor_id ?? 'none') as string}
                                        onValueChange={(v) => setData('sponsor_id', v === 'none' ? null : v)}
                                    >
                                        <SelectTrigger className="w-full border-gray-300 focus:border-pink-500 focus:ring-0">
                                            <SelectValue placeholder="Select sponsor company" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="none">No Sponsor</SelectItem>
                                                {sponsorCompanies.map((c) => (
                                                    <SelectItem key={c.id} value={String(c.id)}>
                                                        {c.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.sponsor_id} />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">
                                        <div className="flex items-center space-x-1">
                                            <Users className="h-4 w-4" />
                                            <span>Assigned Coach</span>
                                        </div>
                                    </Label>
                                    <Select
                                        value={(data.coach_id ?? 'none') as string}
                                        onValueChange={(v) => setData('coach_id', v === 'none' ? null : v)}
                                    >
                                        <SelectTrigger className="w-full border-gray-300 focus:border-pink-500 focus:ring-0">
                                            <SelectValue placeholder="Select coach" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="none">Unassigned</SelectItem>
                                                {coaches.map((coach) => (
                                                    <SelectItem key={coach.id} value={String(coach.id)}>
                                                        {coach.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.coach_id} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Company Status Card */}
                    <div className="bg-white border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <div className="flex items-center space-x-2">
                                <Briefcase className="h-5 w-5 text-pink-500" />
                                <h2 className="text-lg font-semibold text-gray-900">Company Status</h2>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <SelectField
                                    label="Status"
                                    value={data.status ?? ''}
                                    onChange={(v) => setData('status', v)}
                                    options={['active', 'inactive', 'terminated']}
                                    error={errors.status}
                                />

                                <SelectField
                                    label="Level"
                                    value={data.level ?? ''}
                                    onChange={(v) => setData('level', v)}
                                    options={['educate', 'empowerment', 'enterprise', 'exponential']}
                                    error={errors.level}
                                />

                                <SelectField
                                    label="Sales Activity"
                                    value={data.sales_activity ?? ''}
                                    onChange={(v) => setData('sales_activity', v)}
                                    options={['generating', 'inactive', 'testing']}
                                    error={errors.sales_activity}
                                />

                                <SelectField
                                    label="Notarization Status"
                                    value={data.notarization_status ?? ''}
                                    onChange={(v) => setData('notarization_status', v)}
                                    options={['pending', 'done']}
                                    error={errors.notarization_status}
                                />

                                <SelectField
                                    label="ERP Status"
                                    value={data.erp_status ?? ''}
                                    onChange={(v) => setData('erp_status', v)}
                                    options={['active', 'inactive']}
                                    error={errors.erp_status}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Company Owners Card */}
                    <div className="bg-white border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <div className="flex items-center space-x-2">
                                <Users className="h-5 w-5 text-pink-500" />
                                <h2 className="text-lg font-semibold text-gray-900">Company Owners</h2>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="space-y-6">
                                {data.owners.map((owner, i) => (
                                    <div key={`owner-form-${i}`} className="relative">
                                        <CompanyOwnerForm
                                            index={i}
                                            data={data}
                                            setData={setData}
                                            errors={errors}
                                        />
                                        {data.owners.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeOwner(i)}
                                                className="absolute top-0 right-0 text-red-600 hover:text-red-700 text-sm"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={addNewOwner}
                                className="mt-6 w-full border-2 border-dashed border-gray-300 bg-gray-50 p-4 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center space-x-2"
                            >
                                <UserPlus className="h-5 w-5 text-gray-600" />
                                <span className="text-sm font-medium text-gray-700">Add New Owner</span>
                            </button>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                        <Link
                            href="/companies"
                            className="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save className="h-4 w-4" />
                            <span>{processing ? 'Saving...' : 'Save Company'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
};

export default Create;

function SelectField(props: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    options: string[];
    error?: string;
}) {
    return (
        <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">{props.label}</Label>
            <Select
                value={props.value.toLowerCase()}
                onValueChange={props.onChange}
            >
                <SelectTrigger className="w-full border-gray-300 focus:border-pink-500 focus:ring-0">
                    <SelectValue placeholder={`Select ${props.label.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {props.options.map((opt) => (
                            <SelectItem key={opt} value={opt.toLowerCase()}>
                                {startCase(opt)}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
            <InputError message={props.error} />
        </div>
    );
}
