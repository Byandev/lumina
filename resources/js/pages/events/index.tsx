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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { Checkbox } from '@/components/ui/checkbox';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { Head, useForm, router, Link } from '@inertiajs/react';
import { format } from 'date-fns';
import {
    Edit,
    Plus,
    Trash2,
    Search,
    X,
    ChevronLeft,
    ChevronRight,
    Users,
    Building,
    Eye,
} from 'lucide-react';
import { FormEvent, useEffect, useState, useCallback } from 'react';
import { debounce } from 'lodash';
import { route } from 'ziggy-js';

interface Event {
    id: number;
    name: string;
    date: string;
    type: string;
    location: string;
    company_ids: string[]; // Changed from company_id to company_ids
    companies?: { // Changed from company to companies
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
    events: {
        data: Event[];
        links: PaginationLink[];
        current_page: number;
        from: number;
        last_page: number;
        per_page: number;
        to: number;
        total: number;
    };
    companies: Company[];
    search: string;
}

export default function index({
                                  events,
                                  companies,
                                  search: initialSearch = '',
                              }: EventsPageProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
    const [search, setSearch] = useState(initialSearch);
    const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);

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
        company_ids: [] as string[], // Changed from company_id to company_ids array
    });

    // Debounced search function
    const debouncedSearch = useCallback(
        debounce((value: string) => {
            router.get(
                '/events',
                { search: value, page: 1 },
                {
                    preserveState: true,
                    replace: true,
                    preserveScroll: true,
                }
            );
        }, 500),
        []
    );

    // Clear search
    const clearSearch = () => {
        setSearch('');
        router.get(
            '/events',
            {},
            {
                preserveState: true,
                replace: true,
                preserveScroll: true,
            }
        );
    };

    // Handle search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearch(value);
        debouncedSearch(value);
    };

    // Handle page change
    const handlePageChange = (url: string | null) => {
        if (url) {
            router.get(url, {}, {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

    // Handle company selection
    const handleCompanySelect = (companyId: string) => {
        setSelectedCompanies(prev => {
            if (prev.includes(companyId)) {
                return prev.filter(id => id !== companyId);
            } else {
                return [...prev, companyId];
            }
        });
    };

    // Handle select all companies
    const handleSelectAll = () => {
        if (selectedCompanies.length === companies.length) {
            setSelectedCompanies([]);
        } else {
            const allCompanyIds = companies.map(company => company.id.toString());
            setSelectedCompanies(allCompanyIds);
        }
    };

    // Handle clear all selections
    const handleClearAll = () => {
        setSelectedCompanies([]);
    };

    useEffect(() => {
        if (editingEvent) {
            const companyIds = editingEvent.company_ids ||
                (editingEvent.companies ? editingEvent.companies.map(c => c.id.toString()) : []);

            setSelectedCompanies(companyIds);
            setData({
                name: editingEvent.name,
                date: editingEvent.date,
                type: editingEvent.type,
                location: editingEvent.location,
                company_ids: companyIds,
            });
        } else {
            setSelectedCompanies([]);
        }
    }, [editingEvent]);

    // Update form data when selected companies change
    useEffect(() => {
        setData('company_ids', selectedCompanies);
    }, [selectedCompanies]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (editingEvent) {
            // Update existing event
            put(`/events/${editingEvent.id}`, {
                onSuccess: () => {
                    reset();
                    setIsOpen(false);
                    setEditingEvent(null);
                    setSelectedCompanies([]);
                },
                preserveScroll: true,
            });
        } else {
            // Create new event
            post(`/events`, {
                onSuccess: () => {
                    reset();
                    setIsOpen(false);
                    setSelectedCompanies([]);
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
        setSelectedCompanies([]);
        reset();
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: dashboard().url,
        },
        {
            title: 'Events',
            href: `/events`
        },
    ];

    const eventTypes = [
        'Online',
        'Face to Face',
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
                <DialogContent className="sm:max-w-[600px]">
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
                            <div className="flex items-center justify-between">
                                <Label htmlFor="companies">Companies *</Label>
                                <div className="flex items-center gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={handleSelectAll}
                                        className="h-7 text-xs"
                                    >
                                        {selectedCompanies.length ===
                                        companies.length
                                            ? 'Deselect All'
                                            : 'Select All'}
                                    </Button>
                                    {selectedCompanies.length > 0 && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={handleClearAll}
                                            className="h-7 text-xs"
                                        >
                                            Clear All
                                        </Button>
                                    )}
                                </div>
                            </div>
                            <div className="max-h-60 overflow-y-auto rounded-md border p-4">
                                {companies.length === 0 ? (
                                    <p className="py-4 text-center text-sm text-gray-500">
                                        No companies available
                                    </p>
                                ) : (
                                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                        {companies.map((company) => (
                                            <div
                                                key={company.id}
                                                className="flex items-center space-x-2"
                                            >
                                                <Checkbox
                                                    id={`company-${company.id}`}
                                                    checked={selectedCompanies.includes(
                                                        company.id.toString(),
                                                    )}
                                                    onCheckedChange={() =>
                                                        handleCompanySelect(
                                                            company.id.toString(),
                                                        )
                                                    }
                                                    disabled={processing}
                                                />
                                                <Label
                                                    htmlFor={`company-${company.id}`}
                                                    className="flex-1 cursor-pointer text-sm font-normal"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <Building className="h-4 w-4 text-gray-500" />
                                                        <span>
                                                            {company.name}
                                                        </span>
                                                    </div>
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {selectedCompanies.length > 0 && (
                                <p className="text-sm text-gray-500">
                                    <Users className="mr-1 inline h-4 w-4" />
                                    {selectedCompanies.length} company
                                    {selectedCompanies.length !== 1
                                        ? 'ies'
                                        : ''}{' '}
                                    selected
                                </p>
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
                            <Button
                                type="submit"
                                disabled={
                                    processing || selectedCompanies.length === 0
                                }
                            >
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
                <div className="mb-6">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Events
                            </h1>
                            <p className="mt-1 text-sm text-gray-500">
                                Manage all events in your system
                            </p>
                        </div>
                        <div>
                            <Button
                                onClick={() => {
                                    setEditingEvent(null);
                                    reset();
                                    setSelectedCompanies([]);
                                    setIsOpen(true);
                                }}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Add Event
                            </Button>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="relative max-w-md">
                        <div className="relative">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search events by name..."
                                value={search}
                                onChange={handleSearchChange}
                                className="pr-10 pl-10"
                            />
                            {search && (
                                <button
                                    onClick={clearSearch}
                                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                        {search && (
                            <p className="mt-2 text-sm text-gray-500">
                                Showing results for "{search}"
                            </p>
                        )}
                    </div>
                </div>

                {/* Events Table */}
                <div className="mb-4 rounded-lg border bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b bg-gray-50">
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                        Event Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                        Date & Time
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                        Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                        Location
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                        Companies
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {events.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-6 py-8 text-center text-gray-500"
                                        >
                                            {search ? (
                                                <>
                                                    No events found matching "
                                                    {search}".
                                                    <Button
                                                        variant="link"
                                                        onClick={clearSearch}
                                                        className="ml-1"
                                                    >
                                                        Clear search
                                                    </Button>
                                                </>
                                            ) : (
                                                'No events found. Create your first event!'
                                            )}
                                        </td>
                                    </tr>
                                ) : (
                                    events.data.map((event) => (
                                        <tr
                                            key={event.id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900">
                                                    {event.name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">
                                                    {format(
                                                        new Date(event.date),
                                                        'PPp',
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge
                                                    variant="outline"
                                                    className="capitalize"
                                                >
                                                    {event.type}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">
                                                    {event.location}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    {event.companies &&
                                                    event.companies.length >
                                                        0 ? (
                                                        <div className="flex flex-wrap gap-1">
                                                            {event.companies
                                                                .slice(0, 3)
                                                                .map(
                                                                    (
                                                                        company,
                                                                    ) => (
                                                                        <Badge
                                                                            key={
                                                                                company.id
                                                                            }
                                                                            variant="secondary"
                                                                            className="flex items-center gap-1"
                                                                        >
                                                                            <Building className="h-3 w-3" />
                                                                            {
                                                                                company.name
                                                                            }
                                                                        </Badge>
                                                                    ),
                                                                )}
                                                            {event.companies
                                                                .length > 3 && (
                                                                <Badge variant="outline">
                                                                    +
                                                                    {event
                                                                        .companies
                                                                        .length -
                                                                        3}{' '}
                                                                    more
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm text-gray-500">
                                                            No companies
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleEdit(event)
                                                        }
                                                        className="h-8 w-8 p-0"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>

                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleDeleteClick(
                                                                event,
                                                            )
                                                        }
                                                        className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>

                                                    <Link
                                                        href={`/events/${event.id}`}
                                                        className="flex h-8 w-8 items-center justify-center rounded hover:bg-slate-100"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex flex-col items-center justify-between gap-4 rounded-b-lg border-t bg-gray-50 p-2 text-sm sm:flex-row">
                        {/* Pagination info */}
                        <div className="text-sm text-gray-700">
                            Showing{' '}
                            <span className="font-medium">
                                {events.from || 0}
                            </span>{' '}
                            to{' '}
                            <span className="font-medium">
                                {events.to || 0}
                            </span>{' '}
                            of{' '}
                            <span className="font-medium">{events.total}</span>{' '}
                            results
                        </div>

                        {/* Pagination controls */}
                        <div className="flex items-center gap-1">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    handlePageChange(events.links[0].url)
                                }
                                disabled={!events.links[0].url}
                                className="h-8 w-8 p-0"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>

                            {events.links.slice(1, -1).map((link, index) => {
                                const pageNum = link.label;
                                const isEllipsis = pageNum === '...';
                                const isCurrent = link.active;
                                const totalPages = events.last_page;
                                const currentPage = events.current_page;
                                const showPage =
                                    index < 2 ||
                                    index > events.links.length - 4 ||
                                    Math.abs(parseInt(pageNum) - currentPage) <=
                                        1 ||
                                    isEllipsis;

                                if (!showPage && !isEllipsis) {
                                    return null;
                                }

                                return (
                                    <Button
                                        key={index}
                                        variant={
                                            isCurrent ? 'default' : 'outline'
                                        }
                                        size="sm"
                                        onClick={() =>
                                            handlePageChange(link.url)
                                        }
                                        disabled={!link.url || isEllipsis}
                                        className={`h-8 w-8 p-0 ${isCurrent ? 'bg-primary text-primary-foreground' : ''}`}
                                    >
                                        {isEllipsis ? '...' : pageNum}
                                    </Button>
                                );
                            })}

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    handlePageChange(
                                        events.links[events.links.length - 1]
                                            .url,
                                    )
                                }
                                disabled={
                                    !events.links[events.links.length - 1].url
                                }
                                className="h-8 w-8 p-0"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
