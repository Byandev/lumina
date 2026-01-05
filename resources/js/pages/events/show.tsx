import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import React, {
    useEffect,
    useMemo,
    useState,
    useCallback,
    useRef,
} from 'react';
import {
    Search,
    X,
    Loader2,
    Calendar,
    MapPin,
    Edit,
    Download,
    Check,
    Clock,
    CheckCircle,
    FilterX,
    ChevronLeft,
    ChevronRight,
    Building,
    Info,
} from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { BreadcrumbItem } from '@/types';

type AttendanceStatus = 'present' | 'absent' | 'late' | 'cleared';

const attendanceStatuses: AttendanceStatus[] = [
    'present',
    'late',
    'cleared',
    'absent',
];

const statusConfig: Record<
    AttendanceStatus,
    {
        label: string;
        icon: React.ReactNode;
        color: string;
        bgColor: string;
        textColor: string;
        shortLabel: string;
    }
> = {
    present: {
        label: 'Present',
        shortLabel: 'Present',
        icon: <Check className="mr-1 h-3 w-3" />,
        color: 'bg-green-500',
        bgColor: 'bg-green-50',
        textColor: 'text-green-700',
    },
    late: {
        label: 'Late',
        shortLabel: 'Late',
        icon: <Clock className="mr-1 h-3 w-3" />,
        color: 'bg-amber-500',
        bgColor: 'bg-amber-50',
        textColor: 'text-amber-700',
    },
    cleared: {
        label: 'Cleared',
        shortLabel: 'Cleared',
        icon: <CheckCircle className="mr-1 h-3 w-3" />,
        color: 'bg-blue-500',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-700',
    },
    absent: {
        label: 'Absent',
        shortLabel: 'Absent',
        icon: <X className="mr-1 h-3 w-3" />,
        color: 'bg-red-500',
        bgColor: 'bg-red-50',
        textColor: 'text-red-700',
    },
};

const isValidStatus = (s: unknown): s is AttendanceStatus =>
    s === 'present' || s === 'absent' || s === 'late' || s === 'cleared';

interface EventDTO {
    id: number;
    name: string;
    date: string;
    type: string;
    location: string;
}

interface CompanyRow {
    id: number;
    name: string;
    logo: string | null;
    pivot: {
        event_id: number;
        company_id: number;
        status: string | null;
    };
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedCompanies {
    data: CompanyRow[];
    links: PaginationLink[];
    current_page: number;
    from: number | null;
    last_page: number;
    per_page: number;
    to: number | null;
    total: number;
}

interface Props {
    event: EventDTO;
    companies: PaginatedCompanies;
    filters: {
        search: string;
    };
}

const storageKey = (eventId: number) => `event-attendance-draft:${eventId}`;

type DraftState = {
    attendance: Record<number, AttendanceStatus>;
    updatedAt: number;
};

function loadDraft(eventId: number): DraftState | null {
    try {
        const raw = localStorage.getItem(storageKey(eventId));
        if (!raw) return null;
        return JSON.parse(raw) as DraftState;
    } catch {
        return null;
    }
}

function saveDraft(eventId: number, state: DraftState) {
    try {
        localStorage.setItem(storageKey(eventId), JSON.stringify(state));
    } catch {
        // ignore
    }
}

function clearDraft(eventId: number) {
    try {
        localStorage.removeItem(storageKey(eventId));
    } catch {
        // ignore
    }
}

export default function EventShow({ event, companies, filters }: Props) {
    const [isEditing, setIsEditing] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);

    // search input state with debounce
    const [search, setSearch] = useState(filters.search ?? '');
    const searchTimeoutRef = useRef<NodeJS.Timeout>();

    // attendance map persisted across pagination
    const [attendance, setAttendance] = useState<
        Record<number, AttendanceStatus>
    >({});

    // selection for bulk actions
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    // Initialize / merge attendance
    useEffect(() => {
        const draft = loadDraft(event.id);
        const next: Record<number, AttendanceStatus> = {
            ...(draft?.attendance ?? {}),
        };

        // Ensure current page companies are present in the map
        for (const c of companies.data ?? []) {
            if (next[c.id] == null) {
                const s = c.pivot?.status;
                next[c.id] = isValidStatus(s) ? s : 'absent';
            }
        }

        setAttendance(next);
        saveDraft(event.id, { attendance: next, updatedAt: Date.now() });
        setSelectedIds([]);
    }, [event.id, companies.data]);

    // Handle search with debounce
    const handleSearchChange = useCallback(
        (value: string) => {
            setSearch(value);

            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }

            setSearchLoading(true);
            searchTimeoutRef.current = setTimeout(() => {
                router.get(
                    `/events/${event.id}`,
                    { search: value, page: 1 },
                    {
                        preserveScroll: true,
                        preserveState: true,
                        replace: true,
                        onFinish: () => setSearchLoading(false),
                    },
                );
            }, 300);
        },
        [event.id],
    );

    const clearSearch = () => {
        setSearch('');
        router.get(
            `/events/${event.id}`,
            { page: 1 },
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            },
        );
    };

    const pageIds = useMemo(
        () => (companies.data ?? []).map((c) => c.id),
        [companies.data],
    );

    const allSelected =
        selectedIds.length > 0 && selectedIds.length === pageIds.length;

    const toggleSelect = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
        );
    };

    const selectAllOnPage = () => setSelectedIds(pageIds);
    const clearSelectionState = () => setSelectedIds([]);

    const setRowStatus = (companyId: number, status: AttendanceStatus) => {
        if (!isEditing) return;

        setAttendance((prev) => {
            const next = { ...prev, [companyId]: status };
            saveDraft(event.id, { attendance: next, updatedAt: Date.now() });
            return next;
        });
    };

    const applyBulkStatus = (status: AttendanceStatus) => {
        if (!isEditing) return;

        const target = selectedIds.length > 0 ? selectedIds : pageIds;

        setAttendance((prev) => {
            const next = { ...prev };
            target.forEach((id) => {
                next[id] = status;
            });
            saveDraft(event.id, { attendance: next, updatedAt: Date.now() });
            return next;
        });
    };

    const goTo = (url: string | null) => {
        if (!url) return;
        router.get(
            url,
            {},
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleCancelEditing = () => {
        clearDraft(event.id);
        const next: Record<number, AttendanceStatus> = {};
        for (const c of companies.data ?? []) {
            const s = c.pivot?.status;
            next[c.id] = isValidStatus(s) ? s : 'absent';
        }
        setAttendance(next);
        saveDraft(event.id, { attendance: next, updatedAt: Date.now() });

        setIsEditing(false);
        setSelectedIds([]);
    };

    const handleSave = () => {
        const payload = {
            event_id: event.id,
            attendance: Object.entries(attendance).map(
                ([companyId, status]) => ({
                    company_id: Number(companyId),
                    status,
                }),
            ),
        };

        setProcessing(true);

        router.post(`/events/${event.id}/attendance`, payload, {
            preserveScroll: true,
            onSuccess: () => {
                clearDraft(event.id);
                router.reload({ only: ['companies', 'event', 'filters'] });
            },
            onFinish: () => {
                setProcessing(false);
                setIsEditing(false);
                setSelectedIds([]);
            },
            onError: () => {
                setProcessing(false);
            },
        });
    };

    const exportCsv = () => {
        const rows = [
            ['Company', 'Status', 'ID', 'Date'],
            ...(companies.data ?? []).map((c) => [
                c.name,
                attendance[c.id] ?? 'absent',
                c.id,
                new Date().toISOString().split('T')[0],
            ]),
        ];
        const csv = rows.map((r) => r.join(',')).join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `attendance-${event.name.replace(/\s+/g, '-').toLowerCase()}-${
            new Date().toISOString().split('T')[0]
        }.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    // Calculate stats
    const stats = useMemo(() => {
        const values = Object.values(attendance);
        return {
            present: values.filter((s) => s === 'present').length,
            late: values.filter((s) => s === 'late').length,
            cleared: values.filter((s) => s === 'cleared').length,
            absent: values.filter((s) => s === 'absent').length,
        };
    }, [attendance]);


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
        <TooltipProvider>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title={`${event.name} Attendance`} />

                <div className="px-4 py-6">
                    {/* Sticky Header */}
                    <div className="sticky top-0 z-30 bg-white/95 px-4 py-3">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0 flex-1">
                                <h1 className="text-lg font-bold text-gray-900">
                                    {event.name}
                                </h1>
                                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="h-3.5 w-3.5" />
                                        <span>
                                            {new Date(
                                                event.date,
                                            ).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                            })}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="h-3.5 w-3.5" />
                                        <span className="max-w-[200px] truncate">
                                            {event.location}
                                        </span>
                                    </div>

                                    <Badge
                                        variant="secondary"
                                        className="text-xs"
                                    >
                                        {event.type}
                                    </Badge>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 sm:items-end">
                                <div className="flex items-center gap-2">
                                    {isEditing ? (
                                        <>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8 px-3"
                                                onClick={handleCancelEditing}
                                                disabled={processing}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                size="sm"
                                                className="h-8 bg-green-600 px-3 hover:bg-green-700"
                                                onClick={handleSave}
                                                disabled={processing}
                                            >
                                                {processing ? (
                                                    <>
                                                        <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                                                        Saving...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Check className="mr-1.5 h-3.5 w-3.5" />
                                                        Save Changes
                                                    </>
                                                )}
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button
                                                size="sm"
                                                className="h-8 bg-blue-600 px-3 hover:bg-blue-700"
                                                onClick={() =>
                                                    setIsEditing(true)
                                                }
                                            >
                                                <Edit className="mr-1.5 h-3.5 w-3.5" />
                                                Edit Attendance
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8 px-3"
                                                onClick={exportCsv}
                                            >
                                                <Download className="mr-1.5 h-3.5 w-3.5" />
                                                Export CSV
                                            </Button>
                                        </>
                                    )}
                                </div>

                                {/* Stats Summary */}
                                <div className="flex flex-wrap items-center gap-2">
                                    {attendanceStatuses.map((status) => {
                                        const config = statusConfig[status];
                                        return (
                                            <div
                                                key={status}
                                                className="flex items-center gap-1.5 rounded-lg bg-gray-100 px-2 py-1"
                                            >
                                                <div
                                                    className={`h-2 w-2 rounded-full ${config.color}`}
                                                />
                                                <span className="text-xs font-medium text-gray-700">
                                                    {config.shortLabel}
                                                </span>
                                                <span className="text-xs font-bold text-gray-900">
                                                    {stats[status]}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="bg-gray-50/50 px-4 py-3">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="relative max-w-md flex-1">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <input
                                    value={search}
                                    onChange={(e) =>
                                        handleSearchChange(e.target.value)
                                    }
                                    placeholder="Search companies by name..."
                                    className="w-full rounded-lg bg-white py-2 pr-10 pl-10 text-sm placeholder-gray-500 ring-1 ring-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {searchLoading ? (
                                    <Loader2 className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 animate-spin text-gray-400" />
                                ) : search ? (
                                    <button
                                        onClick={clearSearch}
                                        className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <FilterX className="h-4 w-4" />
                                    </button>
                                ) : null}
                            </div>

                            {isEditing && (
                                <div className="flex flex-wrap items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 px-3 text-xs"
                                        onClick={
                                            allSelected
                                                ? clearSelectionState
                                                : selectAllOnPage
                                        }
                                        disabled={pageIds.length === 0}
                                    >
                                        {allSelected
                                            ? 'Unselect All'
                                            : 'Select All'}
                                    </Button>

                                    {selectedIds.length > 0 && (
                                        <span className="text-sm text-gray-600">
                                            {selectedIds.length} selected
                                        </span>
                                    )}

                                    <div className="flex items-center gap-1">
                                        {attendanceStatuses.map((status) => {
                                            const config = statusConfig[status];
                                            return (
                                                <Tooltip key={status}>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className={`h-8 px-3 text-xs ${config.textColor} hover:${config.bgColor}`}
                                                            onClick={() =>
                                                                applyBulkStatus(
                                                                    status,
                                                                )
                                                            }
                                                        >
                                                            {config.icon}
                                                            {config.shortLabel}
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>
                                                            Mark{' '}
                                                            {selectedIds.length >
                                                            0
                                                                ? 'selected'
                                                                : 'all'}{' '}
                                                            as {config.label}
                                                        </p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Table Container */}
                    <div className="px-4">
                        <div className="overflow-hidden">
                            {/* PROPER HTML TABLE */}
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-100">
                                        {isEditing && (
                                            <th className="px-4 py-3 text-left">
                                                <input
                                                    type="checkbox"
                                                    disabled={
                                                        pageIds.length === 0
                                                    }
                                                    checked={allSelected}
                                                    onChange={() =>
                                                        allSelected
                                                            ? clearSelectionState()
                                                            : selectAllOnPage()
                                                    }
                                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                            </th>
                                        )}
                                        <th className="px-4 py-3 text-left">
                                            <span className="text-sm font-semibold text-gray-700">
                                                Company Name
                                            </span>
                                        </th>
                                        <th className="px-4 py-3 text-right">
                                            <span className="text-sm font-semibold text-gray-700">
                                                Status
                                            </span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/60">
                                    {(companies.data ?? []).length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={isEditing ? 3 : 2}
                                                className="px-4 py-16 text-center"
                                            >
                                                <div className="flex flex-col items-center justify-center gap-3 text-gray-500">
                                                    <Search className="h-10 w-10" />
                                                    <p className="text-base font-medium">
                                                        No companies found
                                                    </p>
                                                    {search && (
                                                        <button
                                                            onClick={
                                                                clearSearch
                                                            }
                                                            className="text-sm font-medium text-blue-600 hover:text-blue-700"
                                                        >
                                                            Clear search
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        companies.data.map((company, index) => {
                                            const rowStatus =
                                                attendance[company.id] ??
                                                'absent';
                                            const config =
                                                statusConfig[rowStatus];

                                            return (
                                                <tr key={company.id}>
                                                    {isEditing && (
                                                        <td className="px-4 py-3 align-middle">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedIds.includes(
                                                                    company.id,
                                                                )}
                                                                onChange={() =>
                                                                    toggleSelect(
                                                                        company.id,
                                                                    )
                                                                }
                                                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                            />
                                                        </td>
                                                    )}
                                                    <td className="px-4 py-3 align-middle">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex-shrink-0">
                                                                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 ring-1 ring-gray-200">
                                                                    {company.logo ? (
                                                                        <img
                                                                            className="h-full w-full object-cover"
                                                                            src={`/storage/${company.logo}`}
                                                                            alt={
                                                                                company.name
                                                                            }
                                                                        />
                                                                    ) : (
                                                                        <Building className="h-5 w-5 text-gray-600" />
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="min-w-0 flex-1">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="truncate text-base font-medium text-gray-900">
                                                                        {
                                                                            company.name
                                                                        }
                                                                    </span>
                                                                    <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500">
                                                                        #
                                                                        {
                                                                            company.id
                                                                        }
                                                                    </span>
                                                                </div>
                                                                {!isEditing && (
                                                                    <div className="mt-1">
                                                                        <Badge
                                                                            variant="secondary"
                                                                            className={`px-2 py-0.5 text-xs ${config.bgColor} ${config.textColor} border-transparent`}
                                                                        >
                                                                            {
                                                                                config.icon
                                                                            }
                                                                            {
                                                                                config.label
                                                                            }
                                                                        </Badge>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-right align-middle">
                                                        {isEditing ? (
                                                            <div className="flex items-center justify-end gap-1">
                                                                {attendanceStatuses.map(
                                                                    (
                                                                        status,
                                                                    ) => {
                                                                        const sConfig =
                                                                            statusConfig[
                                                                                status
                                                                            ];
                                                                        const active =
                                                                            rowStatus ===
                                                                            status;

                                                                        return (
                                                                            <Tooltip
                                                                                key={
                                                                                    status
                                                                                }
                                                                            >
                                                                                <TooltipTrigger
                                                                                    asChild
                                                                                >
                                                                                    <Button
                                                                                        variant={
                                                                                            active
                                                                                                ? 'default'
                                                                                                : 'outline'
                                                                                        }
                                                                                        size="sm"
                                                                                        className={`h-8 px-2.5 text-xs ${active ? sConfig.bgColor + ' ' + sConfig.textColor : ''}`}
                                                                                        onClick={() =>
                                                                                            setRowStatus(
                                                                                                company.id,
                                                                                                status,
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            sConfig.icon
                                                                                        }
                                                                                        {
                                                                                            sConfig.shortLabel
                                                                                        }
                                                                                    </Button>
                                                                                </TooltipTrigger>
                                                                                <TooltipContent>
                                                                                    <p>
                                                                                        Mark
                                                                                        as{' '}
                                                                                        {
                                                                                            sConfig.label
                                                                                        }
                                                                                    </p>
                                                                                </TooltipContent>
                                                                            </Tooltip>
                                                                        );
                                                                    },
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div className="flex justify-end">
                                                                <Badge
                                                                    variant="secondary"
                                                                    className={`px-3 py-1 text-sm ${config.bgColor} ${config.textColor} border-transparent`}
                                                                >
                                                                    {
                                                                        config.icon
                                                                    }
                                                                    {
                                                                        config.label
                                                                    }
                                                                </Badge>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination */}
                    {companies.total > 0 && (
                        <div className="sticky bottom-0 border-t border-gray-100 bg-white/95 px-4 py-4 backdrop-blur-sm">
                            <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
                                <div className="text-sm text-gray-600">
                                    Showing{' '}
                                    <span className="font-semibold">
                                        {companies.from ?? 0}
                                    </span>{' '}
                                    to{' '}
                                    <span className="font-semibold">
                                        {companies.to ?? 0}
                                    </span>{' '}
                                    of{' '}
                                    <span className="font-semibold">
                                        {companies.total}
                                    </span>{' '}
                                    companies
                                </div>

                                <div className="flex items-center gap-1">
                                    {companies.links.map((link, idx) => {
                                        const label = link.label
                                            .replace(/&laquo;|&raquo;/g, '')
                                            .trim();
                                        const isEllipsis = label === '...';
                                        const isPrevious =
                                            label.includes('Previous');
                                        const isNext = label.includes('Next');

                                        if (isEllipsis) {
                                            return (
                                                <span
                                                    key={idx}
                                                    className="px-2 py-1 text-sm text-gray-400"
                                                >
                                                    ...
                                                </span>
                                            );
                                        }

                                        return (
                                            <Tooltip key={idx}>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant={
                                                            link.active
                                                                ? 'default'
                                                                : 'outline'
                                                        }
                                                        size="sm"
                                                        className="h-8 min-w-[2.5rem] px-3"
                                                        disabled={!link.url}
                                                        onClick={() =>
                                                            goTo(link.url)
                                                        }
                                                    >
                                                        {isPrevious ? (
                                                            <>
                                                                <ChevronLeft className="mr-1 h-4 w-4" />
                                                                Previous
                                                            </>
                                                        ) : isNext ? (
                                                            <>
                                                                Next
                                                                <ChevronRight className="ml-1 h-4 w-4" />
                                                            </>
                                                        ) : (
                                                            label || ' '
                                                        )}
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>
                                                        {link.active
                                                            ? 'Current page'
                                                            : link.url
                                                              ? `Go to page ${label}`
                                                              : 'Disabled'}
                                                    </p>
                                                </TooltipContent>
                                            </Tooltip>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Draft Mode Helper */}
                    {isEditing && (
                        <div className="bg-blue-50/80 px-4 py-3">
                            <div className="flex items-center gap-2">
                                <Info className="h-4 w-4 text-blue-600" />
                                <div className="text-sm text-blue-800">
                                    <span className="font-semibold">
                                        Draft mode active:
                                    </span>{' '}
                                    Your changes are saved locally. Click{' '}
                                    <span className="font-bold">
                                        "Save Changes"
                                    </span>{' '}
                                    to update the server.
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </AppLayout>
        </TooltipProvider>
    );
}
