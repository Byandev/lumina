import { Head, useForm } from '@inertiajs/react';
import React, { FormEvent } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Company } from '@/types/models/Company';
import ComponentCard from '@/components/component-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import CompanyOwnerCard from '@/components/companies/company-owner-card';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
    company: Company
}

const Show = ({ company }: Props) => {
    const { post } = useForm();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        post(`/companies/${company.id}/verify`)
    }

    return (
        <AppLayout breadcrumbs={[]}>
            <Head title="Companies" />

            <div className="min-h-screen p-4 sm:p-8">
                <div className="flex items-center justify-between pb-6">
                    <p className="my-0 text-3xl font-semibold text-foreground">
                        {company.name}
                    </p>

                    <form onSubmit={handleSubmit}>
                        <Button type="submit" className="cursor-pointer">
                            Mark as Verified
                        </Button>
                    </form>
                </div>

                <div className="space-y-6">
                    <ComponentCard desc={'Company Information'}>
                        <div>
                            <div className="flex flex-col items-center gap-x-2 md:flex-row">
                                <Avatar className="size-20">
                                    <AvatarImage
                                        src={company.company_logo?.original_url}
                                        alt="@shadcn"
                                    />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>

                                <p className="text-xl font-bold md:text-2xl">
                                    {company.name}
                                </p>
                            </div>

                            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="flex flex-col gap-2">
                                    <Label className="text-sm font-medium">
                                        Email
                                    </Label>
                                    <Label className="font-normal text-gray-800">
                                        {company.email}
                                    </Label>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label className="text-sm font-medium">
                                        Phone Number
                                    </Label>
                                    <Label className="font-normal text-gray-800">
                                        {company.phone}
                                    </Label>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label className="text-sm font-medium">
                                        Address
                                    </Label>
                                    <Label className="font-normal text-gray-800">
                                        {company.address}
                                    </Label>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label className="text-sm font-medium">
                                        Sponsor Company
                                    </Label>
                                    <Label className="font-normal text-gray-800">
                                        {company.sponsor?.name}
                                    </Label>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label className="text-sm font-medium">
                                        Proof of Payment
                                    </Label>

                                    <Label className="font-medium text-gray-800">
                                        <a
                                            target={'_blank'}
                                            href={
                                                company.proof_of_payment
                                                    ?.original_url
                                            }
                                            className="flex items-center gap-x-2 text-blue-700"
                                        >
                                            <Download className="size-5" />{' '}
                                            Download
                                        </a>
                                    </Label>
                                </div>
                            </div>
                        </div>
                    </ComponentCard>

                    <ComponentCard desc={'Company Owners'}>
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-2">
                            {(company.owners ?? [])?.map((owner) => (
                                <CompanyOwnerCard
                                    key={owner.id}
                                    owner={owner}
                                />
                            ))}
                        </div>
                    </ComponentCard>
                </div>
            </div>
        </AppLayout>
    );
}

export default Show;
