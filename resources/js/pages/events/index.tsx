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
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import ReactSelect from 'react-select';
import makeAnimated from 'react-select/animated';

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

// For react-select animation
const animatedComponents = makeAnimated();

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
                },
            );
        }, 500),
        [],
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
            },
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
            router.get(
                url,
                {},
                {
                    preserveState: true,
                    preserveScroll: true,
                },
            );
        }
    };

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
                            <Button
                                type="submit"
                                disabled={
                                    processing || data.company_ids.length === 0
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
                <div className="mb-2">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <h1 className="text-lg font-semibold text-foreground">
                                Events
                            </h1>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                                Manage all events in your system
                            </p>
                        </div>

                        <Button
                            size="sm"
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

                    {/* Search Bar */}
                    <div className="relative mt-4 max-w-md">
                        <Search className="pointer-events-none absolute top-4.5 left-3 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search events..."
                            value={search}
                            onChange={handleSearchChange}
                            className="h-9 pr-9 pl-9"
                        />
                        {search ? (
                            <button
                                type="button"
                                onClick={clearSearch}
                                className="absolute top-4.5 right-2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
                                aria-label="Clear search"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        ) : null}

                        {search ? (
                            <p className="mt-2 text-xs text-muted-foreground">
                                Results for{' '}
                                <span className="font-medium text-foreground">
                                    "{search}"
                                </span>
                            </p>
                        ) : null}
                    </div>
                </div>

                {/* Events Table - Keeping borderless design */}
                <div className="rounded-lg bg-background">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-100">
                                <tr className="text-xs text-muted-foreground">
                                    <th className="px-4 py-2 text-left font-medium">
                                        Event
                                    </th>
                                    <th className="px-4 py-2 text-left font-medium">
                                        Date
                                    </th>
                                    <th className="px-4 py-2 text-left font-medium">
                                        Type
                                    </th>
                                    <th className="px-4 py-2 text-left font-medium">
                                        Location
                                    </th>
                                    <th className="px-4 py-2 text-left font-medium">
                                        Companies
                                    </th>
                                    <th className="px-4 py-2 text-right font-medium">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-border/60">
                                {events.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-4 py-10 text-center text-sm text-muted-foreground"
                                        >
                                            {search ? (
                                                <>
                                                    No events found for{' '}
                                                    <span className="font-medium text-foreground">
                                                        "{search}"
                                                    </span>
                                                    .
                                                    <Button
                                                        variant="link"
                                                        onClick={clearSearch}
                                                        className="ml-1 h-auto p-0 text-sm"
                                                    >
                                                        Clear search
                                                    </Button>
                                                </>
                                            ) : (
                                                'No events found. Create your first event.'
                                            )}
                                        </td>
                                    </tr>
                                ) : (
                                    events.data.map((event) => (
                                        <tr
                                            key={event.id}
                                            className="even:bg-gray-50/30 hover:bg-muted/30"
                                        >
                                            <td className="px-4 py-2">
                                                <div className="font-medium text-foreground">
                                                    {event.name}
                                                </div>
                                            </td>

                                            <td className="px-4 py-2">
                                                <div className="text-sm text-foreground">
                                                    {format(
                                                        new Date(event.date),
                                                        'PPp',
                                                    )}
                                                </div>
                                            </td>

                                            <td className="px-4 py-2">
                                                <Badge
                                                    variant="outline"
                                                    className="h-6 px-2 text-xs capitalize"
                                                >
                                                    {event.type}
                                                </Badge>
                                            </td>

                                            <td className="px-4 py-2">
                                                <div className="text-sm text-foreground">
                                                    {event.location}
                                                </div>
                                            </td>

                                            <td className="px-4 py-2">
                                                {event.companies?.length ? (
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {event.companies
                                                            .slice(0, 3)
                                                            .map((company) => (
                                                                <Badge
                                                                    key={
                                                                        company.id
                                                                    }
                                                                    variant="secondary"
                                                                    className="h-6 gap-1 px-2 text-xs"
                                                                >
                                                                    <Building className="h-3.5 w-3.5" />
                                                                    {
                                                                        company.name
                                                                    }
                                                                </Badge>
                                                            ))}
                                                        {event.companies
                                                            .length > 3 ? (
                                                            <Badge
                                                                variant="outline"
                                                                className="h-6 px-2 text-xs"
                                                            >
                                                                +
                                                                {event.companies
                                                                    .length - 3}
                                                            </Badge>
                                                        ) : null}
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">
                                                        No companies
                                                    </span>
                                                )}
                                            </td>

                                            <td className="px-4 py-2">
                                                <TooltipProvider>
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        {/* Edit */}
                                                        <Tooltip>
                                                            <TooltipTrigger
                                                                asChild
                                                            >
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() =>
                                                                        handleEdit(
                                                                            event,
                                                                        )
                                                                    }
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
                                                                    onClick={() =>
                                                                        handleDeleteClick(
                                                                            event,
                                                                        )
                                                                    }
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
                                                                    href={`/events/${event.id}`}
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
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Compact pagination footer */}
                    <div className="mt-2 flex flex-col items-center gap-2 border-t px-1 sm:flex-row md:justify-between">
                        <div className="text-xs text-muted-foreground">
                            Showing{' '}
                            <span className="font-medium text-foreground">
                                {events.from || 0}
                            </span>
                            –{' '}
                            <span className="font-medium text-foreground">
                                {events.to || 0}
                            </span>{' '}
                            of{' '}
                            <span className="font-medium text-foreground">
                                {events.total}
                            </span>
                        </div>

                        <div className="mt-2 flex items-center gap-1">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() =>
                                    handlePageChange(
                                        events.links[0]?.url ?? null,
                                    )
                                }
                                disabled={!events.links[0]?.url}
                                className="h-8 w-8"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>

                            {events.links.slice(1, -1).map((link, index) => {
                                const isEllipsis = link.label === '...';
                                const isCurrent = link.active;

                                return (
                                    <Button
                                        key={index}
                                        variant={
                                            isCurrent ? 'default' : 'outline'
                                        }
                                        size="icon"
                                        onClick={() =>
                                            handlePageChange(link.url)
                                        }
                                        disabled={!link.url || isEllipsis}
                                        className="h-8 w-8 text-xs"
                                    >
                                        {isEllipsis ? '…' : link.label}
                                    </Button>
                                );
                            })}

                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() =>
                                    handlePageChange(
                                        events.links[events.links.length - 1]
                                            ?.url ?? null,
                                    )
                                }
                                disabled={
                                    !events.links[events.links.length - 1]?.url
                                }
                                className="h-8 w-8"
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
