import { omit } from 'lodash';
import { ColumnDef } from '@tanstack/react-table';
import React, { useEffect, useState, useMemo } from 'react';
import { Head, useForm, router, Link } from '@inertiajs/react';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, PaginatedData } from '@/types';

import { Event } from '@/types/models/Event';
import { Company } from '@/types/models/Company';

import FormModal from '@/components/events/form-modal';
import ComponentCard from '@/components/component-card';
import { DataTable, SortableHeader } from '@/components/ui/data-table';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

import { toFrontendSort } from '@/lib/sort';
import EventTypeBadge from '@/components/events/type-badge';
import ConfirmationDialog from '@/components/confirmation-dialog';


interface EventsPageProps {
    events: PaginatedData<Event>;
    companies: Company[];
    search: string;
    query?: {
        sort?: string | null
        perPage?: number | string
        page?: number | string
        filter?: {
            search?: string
        }
    }
}

export default function EventList({
    events,
    companies,
    query,
}: EventsPageProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [searchValue, setSearchValue] = useState(query?.filter?.search ?? '');
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

    const { delete: destroy } = useForm();

    useEffect(() => {
        const currentSearchParam = query?.filter?.search ?? '';

        if (searchValue === currentSearchParam) {
            return;
        }

        const timer = setTimeout(() => {
            router.get(
                '/events',
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


    const handleDeleteConfirm = () => {
        if (selectedEvent) {
            destroy(`/events/${selectedEvent.id}`, {
                onSuccess: () => {
                    setIsDeleteDialogOpen(false);
                    setSelectedEvent(null);
                },
                preserveScroll: true,
            });
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Events',
            href: `/events`,
        },
    ];

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
                <SortableHeader column={column} title={'Name'} />
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
            accessorKey: 'id',
            header: ({ column }) => (
                <SortableHeader column={column} title={'Actions'} sortable={false} />
            ),
            cell: ({ row }) => {
                return <div>
                    <TooltipProvider>
                        <div className="flex items-center justify-center gap-1.5">
                            {/* Edit */}
                            <Tooltip>
                                <TooltipTrigger
                                    asChild
                                >
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>{
                                            setSelectedEvent(row.original)
                                            setIsOpen(true)
                                        }}
                                        className="h-8 w-8"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>
                                        Edit event
                                    </p>
                                </TooltipContent>
                            </Tooltip>

                            {/* Delete */}
                            <Tooltip>
                                <TooltipTrigger
                                    asChild
                                >
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => {
                                                setSelectedEvent(row.original)
                                                setIsDeleteDialogOpen(true)
                                        }}
                                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>
                                        Delete event
                                    </p>
                                </TooltipContent>
                            </Tooltip>

                            {/* View */}
                            <Tooltip>
                                <TooltipTrigger
                                    asChild
                                >
                                    <Link
                                        href={`/events/${row.original.id}`}
                                        className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted"
                                        aria-label="View event"
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>
                                        View event
                                    </p>
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
            <Head title="Events" />

            <FormModal
                open={isOpen}
                initialValue={selectedEvent}
                companies={companies}
                onOpenChange={(bool: boolean) => {
                    setIsOpen(bool);
                    setSelectedEvent(null);
                }}
            />

            <ConfirmationDialog
                isOpen={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onCancel={() => {
                    setIsDeleteDialogOpen(false);
                    setSelectedEvent(null);
                }}
                description={`This action cannot be undone. This will permanently delete the event "${selectedEvent?.name}" and remove it from our servers.`}
                onConfirm={() => handleDeleteConfirm()}
            />

            <div className="min-h-screen p-4 sm:p-8">
                <p className="my-0 pb-6 text-3xl font-semibold text-foreground">
                    Events
                </p>

                <ComponentCard desc={'Manage all events in your system'}>
                    <div className="mb-6 flex justify-between">
                        <div className="flex items-end space-x-2">
                            <div className="relative max-w-md">
                                <Search className="pointer-events-none absolute top-4.5 left-3 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Search events..."
                                    value={searchValue}
                                    onChange={(e) =>
                                        setSearchValue(e.target.value)
                                    }
                                    className="h-9 pr-9 pl-9"
                                />
                            </div>
                        </div>

                        <Button
                            onClick={() => {
                                setSelectedEvent(null);
                                setIsOpen(true);
                            }}
                        >
                            <Plus className="mr-1.5 h-4 w-4" />
                            Add New Event
                        </Button>
                    </div>

                    <DataTable
                        columns={columns}
                        enableInternalPagination={false}
                        data={events.data || []}
                        initialSorting={initialSorting}
                        meta={{ ...omit(events, ['data']) }}
                        onFetch={(params) => {
                            router.get(
                                '/events',
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
