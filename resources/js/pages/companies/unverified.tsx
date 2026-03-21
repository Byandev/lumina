import CompanyOwnersAvatar from '@/components/companies/company-owners-avatar';
import StatusBadge from '@/components/companies/status-badge';
import ComponentCard from '@/components/component-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DataTable, SortableHeader } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { toFrontendSort } from '@/lib/sort';
import { type BreadcrumbItem, PaginatedData } from '@/types';
import { Company } from '@/types/models/Company';
import { Head, Link, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { omit } from 'lodash';
import { Edit, Eye, Mail, Plus, Search } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { useInitials } from '@/hooks/use-initials';
import moment from 'moment';

interface CompaniesProps {
    companies: PaginatedData<Company>;
    search?: string;
    query?: {
        sort?: string | null;
        perPage?: number | string;
        page?: number | string;
        filter?: {
            search?: string;
        };
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Companies',
        href: '/companies'
    },
];

export default function CompaniesIndex({ companies, query }: CompaniesProps) {
    const getInitials = useInitials();

    const [searchValue, setSearchValue] = useState(query?.filter?.search ?? '');

    useEffect(() => {
        const currentSearchParam = query?.filter?.search ?? '';

        if (searchValue === currentSearchParam) {
            return;
        }

        const timer = setTimeout(() => {
            router.get(
                '/companies/unverified',
                {
                    sort: query?.sort,
                    'filter[search]': searchValue || undefined,
                    page: 1,
                },
                {
                    preserveState: true,
                    replace: true,
                    preserveScroll: true,
                },
            );
        }, 500);

        return () => clearTimeout(timer);
    }, [searchValue, query?.filter?.search, query?.sort]);

    const initialSorting = useMemo(() => {
        return toFrontendSort(query?.sort ?? null);
    }, [query?.sort]);

    const columns: ColumnDef<Company>[] = [
        {
            accessorKey: 'name',
            header: ({ column }) => (
                <SortableHeader column={column} title={'Name'} />
            ),
            cell: ({ row }) => {
                const company = row.original;

                return (
                    <div className="flex items-center gap-2 sm:gap-3">
                        <Avatar className="cursor-pointer">
                            {company.company_logo && (
                                <AvatarImage
                                    src={company.company_logo?.original_url}
                                    alt={company.name}
                                />
                            )}
                            <AvatarFallback className="bg-blue-600 text-white">
                                {getInitials(company.name)}
                            </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0">
                            <div className="max-w-[140px] truncate text-sm font-semibold text-gray-900 sm:max-w-[240px]">
                                <Link href={`/companies/unverified/${company.id}`} className={"hover:underline"}>{company.name}</Link>
                            </div>
                            {company.email && (
                                <div className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                                    <Mail className="h-3 w-3 flex-shrink-0 text-gray-400 sm:h-3.5 sm:w-3.5" />
                                    <span className="max-w-[120px] truncate sm:max-w-[260px]">
                                        {company.email}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: 'owners_count',
            header: ({ column }) => (
                <SortableHeader column={column} title={'Owners'} />
            ),
            cell: ({ row }) => <CompanyOwnersAvatar company={row.original} />,
        },
        {
            accessorKey: 'created_at',
            header: ({ column }) => (
                <SortableHeader column={column} title={'Submitted At'} />
            ),
            cell: ({ row }) => moment(row.original.created_at).format('YYYY-MM-DD')
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Companies" />

            <div className="bg-white/70 py-6 md:px-6 lg:px-8">
                <div className="flex justify-between">
                    <p className="flex flex-col text-xl font-semibold text-foreground">
                        Unverified Companies
                        <span className="my-0 pb-6 text-sm font-medium text-gray-500">
                            Check the status of new companies and verify their
                            information before approval.
                        </span>
                    </p>
                    <div className="mb-6 flex items-center gap-x-2">
                        <form className="relative w-full sm:w-64">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Search className="z-10 h-4 w-4 text-gray-400" />
                            </div>

                            <Input
                                type="text"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                placeholder="Search companies..."
                                className="h-9 pl-8 text-sm"
                            />
                        </form>

                        <Link
                            href="/companies/create"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-violet-400 px-4 py-2 text-sm font-semibold text-white transition hover:scale-105"
                        >
                            <Plus className="h-4 w-4" />
                            <span className="hidden sm:block">Add Company</span>
                        </Link>
                    </div>
                </div>

                <DataTable
                    columns={columns}
                    enableInternalPagination={false}
                    data={companies.data || []}
                    initialSorting={initialSorting}
                    meta={{ ...omit(companies, ['data']) }}
                    onFetch={(params) => {
                        router.get(
                            '/companies/unverified',
                            {
                                sort: params?.sort,
                                'filter[search]': searchValue || undefined,
                                page: params?.page ?? 1,
                            },
                            {
                                preserveState: false,
                                replace: true,
                                preserveScroll: true,
                            },
                        );
                    }}
                />
            </div>
        </AppLayout>
    );
}
