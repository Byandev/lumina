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
import { Edit, Eye, Mail, Plus, Filter, Search } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { useInitials } from '@/hooks/use-initials';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CompaniesProps {
    companies: PaginatedData<Company>;
    search?: string;
    query?: {
        sort?: string | null;
        perPage?: number | string;
        page?: number | string;
        filter?: {
            search?: string;
            notarization?: string;
            erp?: string;
            sales?: string;
            level?: string;
        };
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Companies',
        href: '/companies'
    },
];

const NOTARIZATION_STATUS_OPTIONS = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'done', label: 'Done' },
];

const ERP_STATUS_OPTIONS = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
];

const SALES_STATUS_OPTIONS = [
    { value: 'all', label: 'All' },
    { value: 'generating', label: 'Generating' },
    { value: 'testing', label: 'Testing' },
    { value: 'inactive', label: 'Inactive' },
];

const LEVEL_STATUS_OPTIONS = [
    { value: 'all', label: 'All' },
    { value: 'educate', label: 'Educate' },
    { value: 'empowerment', label: 'Empowerment' },
    { value: 'enterprise', label: 'Enterprise' },
    { value: 'exponential', label: 'Exponential' },
];

export default function CompaniesIndex({ companies, query }: CompaniesProps) {
    const getInitials = useInitials();

    const [searchValue, setSearchValue] = useState(query?.filter?.search ?? '');
    const [notarization, setNotarization] = useState(
        query?.filter?.notarization ?? 'all',
    );
    const [erp, setErp] = useState(query?.filter?.erp ?? 'all');
    const [sales, setSales] = useState(query?.filter?.sales ?? 'all');
    const [level, setLevel] = useState(query?.filter?.level ?? 'all');

    useEffect(() => {
        const currentSearchParam = query?.filter?.search ?? '';
        const currentNotarization = query?.filter?.notarization ?? 'all';
        const currentErp = query?.filter?.erp ?? 'all';
        const currentSales = query?.filter?.sales ?? 'all';
        const currentLevel = query?.filter?.level ?? 'all';

        if (
            searchValue === currentSearchParam &&
            notarization === currentNotarization &&
            erp === currentErp &&
            sales === currentSales &&
            level === currentLevel
        ) {
            return;
        }

        const timer = setTimeout(() => {
            router.get(
                '/companies',
                {
                    sort: query?.sort,
                    'filter[search]': searchValue || undefined,
                    'filter[notarization]':
                        notarization === 'all' ? undefined : notarization,
                    'filter[erp]': erp === 'all' ? undefined : erp,
                    'filter[sales]': sales === 'all' ? undefined : sales,
                    'filter[level]': level === 'all' ? undefined : level,
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
    }, [
        searchValue,
        notarization,
        erp,
        sales,
        level,
        query?.sort,
        query?.filter,
    ]);

    const activeFilters = useMemo(() => {
        const filters = [];
        if (notarization !== 'all') filters.push('Notarization');
        if (erp !== 'all') filters.push('ERP');
        if (sales !== 'all') filters.push('Sales');
        if (level !== 'all') filters.push('Level');
        return filters;
    }, [notarization, erp, sales, level]);

    const clearFilter = () => {
        setSearchValue('');
        setNotarization('all');
        setErp('all');
        setSales('all');
        setLevel('all');
    };


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
            accessorKey: 'coach',
            header: ({ column }) => (
                <SortableHeader column={column} title={'Coach'} />
            ),
            cell: ({ row }) => {
                const { coach } = row.original

                return (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Avatar className="cursor-pointer border border-white">
                                {coach && (
                                    <AvatarImage
                                        src={
                                            coach.profile_picture?.original_url
                                        }
                                        alt={coach.name}
                                    />
                                )}
                                <AvatarFallback
                                    className={
                                        coach
                                            ? `border border-blue-700 bg-blue-600 text-white`
                                            : 'border border-dashed border-blue-700 bg-blue-100 text-blue-700'
                                    }
                                >
                                    {coach ? getInitials(coach.name) : 'U'}
                                </AvatarFallback>
                            </Avatar>
                        </TooltipTrigger>

                        <TooltipContent>
                            {coach ? coach.name : 'Unassigned'}
                        </TooltipContent>
                    </Tooltip>
                );
            }
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
                <SortableHeader
                    column={column}
                    title={'Actions'}
                    sortable={false}
                />
            ),
            cell: ({ row }) => {
                return (
                    <div>
                        <TooltipProvider>
                            <div className="flex items-center justify-center gap-1.5">
                                <Tooltip>
                                    <TooltipTrigger asChild>
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
                                    <TooltipTrigger asChild>
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
                );
            },
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Companies" />

            <div className="min-h-screen p-4 sm:p-8">
                <p className="my-0 pb-6 text-3xl font-semibold text-foreground">
                    Companies
                </p>

                <ComponentCard desc="Manage all companies in your system">
                    <div className="mb-6 flex items-center justify-between gap-x-2">
                        <div className="flex flex-1 items-center gap-4">
                            <form className="relative w-full sm:w-64">
                                <div className="pointer-events-none absolute top-2.5 left-0 flex items-center pl-3">
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

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="relative">
                                        <Filter className="h-4 w-4 mr-2 text-gray-600" />
                                        Filters
                                        {activeFilters.length > 0 && (
                                            <Badge
                                                variant="secondary"
                                                className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center"
                                            >
                                                {activeFilters.length}
                                            </Badge>
                                        )}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-80" align="start">
                                    <DropdownMenuLabel>
                                        <div className="flex items-center justify-between">
                                            <span>Filter Companies</span>
                                            {activeFilters.length > 0 && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={clearFilter}
                                                    className="h-6 text-xs"
                                                >
                                                    Clear all
                                                </Button>
                                            )}
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuGroup className="space-y-4 p-2">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Notarization Status</label>
                                            <Select
                                                value={notarization}
                                                onValueChange={setNotarization}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {NOTARIZATION_STATUS_OPTIONS.map(
                                                            (option) => (
                                                                <SelectItem
                                                                    key={option.value}
                                                                    value={option.value}
                                                                >
                                                                    {option.label}
                                                                </SelectItem>
                                                            ),
                                                        )}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">ERP Status</label>
                                            <Select value={erp} onValueChange={setErp}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {ERP_STATUS_OPTIONS.map(
                                                            (option) => (
                                                                <SelectItem
                                                                    key={option.value}
                                                                    value={option.value}
                                                                >
                                                                    {option.label}
                                                                </SelectItem>
                                                            ),
                                                        )}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Sales Status</label>
                                            <Select value={sales} onValueChange={setSales}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {SALES_STATUS_OPTIONS.map(
                                                            (option) => (
                                                                <SelectItem
                                                                    key={option.value}
                                                                    value={option.value}
                                                                >
                                                                    {option.label}
                                                                </SelectItem>
                                                            ),
                                                        )}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Level</label>
                                            <Select
                                                value={level}
                                                onValueChange={setLevel}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {LEVEL_STATUS_OPTIONS.map(
                                                            (option) => (
                                                                <SelectItem
                                                                    key={option.value}
                                                                    value={option.value}
                                                                >
                                                                    {option.label}
                                                                </SelectItem>
                                                            ),
                                                        )}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <Link
                            href="/companies/create"
                            className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-pink-500 via-blue-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white transition hover:scale-105"
                        >
                            <Plus className="h-4 w-4" />
                            <span className="hidden sm:block">Add Company</span>
                        </Link>
                    </div>

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
