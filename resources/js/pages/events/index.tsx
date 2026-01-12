import ComponentCard from '@/components/component-card';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
    DataTable,
    NormalHeader,
    SortableHeader,
} from '@/components/ui/data-table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { toFrontendSort } from '@/lib/sort';
import type { BreadcrumbItem, PaginatedData } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { omit } from 'lodash';
import { Edit, Eye, Plus, Search, Trash2, Users } from 'lucide-react';
import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import ReactSelect from 'react-select';
import makeAnimated from 'react-select/animated';
import EventCompaniesAvatar from '@/components/events/event-companies-avatar';

interface Event {
    id: number;
    name: string;
    date: string;
    type: string;
    location: string;
    company_ids: string[];
    companies?: {
        id: number;
        name: string;
    }[];
    created_at: string;
    updated_at: string;
}

interface Company {
    id: number;
    name: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface EventsPageProps {
    events: PaginatedData<Event>;
    query?: {
        sort?: string | null;
        perPage?: number | string | null;
        page?: number | string;
        filter?: {
            search?: string;
        };
    };
    companies: Company[];
}

// For react-select animation
const animatedComponents = makeAnimated();

export default function index({ events, query, companies }: EventsPageProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
    const [searchValue, setSearchValue] = useState(query?.filter?.search ?? '');

    // Convert companies to react-select options
    const companyOptions = companies.map((company) => ({
        value: company.id.toString(),
        label: company.name,
    }));

    const {
        data,
        setData,
        post,
        put,
        delete: destroy,
        errors,
        reset,
        processing,
    } = useForm({
        name: '',
        date: '',
        type: '',
        location: '',
        company_ids: [] as string[],
    });

    // Convert selected company_ids to react-select value format
    const selectedCompanyValues = companyOptions.filter((option) =>
        data.company_ids.includes(option.value),
    );

    // Handle company selection with react-select
    const handleCompanyChange = (selectedOptions: any) => {
        const selectedIds = selectedOptions
            ? selectedOptions.map((option: any) => option.value)
            : [];
        setData('company_ids', selectedIds);
    };

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

    useEffect(() => {
        if (editingEvent) {
            const companyIds =
                editingEvent.company_ids ||
                (editingEvent.companies
                    ? editingEvent.companies.map((c) => c.id.toString())
                    : []);

            setData({
                name: editingEvent.name,
                date: editingEvent.date,
                type: editingEvent.type,
                location: editingEvent.location,
                company_ids: companyIds,
            });
        } else {
            setData('company_ids', []);
        }
    }, [editingEvent]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (editingEvent) {
            // Update existing event
            put(`/events/${editingEvent.id}`, {
                onSuccess: () => {
                    reset();
                    setIsOpen(false);
                    setEditingEvent(null);
                },
                preserveScroll: true,
            });
        } else {
            // Create new event
            post(`/events`, {
                onSuccess: () => {
                    reset();
                    setIsOpen(false);
                },
                preserveScroll: true,
            });
        }
    };

    const handleEdit = (event: Event) => {
        setEditingEvent(event);
        setIsOpen(true);
    };

    const handleDeleteClick = (event: Event) => {
        setEventToDelete(event);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (eventToDelete) {
            destroy(`/events/${eventToDelete.id}`, {
                onSuccess: () => {
                    setIsDeleteDialogOpen(false);
                    setEventToDelete(null);
                },
                preserveScroll: true,
            });
        }
    };

    const handleCancel = () => {
        setIsOpen(false);
        setEditingEvent(null);
        reset();
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Events',
            href: `/events`,
        },
    ];

    const eventTypes = ['Online', 'Face to Face'];

    const selectStyles = {
        control: (base: any, state: any) => ({
            ...base,
            minHeight: '40px',
            borderColor: state.isFocused
                ? 'hsl(var(--ring))'
                : 'hsl(var(--input))',
            backgroundColor: 'hsl(var(--background))',
            '&:hover': {
                borderColor: state.isFocused
                    ? 'hsl(var(--ring))'
                    : 'hsl(var(--input))',
            },
            boxShadow: state.isFocused ? '0 0 0 2px hsl(var(--ring))' : 'none',
            borderRadius: 'calc(var(--radius) - 2px)',
        }),
        menu: (base: any) => ({
            ...base,
            backgroundColor: 'hsl(var(--popover))',
            border: '1px solid hsl(var(--border))',
            borderRadius: 'calc(var(--radius) - 2px)',
            zIndex: 50,
        }),
        menuList: (base: any) => ({
            ...base,
            padding: '4px',
            maxHeight: '200px',
        }),
        option: (base: any, state: any) => ({
            ...base,
            backgroundColor: state.isSelected
                ? 'hsl(var(--primary))'
                : state.isFocused
                    ? 'hsl(var(--accent))'
                    : 'transparent',
            color: state.isSelected
                ? 'hsl(var(--primary-foreground))'
                : 'hsl(var(--foreground))',
            borderRadius: 'calc(var(--radius) - 4px)',
            padding: '8px 12px',
            cursor: 'pointer',
            '&:active': {
                backgroundColor: 'hsl(var(--primary))',
            },
        }),
        multiValue: (base: any) => ({
            ...base,
            backgroundColor: 'hsl(var(--secondary))',
            borderRadius: 'calc(var(--radius) - 2px)',
        }),
        multiValueLabel: (base: any) => ({
            ...base,
            color: 'hsl(var(--secondary-foreground))',
            padding: '2px 6px',
        }),
        multiValueRemove: (base: any) => ({
            ...base,
            color: 'hsl(var(--muted-foreground))',
            borderRadius:
                '0 calc(var(--radius) - 2px) calc(var(--radius) - 2px) 0',
            '&:hover': {
                backgroundColor: 'hsl(var(--destructive))',
                color: 'hsl(var(--destructive-foreground))',
            },
        }),
        placeholder: (base: any) => ({
            ...base,
            color: 'hsl(var(--muted-foreground))',
        }),
        noOptionsMessage: (base: any) => ({
            ...base,
            color: 'hsl(var(--muted-foreground))',
        }),
        clearIndicator: (base: any) => ({
            ...base,
            color: 'hsl(var(--muted-foreground))',
            '&:hover': {
                color: 'hsl(var(--foreground))',
            },
        }),
        dropdownIndicator: (base: any) => ({
            ...base,
            color: 'hsl(var(--muted-foreground))',
            '&:hover': {
                color: 'hsl(var(--foreground))',
            },
        }),
    };

    const columns: ColumnDef<Event>[] = [
        {
            accessorKey: 'name',
            header: ({ column }) => (
                <SortableHeader column={column} title={'Name'} />
            ),
            cell: ({ row }) => {
                const event = row.original;

                return (
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="min-w-0">
                            <div className="max-w-[140px] truncate text-sm font-medium text-gray-900 sm:max-w-[240px]">
                                {event.name}
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: 'date',
            header: ({ column }) => (
                <SortableHeader column={column} title={'Date'} />
            ),
            cell: ({ row }) => {
                const event = row.original;

                return (
                    <div className="min-w-0">
                        <div className="max-w-[140px] truncate text-sm text-gray-600 sm:max-w-[240px]">
                            {new Date(event.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                            })}
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: 'location',
            header: ({ column }) => (
                <SortableHeader column={column} title={'Location'} />
            ),
            cell: ({ row }) => {
                const event = row.original;

                return (
                    <div className="min-w-0">
                        <div className="max-w-[140px] truncate text-sm text-gray-600 sm:max-w-[240px]">
                            {event.location}
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: 'type',
            header: ({ column }) => (
                <SortableHeader column={column} title={'Type'} />
            ),
            cell: ({ row }) => {
                const event = row.original;

                return (
                    <div className="min-w-0">
                        <div className="max-w-[140px] truncate text-sm text-gray-600 sm:max-w-[240px]">
                            {event.type}
                        </div>
                    </div>
                );
            },
        },

        {
            accessorKey: 'companies',
            header: ({ column }) => (
                <NormalHeader column={column} title={'Companies'} />
            ),
            cell: ({ row }) => <EventCompaniesAvatar event={row.original} />,
        },
        {
            accessorKey: 'actions',
            header: ({ column }) => (
                <NormalHeader column={column} title={'Actions'} />
            ),
            cell: ({ row }) => {
                const event = row.original;
                return (
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            title="View"
                            onClick={() => router.get(`/events/${event.id}`)}
                        >
                            <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            title="Edit"
                            onClick={() => handleEdit(event)}
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                            title="Delete"
                            onClick={() => handleDeleteClick(event)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                );
            },
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Events" />

            {/* Add/Edit Event Dialog */}
            <Dialog
                open={isOpen}
                onOpenChange={(open) => {
                    if (!open) handleCancel();
                    setIsOpen(open);
                }}
            >
                <DialogContent
                    className="sm:max-w-[600px]"
                    onPointerDownOutside={(e) => {
                        e.preventDefault();
                    }}
                >
                    <DialogHeader>
                        <DialogTitle>
                            {editingEvent ? 'Edit Event' : 'Add New Event'}
                        </DialogTitle>
                        <DialogDescription>
                            {editingEvent
                                ? 'Update the event details.'
                                : 'Fill in the details to create a new event.'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Event Name *</Label>
                            <Input
                                id="name"
                                name="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                required
                                placeholder="Enter event name"
                                disabled={processing}
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="date">Date *</Label>
                            <Input
                                id="date"
                                name="date"
                                type="datetime-local"
                                value={data.date}
                                onChange={(e) =>
                                    setData('date', e.target.value)
                                }
                                required
                                disabled={processing}
                            />
                            {errors.date && (
                                <p className="text-sm text-red-500">
                                    {errors.date}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="type">Event Type *</Label>
                            <Select
                                value={data.type}
                                onValueChange={(value) =>
                                    setData('type', value)
                                }
                                required
                                disabled={processing}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select event type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {eventTypes.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.type && (
                                <p className="text-sm text-red-500">
                                    {errors.type}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="location">Location *</Label>
                            <Input
                                id="location"
                                name="location"
                                value={data.location}
                                onChange={(e) =>
                                    setData('location', e.target.value)
                                }
                                required
                                placeholder="Enter event location"
                                disabled={processing}
                            />
                            {errors.location && (
                                <p className="text-sm text-red-500">
                                    {errors.location}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="companies">Companies *</Label>
                            <ReactSelect
                                id="companies"
                                name="companies"
                                isMulti
                                options={companyOptions}
                                value={selectedCompanyValues}
                                onChange={handleCompanyChange}
                                closeMenuOnSelect={false}
                                placeholder="Select companies..."
                                noOptionsMessage={() => 'No companies found'}
                                components={animatedComponents}
                                isDisabled={processing}
                                className="react-select-container"
                                classNamePrefix="react-select"
                                classNames={{
                                    control: (state) =>
                                        state.isFocused
                                            ? 'border-ring ring-2 ring-ring'
                                            : 'border-input',
                                    menu: () =>
                                        'bg-popover border border-border rounded-md shadow-lg',
                                    option: (state) =>
                                        state.isSelected
                                            ? 'bg-primary text-primary-foreground'
                                            : state.isFocused
                                              ? 'bg-accent text-accent-foreground'
                                              : 'bg-transparent',
                                    multiValue: () =>
                                        'bg-secondary text-secondary-foreground',
                                    placeholder: () => 'text-muted-foreground',
                                }}
                            />
                            {selectedCompanyValues.length > 0 && (
                                <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                                    <Users className="h-4 w-4" />
                                    <span>
                                        {selectedCompanyValues.length} company
                                        {selectedCompanyValues.length !== 1
                                            ? 'ies'
                                            : ''}{' '}
                                        selected
                                    </span>
                                </div>
                            )}
                            {errors.company_ids && (
                                <p className="text-sm text-red-500">
                                    {errors.company_ids}
                                </p>
                            )}
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCancel}
                                disabled={processing}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing
                                    ? 'Saving...'
                                    : editingEvent
                                      ? 'Update Event'
                                      : 'Add Event'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the event "{eventToDelete?.name}" and remove
                            it from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={() => {
                                setIsDeleteDialogOpen(false);
                                setEventToDelete(null);
                            }}
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <div className="px-4 py-6">
                <div className="mb-4">
                    <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                            <h1 className="text-lg font-semibold text-foreground md:text-xl">
                                Events
                            </h1>
                        </div>
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
                            <Button
                                onClick={() => {
                                    setEditingEvent(null);
                                    reset();
                                    setIsOpen(true);
                                }}
                            >
                                <Plus className="mr-1.5 h-4 w-4" />
                                Add New Event
                            </Button>
                        </div>
                    </div>
                </div>
                <ComponentCard desc="Manage all events in your system">
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
