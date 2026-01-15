import { Company } from '@/types/models/Company';
import CompanyLayout from '@/pages/companies/company/company-layout';
import ComponentCard from '@/components/component-card';
import { Button } from '@/components/ui/button';
import { PaginatedData } from '@/types';
import { PerformanceRecord } from '@/types/models/PerformanceRecord';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable, SortableHeader } from '@/components/ui/data-table';
import CompanyOwnersAvatar from '@/components/companies/company-owners-avatar';
import React, { useEffect, useMemo, useState } from 'react';
import { omit } from 'lodash';
import { Link, router } from '@inertiajs/react';
import { toFrontendSort } from '@/lib/sort';
import moment from 'moment';
import PerformancePhaseBadge from '@/components/companies/performance-phase-badge';
import { currencyFormatter, percentageFormatter } from '@/lib/formatter';

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
            cell: ({ row }) => row.original.rts ? percentageFormatter(row.original.rts / 100) : '-',
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
