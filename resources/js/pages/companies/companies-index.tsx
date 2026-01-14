import CompanyOwnersAvatar from '@/components/companies/company-owners-avatar';
import StatusBadge from '@/components/companies/status-badge';
import ComponentCard from '@/components/component-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import CircularProgress from '@/components/ui/circular-progress';
import { DataTable, SortableHeader } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { percentageFormatter } from '@/lib/formatter';
import { toFrontendSort } from '@/lib/sort';
import { type BreadcrumbItem, PaginatedData } from '@/types';
import { Company } from '@/types/models/Company';
import { Head, Link, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { omit } from 'lodash';
import { Mail, Plus, RefreshCcw, Search, ListFilterPlus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';


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
        href: '/companies',
    },
];

const NOTARIZATION_STATUS_OPTIONS = [
    { value: 'all', label: 'Notarization' },
    { value: 'pending', label: 'Pending' },
    { value: 'done', label: 'Done' },
];

const ERP_STATUS_OPTIONS = [
    { value: 'all', label: 'ERP' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
];

const SALES_STATUS_OPTIONS = [
    { value: 'all', label: 'Sales' },
    { value: 'generating', label: 'Generating' },
    { value: 'testing', label: 'Testing' },
    { value: 'inactive', label: 'Inactive' },
];

const LEVEL_STATUS_OPTIONS = [
    { value: 'all', label: 'Level' },
    { value: 'educate', label: 'Educate' },
    { value: 'empowerment', label: 'Empowerment' },
    { value: 'enterprise', label: 'Enterprise' },
    { value: 'exponential', label: 'Exponential' },
];

export default function CompaniesIndex({ companies, query }: CompaniesProps) {
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .filter(Boolean)
            .map((word) => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const [searchValue, setSearchValue] = useState(query?.filter?.search ?? '');
    const [notarization, setNotarization] = useState(query?.filter?.notarization ?? 'all');
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
                    'filter[notarization]': notarization === 'all' ? undefined : notarization,
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
    }, [searchValue, notarization, erp, sales, level, query?.sort, query?.filter]);

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
                        <Avatar>
                            <AvatarImage
                                src={`/${company.logo}`}
                                alt={company.name}
                            />
                            <AvatarFallback>
                                {getInitials(company.name)}
                            </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0">
                            <div className="max-w-[140px] truncate text-sm font-semibold text-gray-900 sm:max-w-[240px]">
                                <Link
                                    href={`/companies/${company.id}/details`}
                                    className="font-light hover:underline"
                                >
                                    {company.name}
                                </Link>
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
    ];

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
    }


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Companies" />

            <div className="px-4 sm:px-8">
                <div className="my-4 flex flex-row items-center justify-between gap-8 sm:my-8">
                    <p className="my-0 text-3xl font-semibold text-foreground">
                        Companies
                    </p>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/companies/create"
                            className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-pink-500 via-blue-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white transition hover:scale-105"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Add Company</span>
                        </Link>
                    </div>
                </div>
                <div className="flex flex-col justify-between gap-2 lg:flex-row">
                    <form className="relative w-full sm:w-64">
                        <div className="pointer-events-none absolute top-2.5 left-0 flex items-center pl-3">
                            <Search className="z-10 h-4 w-4 text-gray-400" />
                        </div>

                        <Input
                            id="searchValue"
                            type="text"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            placeholder="Search companies..."
                            className="h-9 pl-8 text-sm"
                        />
                    </form>
                    <div className="mb-6 flex items-center gap-4 overflow-auto pb-1">
                        <div className="rounded-md border p-1.5">
                            <ListFilterPlus />
                        </div>
                        <Select
                            value={notarization}
                            onValueChange={setNotarization}
                        >
                            <SelectTrigger className="w-auto">
                                <SelectValue placeholder="Notarization Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {NOTARIZATION_STATUS_OPTIONS.map(
                                        (option) => (
                                            <SelectItem
                                                key={option.value}
                                                value={option.value}
                                                className="tex-xs"
                                            >
                                                {option.label}
                                            </SelectItem>
                                        ),
                                    )}
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        <Select value={erp} onValueChange={setErp}>
                            <SelectTrigger className="w-auto">
                                <SelectValue placeholder="ERP Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {ERP_STATUS_OPTIONS.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                            className="tex-xs"
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        <Select value={sales} onValueChange={setSales}>
                            <SelectTrigger className="w-auto">
                                <SelectValue placeholder="Sales Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {SALES_STATUS_OPTIONS.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                            className="tex-xs"
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        <Select value={level} onValueChange={setLevel}>
                            <SelectTrigger className="w-auto">
                                <SelectValue placeholder="Level" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {LEVEL_STATUS_OPTIONS.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                            className="tex-xs"
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        {activeFilters.length > 0 && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button
                                            className="cursor-pointer items-center rounded border p-2 text-sm text-muted-foreground"
                                            onClick={clearFilter}
                                        >
                                            <RefreshCcw className="h-4 w-4" />
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Reset Filters</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
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
                                    'filter[notarization]':
                                        notarization === 'all'
                                            ? undefined
                                            : notarization,
                                    'filter[erp]':
                                        erp === 'all' ? undefined : erp,
                                    'filter[sales]':
                                        sales === 'all' ? undefined : sales,
                                    'filter[level]':
                                        level === 'all' ? undefined : level,
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
