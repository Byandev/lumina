import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import {
    Search,
    X,
    Loader2,
    Calendar,
    MapPin,
    Edit,
    Check,
    Clock,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Building,
    Info,
    Users,
    Download,
    MoreVertical,
} from 'lucide-react';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';

type AttendanceStatus = 'present' | 'absent' | 'late' | 'cleared';

const attendanceStatuses: AttendanceStatus[] = ['present', 'late', 'cleared', 'absent'];

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
        icon: <Check className="h-3 w-3" />,
        color: 'bg-green-500',
        bgColor: 'bg-green-50',
        textColor: 'text-green-700',
    },
    late: {
        label: 'Late',
        shortLabel: 'Late',
        icon: <Clock className="h-3 w-3" />,
        color: 'bg-amber-500',
        bgColor: 'bg-amber-50',
        textColor: 'text-amber-700',
    },
    cleared: {
        label: 'Cleared',
        shortLabel: 'Cleared',
        icon: <CheckCircle className="h-3 w-3" />,
        color: 'bg-blue-500',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-700',
    },
    absent: {
        label: 'Absent',
        shortLabel: 'Absent',
        icon: <X className="h-3 w-3" />,
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
    const [search, setSearch] = useState(filters.search ?? '');
    const searchTimeoutRef = useRef<NodeJS.Timeout>();
    const [attendance, setAttendance] = useState<Record<number, AttendanceStatus>>({});
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [showMobileActions, setShowMobileActions] = useState(false);

    // Initialize attendance
    useEffect(() => {
        const draft = loadDraft(event.id);
        const next: Record<number, AttendanceStatus> = { ...(draft?.attendance ?? {}) };

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

    // Search with debounce
    const handleSearchChange = useCallback(
        (value: string) => {
            setSearch(value);
            if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
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
        router.get(`/events/${event.id}`, { page: 1 }, { preserveScroll: true, preserveState: true, replace: true });
    };

    const pageIds = useMemo(() => (companies.data ?? []).map((c) => c.id), [companies.data]);
    const allSelected = selectedIds.length > 0 && selectedIds.length === pageIds.length;

    const toggleSelect = (id: number) => {
        setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
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
        setShowMobileActions(false);
    };

    const goTo = (url: string | null) => {
        if (!url) return;
        router.get(url, {}, { preserveScroll: true, preserveState: true, replace: true });
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
        setShowMobileActions(false);
    };

    const handleSave = () => {
        const payload = {
            event_id: event.id,
            attendance: Object.entries(attendance).map(([companyId, status]) => ({
                company_id: Number(companyId),
                status,
            })),
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
                setShowMobileActions(false);
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
        a.download = `attendance-${event.name.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

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
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${event.name} Attendance`} />

            <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/50 to-blue-50/30 p-3 sm:p-4 md:p-6">
                {/* Header - Compact */}
                <div className="mb-4 rounded-xl border border-gray-200 bg-white p-3 sm:p-4">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                            <div className="mb-2 flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-pink-100 via-blue-100 to-sky-100 sm:h-9 sm:w-9">
                                    <Calendar className="h-4 w-4 text-gray-700 sm:h-5 sm:w-5" />
                                </div>
                                <div>
                                    <h1 className="text-base font-bold text-gray-900 sm:text-lg">{event.name}</h1>
                                    <p className="text-xs text-gray-600 sm:text-sm">{event.type}</p>
                                </div>
                            </div>



                            <div className="hidden flex-wrap items-center gap-3 text-xs text-gray-600 sm:flex">
                                <div className="flex items-center gap-1.5">
                                    <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-pink-500 to-blue-500" />
                                    <span>
                                        {new Date(event.date).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                        })}
                                    </span>
                                </div>
                                <div className="h-3 w-px bg-gray-300" />
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="h-3.5 w-3.5" />
                                    <span className="max-w-[140px] truncate">{event.location}</span>
                                </div>
                                <div className="h-3 w-px bg-gray-300" />
                                <div className="flex items-center gap-1.5">
                                    <Users className="h-3.5 w-3.5" />
                                    <span>{companies.total} Companies</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                            <div className="hidden sm:flex">
                                {isEditing ? (
                                    <div className="flex items-center gap-2">
                                        <Button
                                            onClick={handleCancelEditing}
                                            disabled={processing}
                                            variant="outline"
                                            size="sm"
                                            className="h-8 px-3"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleSave}
                                            disabled={processing}
                                            size="sm"
                                            className="h-8 px-3"
                                        >
                                            {processing ? (
                                                <>
                                                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <Check className="mr-1 h-3 w-3" />
                                                    Save
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Button
                                            onClick={() => setIsEditing(true)}
                                            size="sm"
                                            className="h-8 px-3"
                                        >
                                            <Edit className="mr-1 h-3 w-3" />
                                            Edit Attendance
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* Mobile Actions */}
                            <div className="sm:hidden">
                                {isEditing ? (
                                    <div className="flex items-center gap-1">
                                        <Button
                                            onClick={handleCancelEditing}
                                            disabled={processing}
                                            size="sm"
                                            className="h-7 px-2 text-xs"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleSave}
                                            disabled={processing}
                                            size="sm"
                                            className="h-7 px-2 text-xs"
                                        >
                                            {processing ? (
                                                <Loader2 className="h-3 w-3 animate-spin" />
                                            ) : (
                                                'Save'
                                            )}
                                        </Button>
                                    </div>
                                ) : (
                                    <Button
                                        onClick={() => setIsEditing(true)}
                                        size="sm"
                                        className="h-7 px-2 text-xs"
                                    >
                                        <Edit className="mr-1 h-3 w-3" />
                                        Edit
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="mb-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            placeholder="Search companies..."
                            className=" rounded-lg border border-gray-300 bg-white py-2 pr-10 pl-10 text-sm placeholder-gray-400 focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100"
                        />
                        {searchLoading ? (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                            </div>
                        ) : search ? (
                            <button
                                onClick={clearSearch}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        ) : null}
                    </div>
                </div>

                {/* Mobile Bulk Actions */}
                {isEditing && (
                    <div className="mb-3 flex flex-wrap items-center gap-2 sm:hidden">
                        <button
                            onClick={allSelected ? clearSelectionState : selectAllOnPage}
                            disabled={pageIds.length === 0}
                            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700"
                        >
                            {allSelected ? 'Unselect All' : 'Select All'}
                        </button>
                        {selectedIds.length > 0 && (
                            <span className="text-xs text-gray-600">{selectedIds.length} selected</span>
                        )}
                        <button
                            onClick={() => setShowMobileActions(!showMobileActions)}
                            className="ml-auto rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700"
                        >
                            <MoreVertical className="h-4 w-4" />
                        </button>
                        {showMobileActions && (
                            <div className="absolute left-3 right-3 top-40 z-50 mt-1 grid grid-cols-2 gap-2 rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
                                {attendanceStatuses.map((status) => {
                                    const config = statusConfig[status];
                                    return (
                                        <button
                                            key={status}
                                            onClick={() => applyBulkStatus(status)}
                                            className={`rounded-lg px-3 py-2 text-xs font-medium ${config.bgColor} ${config.textColor}`}
                                        >
                                            <span className="flex items-center justify-center gap-1.5">
                                                {config.icon}
                                                {config.shortLabel}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* Desktop Bulk Actions */}
                {isEditing && (
                    <div className="mb-3 hidden items-center gap-2 sm:flex">
                        <button
                            onClick={allSelected ? clearSelectionState : selectAllOnPage}
                            disabled={pageIds.length === 0}
                            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                        >
                            {allSelected ? 'Unselect All' : 'Select All'}
                        </button>
                        {selectedIds.length > 0 && (
                            <span className="text-xs text-gray-600">{selectedIds.length} selected</span>
                        )}
                        <div className="ml-auto flex items-center gap-1">
                            {attendanceStatuses.map((status) => {
                                const config = statusConfig[status];
                                return (
                                    <button
                                        key={status}
                                        onClick={() => applyBulkStatus(status)}
                                        className={`rounded-lg border px-3 py-1.5 text-xs font-medium ${config.bgColor} ${config.textColor} hover:opacity-90`}
                                    >
                                        <span className="flex items-center gap-1.5">
                                            {config.icon}
                                            {config.shortLabel}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Table */}
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[300px]">
                            <thead className="bg-gradient-to-r from-pink-50 via-blue-50 to-sky-50">
                            <tr>
                                {isEditing && (
                                    <th className="w-10 px-4 py-2 text-left sm:px-6 sm:py-3">
                                        <input
                                            type="checkbox"
                                            disabled={pageIds.length === 0}
                                            checked={allSelected}
                                            onChange={() => (allSelected ? clearSelectionState() : selectAllOnPage())}
                                            className="h-3 w-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500 sm:h-4 sm:w-4"
                                        />
                                    </th>
                                )}
                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 sm:px-6 sm:py-3 sm:text-sm">
                                    Company
                                </th>
                                <th className="px-4 py-2 text-right text-xs font-semibold text-gray-700 sm:px-6 sm:py-3 sm:text-sm">
                                    Status
                                </th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                            {(companies.data ?? []).length === 0 ? (
                                <tr>
                                    <td colSpan={isEditing ? 3 : 2} className="px-4 py-8 text-center sm:px-6 sm:py-12">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Search className="h-8 w-8 text-gray-300 sm:h-10 sm:w-10" />
                                            <h3 className="text-sm font-semibold text-gray-900 sm:text-base">
                                                No companies found
                                            </h3>
                                            <p className="text-xs text-gray-600 sm:text-sm">
                                                {search ? `No results for "${search}"` : 'No companies assigned'}
                                            </p>
                                            {search && (
                                                <button
                                                    onClick={clearSearch}
                                                    className="mt-1 text-xs font-medium text-blue-600 hover:text-blue-800 sm:text-sm"
                                                >
                                                    Clear search
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                companies.data.map((company) => {
                                    const rowStatus = attendance[company.id] ?? 'absent';
                                    const config = statusConfig[rowStatus];

                                    return (
                                        <tr
                                            key={company.id}
                                            className="transition-colors hover:bg-gradient-to-r hover:from-pink-50/30 hover:via-blue-50/30 hover:to-sky-50/30"
                                        >
                                            {isEditing && (
                                                <td className="px-4 py-2 sm:px-6 sm:py-3">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedIds.includes(company.id)}
                                                        onChange={() => toggleSelect(company.id)}
                                                        className="h-3 w-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500 sm:h-4 sm:w-4"
                                                    />
                                                </td>
                                            )}
                                            <td className="px-4 py-2 sm:px-6 sm:py-3">
                                                <div className="flex items-center gap-2 sm:gap-3">
                                                    <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gradient-to-br from-pink-100 via-blue-100 to-sky-100 sm:h-10 sm:w-10">
                                                        {company.logo ? (
                                                            <img
                                                                src={company.logo.startsWith('http') ? company.logo : `/storage/${company.logo}`}
                                                                alt={company.name}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center">
                                                                <Building className="h-3 w-3 text-gray-700 sm:h-4 sm:w-4" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="max-w-[120px] truncate text-sm font-semibold text-gray-900 sm:max-w-none sm:text-base">
                                                            {company.name}
                                                        </div>
                                                        <div className="text-xs text-gray-500 sm:text-sm">ID: {company.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-2 text-right sm:px-6 sm:py-3">
                                                {isEditing ? (
                                                    <div className="flex justify-end gap-1">
                                                        {attendanceStatuses.map((status) => {
                                                            const sConfig = statusConfig[status];
                                                            const active = rowStatus === status;
                                                            return (
                                                                <button
                                                                    key={status}
                                                                    onClick={() => setRowStatus(company.id, status)}
                                                                    className={`rounded px-2 py-1 text-xs font-medium transition sm:rounded-lg sm:px-3 sm:py-1.5 sm:text-sm ${
                                                                        active
                                                                            ? `${sConfig.bgColor} ${sConfig.textColor}`
                                                                            : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                                                                    }`}
                                                                >
                                                                        <span className="flex items-center gap-1">
                                                                            {sConfig.icon}
                                                                            <span className="hidden sm:inline">{sConfig.shortLabel}</span>
                                                                        </span>
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                ) : (
                                                    <span
                                                        className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-semibold sm:px-3 sm:py-1.5 sm:text-sm ${config.bgColor} ${config.textColor}`}
                                                    >
                                                            {config.icon}
                                                        {config.label}
                                                        </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {companies.total > 0 && (
                        <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-200 bg-gradient-to-r from-pink-50/50 via-blue-50/50 to-sky-50/50 px-4 py-3 sm:flex-row sm:px-6">
                            <div className="text-xs text-gray-700 sm:text-sm">
                                Showing{' '}
                                <span className="font-semibold text-gray-900">{companies.from ?? 0}</span> to{' '}
                                <span className="font-semibold text-gray-900">{companies.to ?? 0}</span> of{' '}
                                <span className="font-semibold text-gray-900">{companies.total}</span> companies
                            </div>

                            <div className="flex items-center gap-1">
                                {companies.links.map((link, idx) => {
                                    const label = link.label.replace(/&laquo;|&raquo;/g, '').trim();
                                    const isEllipsis = label === '...';
                                    const isPrevious = link.label.includes('Previous');
                                    const isNext = link.label.includes('Next');

                                    if (isEllipsis) {
                                        return (
                                            <span key={idx} className="px-2 py-1 text-xs text-gray-400 sm:text-sm">
                                                ...
                                            </span>
                                        );
                                    }

                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => goTo(link.url)}
                                            disabled={!link.url}
                                            className={`rounded border px-2 py-1 text-xs font-medium transition sm:rounded-lg sm:px-3 sm:py-1.5 sm:text-sm ${
                                                link.active
                                                    ? 'border-transparent bg-gradient-to-r from-pink-500 via-blue-500 to-sky-500 text-white'
                                                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50'
                                            }`}
                                        >
                                            {isPrevious ? (
                                                <span className="flex items-center gap-1">
                                                    <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                                                    <span className="hidden sm:inline">Previous</span>
                                                </span>
                                            ) : isNext ? (
                                                <span className="flex items-center gap-1">
                                                    <span className="hidden sm:inline">Next</span>
                                                    <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                                                </span>
                                            ) : (
                                                label || ' '
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Draft Mode Notice */}
                {isEditing && (
                    <div className="mt-3 rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-sky-50 p-3 sm:rounded-xl sm:p-4">
                        <div className="flex items-start gap-2">
                            <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
                            <div className="text-xs text-blue-800 sm:text-sm">
                                <span className="font-semibold">Draft mode:</span> Changes saved locally. Click{' '}
                                <span className="font-bold">"Save"</span> to update server.
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
