import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, User } from '@/types';
import {companies} from '@/routes';
import ComponentCard from '@/components/component-card';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import React from 'react';
import { Company } from '@/types/models/Company';
import { Select, SelectLabel, SelectGroup, SelectContent, SelectTrigger, SelectItem, SelectValue} from '@/components/ui/select';

interface Props {
    companies: Company[]
    coaches: User[]
}

const Create = ({ coaches, companies: sponsorCompanies }: Props) => {
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

    const { data, errors, setData } = useForm({
        name: '',
        email: '',
        phone: '',
        address: '',
        sponsor_id: '',
        coach_id: ''
    })

    return <AppLayout breadcrumbs={breadcrumbs}>
        <div className="px-4 sm:px-8 pb-8">
            <div className="my-4 sm:my-8">
                <p className="font-semibold text-foreground text-3xl my-0">
                    Create Company
                </p>
            </div>

            <form>
                <div className="space-y-6">
                    <ComponentCard desc={'Company Information'}>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <Label className="text-sm font-medium">Name</Label>

                                <Input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={data.name}
                                    required
                                    autoFocus
                                    className="w-full"
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
                                    name="name"
                                    value={data.email}
                                    required
                                    autoFocus
                                    className="w-full"
                                    placeholder="Company Email"
                                    onChange={(e) => setData('email', e.target.value)}
                                />

                                <InputError message={errors.email} />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label className="text-sm font-medium">Phone Number</Label>

                                <Input
                                    id="phone"
                                    name="phone"
                                    value={data.phone}
                                    required
                                    autoFocus
                                    className="w-full"
                                    placeholder="Company Phone"
                                    onChange={(e) => setData('phone', e.target.value)}
                                />

                                <InputError message={errors.phone} />
                            </div>


                            <div className="flex flex-col gap-2">
                                <Label className="text-sm font-medium">Address</Label>

                                <Input
                                    id="address"
                                    name="address"
                                    value={data.address}
                                    required
                                    autoFocus
                                    className="w-full"
                                    placeholder="Company address"
                                    onChange={(e) => setData('address', e.target.value)}
                                />

                                <InputError message={errors.address} />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label className="text-sm font-medium">Sponsor Company</Label>

                                <Select>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select sponsor company" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {sponsorCompanies.map(company => <SelectItem key={`company-${company.id}`} value={company.id.toString()}>{company.name}</SelectItem>)}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label className="text-sm font-medium">Assigned Coach</Label>

                                <Select>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select coach" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {coaches.map(coach => <SelectItem key={`coach-${coach.id}`} value={coach.id.toString()}>{coach.name}</SelectItem>)}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                        </div>
                    </ComponentCard>

                    <ComponentCard desc={'Company Status'}>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <Label className="text-sm font-medium">Status</Label>

                                <Select>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {['Active', 'Inactive', 'Terminated'].map(status => <SelectItem key={`status-${status}`} value={status}>{status}</SelectItem>)}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label className="text-sm font-medium">Level</Label>

                                <Select>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {['Educated', 'Empowerment', 'Enterprise', 'Exponential'].map(level => <SelectItem key={`level-${level}`} value={level}>{level}</SelectItem>)}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label className="text-sm font-medium">Sales Activity</Label>

                                <Select>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select sales activity" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {['Sales Generating', 'Inactive', 'Testing'].map(option => <SelectItem key={`sales-${option}`} value={option}>{option}</SelectItem>)}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label className="text-sm font-medium">Notarization Status</Label>

                                <Select>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {['Pending', 'Done'].map(option => <SelectItem key={`ns-${option}`} value={option}>{option}</SelectItem>)}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label className="text-sm font-medium">ERP Status</Label>

                                <Select>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {['Active', 'Inactive'].map(erp => <SelectItem key={`erp-${erp}`} value={erp}>{erp}</SelectItem>)}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </ComponentCard>
                </div>
            </form>
        </div>
    </AppLayout>
}

export default Create;
