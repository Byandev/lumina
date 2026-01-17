import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, User } from '@/types';
import ComponentCard from '@/components/component-card';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
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


interface Props {
    company: Company;
    companies: Company[];
    coaches: User[];
}

const Edit = ({ company, coaches, companies: sponsorCompanies }: Props) => {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Companies', href: '/companies' },
        { title: 'Edit', href: '/companies/create' },
    ];
    const [logoUrl, setLogoUrl] = React.useState<string | null>(company.company_logo?.original_url ?? null);

    // @ts-ignore
    const { data, errors, setData, put, processing } = useForm<CompanyForm>({
        name: company.name,
        email: company.email,
        phone: company.phone,
        address: company.address,
        sponsor_id: company.sponsor_id?.toString() ?? '',
        coach_id: company.coach_id?.toString() ?? '',
        status: company.status,
        level: company.level,
        sales_activity: company.sales_activity,
        notarization_status: company.notarization_status,
        erp_status: company.erp_status,
        logo: company.company_logo,
        new_logo: null,
        owners: (company.owners ?? []).map((owner) => ({
            id: owner.id,
            name: owner.name,
            email: owner.email,
            phone: owner.phone,
            address: owner.address,
            facebook: owner.facebook,
            birthdate: owner.birthdate,
            profile_picture: owner.profile_picture,
            new_profile_picture: null
        }))
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/companies/' + company.id, {
            preserveState: false
        });
    };

    const addNewOwner = () => {
        setData('owners', [...data.owners, { name: '', email: '', phone: '', address: '', facebook: '', birthdate: '', profile_picture: null, new_profile_picture: null }])
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="px-4 pb-8 sm:px-8">
                <div className="my-4 sm:my-8">
                    <p className="my-0 text-3xl font-semibold text-foreground">
                        Edit {company.name}
                    </p>
                </div>

                <form onSubmit={submit}>
                    <div className="space-y-6">
                        <ComponentCard
                            title="Company Information"
                            desc="Provide information about the company"
                        >
                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-2 flex flex-col gap-2">
                                    <Label className="text-sm font-medium">
                                        Company Logo
                                    </Label>
                                    <AvatarEditor
                                        fallbackText="CL"
                                        value={{ url: logoUrl }}
                                        onChange={(result) => {
                                            if (!result) {
                                                setLogoUrl(null);
                                                setData('new_logo', null);
                                                return;
                                            }

                                            setLogoUrl(result.previewUrl);
                                            setData('new_logo', result.file);
                                        }}
                                        maxFileMB={5}
                                    />

                                    <InputError message={errors.logo} />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label className="text-sm font-medium">
                                        Name
                                    </Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        placeholder="Company Name"
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label className="text-sm font-medium">
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email ?? ''}
                                        placeholder="Company Email"
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label className="text-sm font-medium">
                                        Phone Number
                                    </Label>
                                    <Input
                                        id="phone"
                                        value={data.phone ?? ''}
                                        placeholder="Company Phone"
                                        onChange={(e) =>
                                            setData('phone', e.target.value)
                                        }
                                    />
                                    <InputError message={errors.phone} />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label className="text-sm font-medium">
                                        Address
                                    </Label>
                                    <Input
                                        id="address"
                                        value={data.address ?? ''}
                                        placeholder="Company address"
                                        onChange={(e) =>
                                            setData('address', e.target.value)
                                        }
                                    />
                                    <InputError message={errors.address} />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label className="text-sm font-medium">
                                        Sponsor Company
                                    </Label>
                                    <Select
                                        value={
                                            (data.sponsor_id ??
                                                'none') as string
                                        }
                                        onValueChange={(v) =>
                                            setData(
                                                'sponsor_id',
                                                v === 'none' ? null : v,
                                            )
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select sponsor company" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="none">
                                                    No Sponsor
                                                </SelectItem>
                                                {sponsorCompanies.map((c) => (
                                                    <SelectItem
                                                        key={c.id}
                                                        value={String(c.id)}
                                                    >
                                                        {c.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.sponsor_id} />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label className="text-sm font-medium">
                                        Assigned Coach
                                    </Label>
                                    <Select
                                        value={
                                            (data.coach_id ?? 'none') as string
                                        }
                                        onValueChange={(v) =>
                                            setData(
                                                'coach_id',
                                                v === 'none' ? null : v,
                                            )
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select coach" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="none">
                                                    Unassigned
                                                </SelectItem>
                                                {coaches.map((coach) => (
                                                    <SelectItem
                                                        key={coach.id}
                                                        value={String(coach.id)}
                                                    >
                                                        {coach.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.coach_id} />
                                </div>
                            </div>
                        </ComponentCard>

                        <ComponentCard
                            title="Company Status"
                            desc="Provide information about the company statuses"
                        >
                            <div className="grid grid-cols-2 gap-6">
                                <SelectField
                                    label="Status"
                                    value={data.status ?? ''}
                                    onChange={(v) => setData('status', v)}
                                    options={[
                                        'active',
                                        'inactive',
                                        'terminated',
                                    ]}
                                    error={errors.status}
                                />

                                <SelectField
                                    label="Level"
                                    value={data.level ?? ''}
                                    onChange={(v) => setData('level', v)}
                                    options={[
                                        'educate',
                                        'empowerment',
                                        'enterprise',
                                        'exponential',
                                    ]}
                                    error={errors.level}
                                />

                                <SelectField
                                    label="Sales Activity"
                                    value={data.sales_activity ?? ''}
                                    onChange={(v) =>
                                        setData('sales_activity', v)
                                    }
                                    options={[
                                        'generating',
                                        'inactive',
                                        'testing',
                                    ]}
                                    error={errors.sales_activity}
                                />

                                <SelectField
                                    label="Notarization Status"
                                    value={data.notarization_status ?? ''}
                                    onChange={(v) =>
                                        setData('notarization_status', v)
                                    }
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
                        </ComponentCard>

                        <ComponentCard
                            title="Company Owners"
                            desc="Provide information about the company owners"
                        >
                            <div className="space-y-4">
                                {data.owners.map((owner, i) => (
                                    <CompanyOwnerForm
                                        isEditing={true}
                                        key={`owner-form-${i}`}
                                        index={i}
                                        data={data}
                                        setData={setData}
                                        errors={errors}
                                    />
                                ))}
                            </div>

                            <div className="mt-5 rounded-xl border-2 border-dashed p-4">
                                <p
                                    className="cursor-pointer text-center text-sm font-bold text-gray-800"
                                    onClick={addNewOwner}
                                >
                                    Add new Owner
                                </p>
                            </div>
                        </ComponentCard>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
                            >
                                {processing ? 'Updating...' : 'Update Company'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
};

export default Edit;

function SelectField(props: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    options: string[];
    error?: string;
}) {
    return (
        <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium">{props.label}</Label>
            <Select value={props.value.toLowerCase()} onValueChange={props.onChange}>
                <SelectTrigger className="w-full">
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
