import { Company } from '@/types/models/Company';
import CompanyLayout from '@/pages/companies/company/company-layout';
import ComponentCard from '@/components/component-card';
import { Button } from '@/components/ui/button';
import { PaginatedData } from '@/types';
import { PerformanceRecord } from '@/types/models/PerformanceRecord';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable, SortableHeader } from '@/components/ui/data-table';
import React, { useEffect, useMemo } from 'react';
import { omit } from 'lodash';
import { Link, router } from '@inertiajs/react';
import { toFrontendSort } from '@/lib/sort';
import moment from 'moment';
import PerformancePhaseBadge from '@/components/companies/performance-phase-badge';
import { currencyFormatter, percentageFormatter } from '@/lib/formatter';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Edit, Eye } from 'lucide-react';

interface Props {
    company: Company;
    records: PaginatedData<PerformanceRecord>;
    query?: {
        sort?: string | null;
        perPage?: number | string;
        page?: number | string;
        filter?: {
            search?: string;
        };
    };
}

const Index = ({ company, records, query }: Props) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            router.get(
                `/companies/${company.id}/performance-records`,
                {
                    sort: query?.sort,
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
    }, [query?.filter?.search, query?.sort, company.id]);

    const initialSorting = useMemo(() => {
        return toFrontendSort(query?.sort ?? null);
    }, [query?.sort]);

    const columns: ColumnDef<PerformanceRecord>[] = [
        {
            accessorKey: 'start_date',
            header: ({ column }) => (
                <SortableHeader column={column} title={'Date'} />
            ),
            cell: ({ row }) => {
                return `${moment(row.original.start_date).format('YYYY-MM-DD')} to ${moment(row.original.end_date).format('YYYY-MM-DD')}`;
            },
        },
        {
            accessorKey: 'phase',
            header: ({ column }) => (
                <SortableHeader column={column} title={'Phase'} />
            ),
            cell: ({ row }) => (
                <PerformancePhaseBadge phase={row.original.phase} />
            ),
        },
        {
            accessorKey: 'no_of_items',
            header: ({ column }) => (
                <SortableHeader column={column} title={'# of items tested'} />
            ),
        },
        {
            accessorKey: 'avg_ads_spent',
            header: ({ column }) => (
                <SortableHeader column={column} title={'Average Ad Spent'} />
            ),
            cell: ({ row }) =>
                row.original.avg_ads_spent
                    ? currencyFormatter(row.original.avg_ads_spent)
                    : '-',
        },
        {
            accessorKey: 'roas',
            header: ({ column }) => (
                <SortableHeader column={column} title={'ROAS'} />
            ),
            cell: ({ row }) => (row.original.roas ? row.original.roas : '-'),
        },
        {
            accessorKey: 'rts',
            header: ({ column }) => (
                <SortableHeader column={column} title={'RTS'} />
            ),
            cell: ({ row }) =>
                row.original.rts
                    ? percentageFormatter(row.original.rts / 100)
                    : '-',
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
                                            href={`/companies/${row.original.company_id}/performance-records/${row.original.id}`}
                                            className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted"
                                            aria-label="View event"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        View Record
                                    </TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link
                                            href={`/companies/${row.original.company_id}/performance-records/${row.original.id}/edit`}
                                            className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted"
                                            aria-label="View event"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Edit record
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
        <CompanyLayout company={company}>
            <ComponentCard
                desc={'Track company performance'}
                rightHeader={
                    <Link href={`/companies/${company.id}/performance-records/create`}>
                        <Button>Add new Record</Button>
                    </Link>
                }
            >
                <DataTable
                    columns={columns}
                    enableInternalPagination={false}
                    data={records.data || []}
                    initialSorting={initialSorting}
                    meta={{ ...omit(records, ['data']) }}
                    onFetch={(params) => {
                        router.get(
                            `/companies/${company.id}/performance-records`,
                            {
                                sort: params?.sort,
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
        </CompanyLayout>
    );
}

export default Index
