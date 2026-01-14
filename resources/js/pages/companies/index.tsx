import CompanyOwnersAvatar from '@/components/companies/company-owners-avatar';
import StatusBadge from '@/components/companies/status-badge';
import ComponentCard from '@/components/component-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import CircularProgress from '@/components/ui/circular-progress';
import { DataTable, SortableHeader } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { percentageFormatter } from '@/lib/formatter';
import { toFrontendSort } from '@/lib/sort';
import { type BreadcrumbItem, PaginatedData } from '@/types';
import { Company } from '@/types/models/Company';
import { Head, Link, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { omit } from 'lodash';
import { Edit, Eye, Mail, Plus, Search, Trash2 } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { useInitials } from '@/hooks/use-initials';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

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
                '/companies',
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
                        <Avatar className='cursor-pointer'>
                            {company.company_logo &&
                                <AvatarImage
                                    src={company.company_logo?.original_url}
                                    alt={company.name}
                                />
                            }
                            <AvatarFallback className='bg-blue-600 text-white'>
                                {getInitials(company.name)}
                            </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0">
                            <div className="max-w-[140px] truncate text-sm font-semibold text-gray-900 sm:max-w-[240px]">
                                {company.name}
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
            accessorKey: 'onboarding_percentage',
            header: ({ column }) => (
                <SortableHeader column={column} title={'Onboarding'} />
            ),
            cell: ({ row }) => {
                return (
                    <div className="flex items-center gap-x-2">
                        <CircularProgress
                            percentage={
                                (row.original.onboarding_percentage ?? 0) * 100
                            }
                            size={20}
                        />

                        <span>
                            {percentageFormatter(
                                row.original.onboarding_percentage ?? 0,
                            )}
                        </span>
                    </div>
                );
            },
        },
        {
            accessorKey: 'notarization_status',
            header: ({ column }) => (
                <SortableHeader column={column} title={'Notarization'} />
            ),
            cell: ({ row }) => (
                <StatusBadge
                    status={row.original.notarization_status as string}
                />
            ),
        },
        {
            accessorKey: 'erp_status',
            header: ({ column }) => (
                <SortableHeader column={column} title={'ERP'} />
            ),
            cell: ({ row }) => (
                <StatusBadge status={row.original.erp_status as string} />
            ),
        },
        {
            accessorKey: 'sales_activity',
            header: ({ column }) => (
                <SortableHeader column={column} title={'Sales'} />
            ),
            cell: ({ row }) => (
                <StatusBadge status={row.original.sales_activity as string} />
            ),
        },
        {
            accessorKey: 'level',
            header: ({ column }) => (
                <SortableHeader column={column} title={'Level'} />
            ),
            cell: ({ row }) => (
                <StatusBadge status={row.original.level as string} />
            ),
        },
        {
            accessorKey: 'id',
            header: ({ column }) => (
                <SortableHeader column={column} title={'Actions'} sortable={false} />
            ),
            cell: ({ row }) => {
                return <div>
                    <TooltipProvider>
                        <div className="flex items-center justify-center gap-1.5">
                            <Tooltip>
                                <TooltipTrigger
                                    asChild
                                >
                                    <Link
                                        href={`/companies/${row.original.id}/details`}
                                        className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted"
                                        aria-label="View event"
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent>
                                    View Company
                                </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger
                                    asChild
                                >
                                    <Link
                                        href={`/companies/${row.original.id}/edit`}
                                        className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted"
                                        aria-label="View event"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent>
                                    Edit company
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </TooltipProvider>
                </div>
            }
        }
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Companies" />

            <div className="px-4 sm:px-8">
                <div className="flex flex-col my-4 sm:my-8 items-center justify-between gap-8 lg:flex-row">
                    <p className="font-semibold text-foreground text-3xl my-0">
                        Companies
                    </p>

                    {/* Search + Add */}
                    <div className="flex items-center gap-3">
                        <form className="relative w-full sm:w-64">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Search className="z-10 h-4 w-4 text-gray-400" />
                            </div>

                            <Input
                                type="text"
                                value={searchValue}
                                onChange={(e) =>
                                    setSearchValue(e.target.value)
                                }
                                placeholder="Search companies..."
                                className="h-9 pl-8 text-sm"
                            />
                        </form>

                        <Link
                            href="/companies/create"
                            className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-pink-500 via-blue-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white transition hover:scale-105"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Add Company</span>
                        </Link>
                    </div>
                </div>

                <ComponentCard desc="Manage all companies in your system">
                    <DataTable
                        columns={columns}
                        enableInternalPagination={false}
                        data={companies.data || []}
                        initialSorting={initialSorting}
                        meta={{ ...omit(companies, ['data']) }}
                        onFetch={(params) => {
                            router.get(
                                '/companies',
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
                </ComponentCard>
            </div>
        </AppLayout>
    );
}
