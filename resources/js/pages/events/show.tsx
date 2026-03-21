import { omit } from 'lodash';
import { Head, Link, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowLeft, Calendar, MapPin, PinIcon, Search } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';

import { Event } from '@/types/models/Event'
import { Company } from '@/types/models/Company';

import AppLayout from '@/layouts/app-layout';
import { DataTable, SortableHeader } from '@/components/ui/data-table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { type BreadcrumbItem, PaginatedData } from '@/types';
import { toFrontendSort } from '@/lib/sort';
import { useInitials } from '@/hooks/use-initials';

import ComponentCard from '@/components/component-card';
import AttendanceSelector from '@/components/events/attendance-selector';
import { Input } from '@/components/ui/input';

interface Props {
    event: Event;
    companies: PaginatedData<Company>;
    query?: {
        sort?: string | null;
        perPage?: number | string;
        page?: number | string;
        filter?: {
            search?: string;
        };
    };
}

const Show = ({ event, companies, query }: Props) => {
    const getInitials = useInitials();
    const [searchValue, setSearchValue] = useState(query?.filter?.search ?? '');

    const initialSorting = useMemo(() => {
        return toFrontendSort(query?.sort ?? null);
    }, [query?.sort]);

    useEffect(() => {
        const currentSearchParam = query?.filter?.search ?? '';

        if (searchValue === currentSearchParam) {
            return;
        }

        const timer = setTimeout(() => {
            router.get(
                `/events/${event.id}`,
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
    }, [searchValue, query?.filter?.search, query?.sort, event.id]);

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
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: 'attendance_status',
            header: ({ column }) => (
                <SortableHeader column={column} title={'Attendance'} />
            ),
            cell: ({ row }) => {
                return <AttendanceSelector event_id={event.id} company_id={row.original.id} status={row.original.attendance_status}/>
            },
        },
    ];

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Events',
            href: `/events`,
        },
        {
            title: event.name,
            href: `/events/${event.id}`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Events" />

            <div className="min-h-[calc(100vh-60px)] bg-white/60 py-6 md:px-6 lg:px-8">
                <div className="flex items-start">
                    <Link href='/events'>
                        <ArrowLeft className="mt-1 mr-2 h-5 w-5" />
                    </Link>
                    <div className="mb-6 flex flex-col space-y-4">
                        <p className="flex flex-col text-xl font-semibold text-foreground">
                            {event.name}
                        </p>
                        <div className="flex space-x-5 text-sm font-medium text-gray-600">
                            <div className="flex gap-x-2">
                                <PinIcon className="size-5" />
                                <span>{event.type}</span>
                            </div>

                            <div className="flex gap-x-2">
                                <Calendar className="size-5" />
                                <span>{event.date}</span>
                            </div>

                            <div className="flex gap-x-2">
                                <MapPin className="size-5" />
                                <span>{event.location}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-pink-50 to-violet-50 p-2">
                    <div className="flex items-center justify-between p-4">
                        <p className="text-lg font-semibold">
                            Joined Companies
                        </p>
                        <form className="relative w-full sm:w-64">
                            <div className="relative max-w-md">
                                <Search className="pointer-events-none absolute top-4.5 left-3 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Search company..."
                                    value={searchValue}
                                    onChange={(e) =>
                                        setSearchValue(e.target.value)
                                    }
                                    className="h-9 pr-9 pl-9"
                                />
                            </div>
                        </form>
                    </div>

                    <DataTable
                        columns={columns}
                        enableInternalPagination={false}
                        data={companies.data || []}
                        initialSorting={initialSorting}
                        meta={{ ...omit(companies, ['data']) }}
                        onFetch={(params) => {
                            router.get(
                                `/events/${event.id}`,
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
            </div>
        </AppLayout>
    );
}

export default Show
