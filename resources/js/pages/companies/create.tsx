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


interface Props {
    companies: Company[];
    coaches: User[];
}

const Create = ({ coaches, companies: sponsorCompanies }: Props) => {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Companies', href: '/companies' },
        { title: 'Create', href: '/companies/create' },
    ];

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
        console.log(data)
        post('/companies'); // change to route if needed
    };

    const addNewOwner = () => {
        setData('owners', [...data.owners, { name: '', email: '', phone: '', address: '', facebook: '', birthdate: '', profile_picture: null }])
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="px-4 sm:px-8 pb-8">
                <div className="my-4 sm:my-8">
                    <p className="font-semibold text-foreground text-3xl my-0">Create Company</p>
                </div>

                <form onSubmit={submit}>
                    <div className="space-y-6">
                        <ComponentCard title="Company Information" desc="Provide information about the company">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <Label className="text-sm font-medium">Name</Label>
                                    <Input
                                        id="name"
                                        type='file'
                                        onChange={(e) => {
                                            if (e.target.files?.length) {
                                                setData('logo', e.target.files[0])
                                            }
                                        }}
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label className="text-sm font-medium">Name</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        placeholder="Company Name"
                                        onChange={(e) => setData('name', e.target.value)}
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label className="text-sm font-medium">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email ?? ''}
                                        placeholder="Company Email"
                                        onChange={(e) => setData('email', e.target.value)}
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label className="text-sm font-medium">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        value={data.phone ?? ''}
                                        placeholder="Company Phone"
                                        onChange={(e) => setData('phone', e.target.value)}
                                    />
                                    <InputError message={errors.phone} />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label className="text-sm font-medium">Address</Label>
                                    <Input
                                        id="address"
                                        value={data.address ?? ''}
                                        placeholder="Company address"
                                        onChange={(e) => setData('address', e.target.value)}
                                    />
                                    <InputError message={errors.address} />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label className="text-sm font-medium">Sponsor Company</Label>
                                    <Select
                                        value={data.sponsor_id}
                                        onValueChange={(v) => setData('sponsor_id', v)}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select sponsor company" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
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

                                <div className="flex flex-col gap-2">
                                    <Label className="text-sm font-medium">Assigned Coach</Label>
                                    <Select value={data.coach_id} onValueChange={(v) => setData('coach_id', v)}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select coach" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
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
                        </ComponentCard>

                        <ComponentCard title="Company Status" desc="Provide information about the company statuses">
                            <div className="grid grid-cols-2 gap-6">
                                <SelectField
                                    label="Status"
                                    value={data.status ?? ''}
                                    onChange={(v) => setData('status', v)}
                                    options={['Active', 'Inactive', 'Terminated']}
                                    error={errors.status}
                                />

                                <SelectField
                                    label="Level"
                                    value={data.level ?? ''}
                                    onChange={(v) => setData('level', v)}
                                    options={['Educated', 'Empowerment', 'Enterprise', 'Exponential']}
                                    error={errors.level}
                                />

                                <SelectField
                                    label="Sales Activity"
                                    value={data.sales_activity ?? ''}
                                    onChange={(v) => setData('sales_activity', v)}
                                    options={['Sales Generating', 'Inactive', 'Testing']}
                                    error={errors.sales_activity}
                                />

                                <SelectField
                                    label="Notarization Status"
                                    value={data.notarization_status ?? ''}
                                    onChange={(v) => setData('notarization_status', v)}
                                    options={['Pending', 'Done']}
                                    error={errors.notarization_status}
                                />

                                <SelectField
                                    label="ERP Status"
                                    value={data.erp_status ?? ''}
                                    onChange={(v) => setData('erp_status', v)}
                                    options={['Active', 'Inactive']}
                                    error={errors.erp_status}
                                />
                            </div>
                        </ComponentCard>

                        <ComponentCard title="Company Owners" desc="Provide information about the company owners">
                            <div className="space-y-4">
                                {
                                    data.owners
                                        .map((owner, i)  => <CompanyOwnerForm key={`owner-form-${i}`} index={i} data={data} setData={setData} errors={errors} />)
                                }
                            </div>

                            <div className="border-2 border-dashed mt-5 p-4 rounded-xl">
                                <p className="text-center font-bold text-gray-800 text-sm cursor-pointer" onClick={addNewOwner}>Add new Owner</p>
                            </div>
                        </ComponentCard>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center rounded-md px-4 py-2 text-sm font-medium bg-primary text-primary-foreground disabled:opacity-50"
                            >
                                {processing ? 'Saving...' : 'Save Company'}
                            </button>
                        </div>
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
        <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium">{props.label}</Label>
            <Select value={props.value} onValueChange={props.onChange}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder={`Select ${props.label.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {props.options.map((opt) => (
                            <SelectItem key={opt} value={opt}>
                                {opt}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
            <InputError message={props.error} />
        </div>
    );
}
