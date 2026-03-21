import CompanyLayout from '@/pages/companies/company/company-layout';
import ComponentCard from '@/components/component-card';
import { Company } from '@/types/models/Company';
import { Event } from '@/types/models/Event';
import { PaginatedData } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable, SortableHeader } from '@/components/ui/data-table';
import React, { useMemo, useState, useEffect } from 'react';
import { omit } from 'lodash';
import { toFrontendSort } from '@/lib/sort';
import AttendanceSelector from '@/components/events/attendance-selector';
import { router } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import EventTypeBadge from '@/components/events/type-badge';
import { Search } from 'lucide-react';

interface Props {
    company: Company;
    events: PaginatedData<Event>;
    query?: {
        sort?: string | null;
        perPage?: number | string;
        page?: number | string;
        filter?: {
            search?: string;
        };
    };
}

const CompanyAttendance = ({ company, query, events }: Props) => {
    const [searchValue, setSearchValue] = useState(query?.filter?.search ?? '');

    useEffect(() => {
        const currentSearchParam = query?.filter?.search ?? '';

        if (searchValue === currentSearchParam) {
            return;
        }

        const timer = setTimeout(() => {
            router.get(
                `/companies/${company.id}/attendance`,
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
    }, [searchValue, query?.filter?.search, query?.sort, company.id]);

    const initialSorting = useMemo(() => {
        return toFrontendSort(query?.sort ?? null);
    }, [query?.sort]);

    const columns: ColumnDef<Event>[] = [
        {
            accessorKey: 'name',
            header: ({ column }) => (
                <SortableHeader column={column} title={'Name'} />
            ),
        },
        {
            accessorKey: 'date',
            header: ({ column }) => (
                <SortableHeader column={column} title={'Date'} />
            ),
        },
        {
            accessorKey: 'type',
            header: ({ column }) => (
                <SortableHeader column={column} title={'Type'} />
            ),
            cell: ({ row }) => {
                return <EventTypeBadge type={row.original.type} />
            }
        },
        {
            accessorKey: 'location',
            header: ({ column }) => (
                <SortableHeader column={column} title={'Location'} />
            ),
        },
        {
            accessorKey: 'attendance_status',
            header: ({ column }) => (
                <SortableHeader column={column} title={'Attendance'} />
            ),
            cell: ({ row }) => {
                return <AttendanceSelector event_id={row.original.id} company_id={company.id} status={row.original.attendance_status}/>
            },
        },
    ]

    return (
        <CompanyLayout company={company}>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">
                            Attendance Record
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            {company.name} attended events attendance
                        </p>
                    </div>
                    <form className="relative w-full sm:w-64">
                        <div className="pointer-events-none absolute top-2.5 left-0 flex items-center pl-3">
                            <Search className="z-10 h-4 w-4 text-gray-400" />
                        </div>

                        <Input
                            type="text"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            placeholder="Search event..."
                            className="h-9 pl-8 text-sm"
                        />
                    </form>
                </div>

                <DataTable
                    columns={columns}
                    enableInternalPagination={false}
                    data={events.data || []}
                    initialSorting={initialSorting}
                    meta={{ ...omit(events, ['data']) }}
                    onFetch={(params) => {
                        router.get(
                            `/companies/${company.id}/attendance`,
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
        </CompanyLayout>
    );
}

export default CompanyAttendance
