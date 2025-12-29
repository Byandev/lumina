import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { useMemo, useState, useEffect } from 'react';

interface Company {
    id: number;
    name: string;
    logo: string;
    pivot: {
        event_id: number;
        company_id: number;
        status: string | null;
    };
}

interface Event {
    id: number;
    name: string;
    date: string;
    type: string;
    location: string;
    companies: Company[];
}

interface Props {
    event: Event;
}

type AttendanceStatus = 'present' | 'absent' | 'late' | 'cleared';

interface AttendanceRecord {
    company_id: number;
    status: AttendanceStatus;
}

// Status configuration with compact icons
const statusConfig: Record<AttendanceStatus, {
    label: string;
    icon: string;
    activeClass: string;
    inactiveClass: string;
    badgeClass: string;
}> = {
    present: {
        label: 'Present',
        icon: '✓',
        activeClass: 'bg-green-100 text-green-800 border-green-300',
        inactiveClass: 'text-gray-600 hover:bg-green-50',
        badgeClass: 'bg-green-100 text-green-800',
    },
    absent: {
        label: 'Absent',
        icon: '✗',
        activeClass: 'bg-red-100 text-red-800 border-red-300',
        inactiveClass: 'text-gray-600 hover:bg-red-50',
        badgeClass: 'bg-red-100 text-red-800',
    },
    late: {
        label: 'Late',
        icon: '⏰',
        activeClass: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        inactiveClass: 'text-gray-600 hover:bg-yellow-50',
        badgeClass: 'bg-yellow-100 text-yellow-800',
    },
    cleared: {
        label: 'Cleared',
        icon: '✓✓',
        activeClass: 'bg-blue-100 text-blue-800 border-blue-300',
        inactiveClass: 'text-gray-600 hover:bg-blue-50',
        badgeClass: 'bg-blue-100 text-blue-800',
    },
};

export default function EventAttendancePage({ event }: Props) {
    const [isEditing, setIsEditing] = useState(false);
    const [processing, setProcessing] = useState(false);

    // Initialize attendance from existing pivot data
    const [attendance, setAttendance] = useState<Record<number, AttendanceStatus>>(() => {
        const initial: Record<number, AttendanceStatus> = {};
        event.companies?.forEach((company) => {
            const existingStatus = company.pivot?.status;

            if (existingStatus && ['present', 'absent', 'late', 'cleared'].includes(existingStatus)) {
                initial[company.id] = existingStatus as AttendanceStatus;
            } else {
                initial[company.id] = 'absent';
            }
        });
        return initial;
    });

    // Update attendance when event data changes
    useEffect(() => {
        const newAttendance: Record<number, AttendanceStatus> = {};
        event.companies?.forEach((company) => {
            const existingStatus = company.pivot?.status;

            if (existingStatus && ['present', 'absent', 'late', 'cleared'].includes(existingStatus)) {
                newAttendance[company.id] = existingStatus as AttendanceStatus;
            } else {
                newAttendance[company.id] = 'absent';
            }
        });
        setAttendance(newAttendance);
    }, [event.companies]);

    const handleAttendanceChange = (companyId: number, status: AttendanceStatus) => {
        if (!isEditing) return;
        setAttendance((prev) => ({ ...prev, [companyId]: status }));
    };

    const handleSaveAttendance = () => {
        const payload: AttendanceRecord[] = Object.entries(attendance).map(
            ([companyId, status]) => ({
                company_id: Number(companyId),
                status,
            })
        );

        setProcessing(true);

        router.post(
            `/events/${event.id}/attendance `,
            {
                event_id: event.id,
                attendance: payload,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    router.reload({ only: ['event'] });
                },
                onFinish: () => {
                    setProcessing(false);
                    setIsEditing(false);
                },
                onError: () => {
                    setProcessing(false);
                },
            }
        );
    };

    const stats = useMemo(() => {
        const v = Object.values(attendance);
        return {
            present: v.filter((s) => s === 'present').length,
            absent: v.filter((s) => s === 'absent').length,
            late: v.filter((s) => s === 'late').length,
            cleared: v.filter((s) => s === 'cleared').length,
        };
    }, [attendance]);

    const attendanceStatuses: AttendanceStatus[] = ['present', 'absent', 'late', 'cleared'];

    return (
        <AppLayout>
            <Head title={`${event.name} Attendance`} />

            <div className="min-h-screen bg-gray-50 p-3">
                <div className="mx-auto space-y-4">
                    {/* Compact Header */}
                    <div className="rounded border border-gray-200 bg-white p-3">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="min-w-0 flex-1">
                                <h1 className="truncate text-lg font-semibold text-gray-900">{event.name}</h1>
                                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-600">
                                    <span className="flex items-center gap-1">
                                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                        </svg>
                                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                        </svg>
                                        <span className="truncate max-w-[120px]">{event.location}</span>
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                        {event.type}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {isEditing ? (
                                    <>
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            disabled={processing}
                                            className="rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSaveAttendance}
                                            disabled={processing}
                                            className="rounded bg-green-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
                                        >
                                            {processing ? (
                                                <span className="flex items-center gap-1">
                                                    <svg className="h-3 w-3 animate-spin" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                    </svg>
                                                    Saving
                                                </span>
                                            ) : 'Save'}
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="rounded bg-blue-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                                    >
                                        Edit
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Compact Stats */}
                        <div className="mt-3 grid grid-cols-4 gap-2">
                            {attendanceStatuses.map((status) => {
                                const config = statusConfig[status];
                                const count = stats[status];
                                return (
                                    <div key={status} className="rounded border border-gray-200 p-2 text-center">
                                        <div className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${config.badgeClass}`}>
                                            {config.icon}
                                        </div>
                                        <div className="mt-1 text-sm font-bold text-gray-900">{count}</div>
                                        <div className="text-xs text-gray-600">{config.label}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Compact Table */}
                    <div className="rounded border border-gray-200 bg-white">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-3 py-2 text-left text-xs font-medium uppercase text-gray-500">Company</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium uppercase text-gray-500">Actions</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                {event.companies?.map((company) => (
                                    <tr key={company.id} className="hover:bg-gray-50">
                                        <td className="px-3 py-2">
                                            <div className="flex items-center">
                                                <div className="h-6 w-6 flex-shrink-0">
                                                    {company.logo ? (
                                                        <img
                                                            className="h-6 w-6 rounded object-cover"
                                                            src={`/storage/${company.logo}`}
                                                            alt={company.name}
                                                        />
                                                    ) : (
                                                        <div className="flex h-6 w-6 items-center justify-center rounded bg-gradient-to-br from-blue-50 to-blue-100">
                                                            <span className="text-xs font-medium text-blue-600">
                                                                {company.name.charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="ml-2 min-w-0">
                                                    <div className="truncate text-sm font-medium text-gray-900 max-w-[150px]">
                                                        {company.name}
                                                    </div>
                                                    <div className="text-xs text-gray-500">#{company.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-2">
                                            <div className="flex gap-1">
                                                {attendanceStatuses.map((status) => {
                                                    const config = statusConfig[status];
                                                    const isActive = attendance[company.id] === status;
                                                    return (
                                                        <button
                                                            key={status}
                                                            disabled={!isEditing}
                                                            onClick={() => handleAttendanceChange(company.id, status)}
                                                            className={`rounded border px-2 py-1 text-xs font-medium transition-colors ${
                                                                isActive
                                                                    ? `${config.activeClass} border-2`
                                                                    : isEditing
                                                                        ? `border-gray-300 bg-white ${config.inactiveClass} hover:border-gray-400`
                                                                        : 'border-gray-200 bg-gray-50 text-gray-500'
                                                            } ${!isEditing ? 'cursor-default' : 'cursor-pointer'}`}
                                                            title={config.label}
                                                        >
                                                            {config.icon}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </td>
                                        <td className="px-3 py-2">
                                            <div className="flex gap-1">
                                                {isEditing && (
                                                    <button
                                                        onClick={() => handleAttendanceChange(company.id, 'absent')}
                                                        className="rounded border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
                                                    >
                                                        Reset
                                                    </button>
                                                )}
                                                <a
                                                    href={`/companies/${company.id}`}
                                                    className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200"
                                                >
                                                    View
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Compact Footer */}
                        <div className="border-t border-gray-200 bg-gray-50 px-3 py-2">
                            <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
                                <div className="text-xs text-gray-600">
                                    {event.companies?.length || 0} companies
                                </div>
                                <div className="flex flex-wrap items-center gap-1">
                                    {isEditing && (
                                        <>
                                            <button
                                                onClick={() => {
                                                    const newStatus: Record<number, AttendanceStatus> = {};
                                                    event.companies?.forEach((company) => {
                                                        newStatus[company.id] = 'present';
                                                    });
                                                    setAttendance(newStatus);
                                                }}
                                                className="inline-flex items-center gap-1 rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-700 hover:bg-green-200"
                                            >
                                                All Present
                                            </button>
                                            <button
                                                onClick={() => {
                                                    const newStatus: Record<number, AttendanceStatus> = {};
                                                    event.companies?.forEach((company) => {
                                                        newStatus[company.id] = 'absent';
                                                    });
                                                    setAttendance(newStatus);
                                                }}
                                                className="inline-flex items-center gap-1 rounded border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
                                            >
                                                Clear All
                                            </button>
                                        </>
                                    )}
                                    <button
                                        onClick={() => {
                                            const csvContent = [
                                                ['Company', 'Status'],
                                                ...(event.companies || []).map((company) => [
                                                    company.name,
                                                    attendance[company.id] || 'absent',
                                                ]),
                                            ]
                                                .map((row) => row.join(','))
                                                .join('\n');

                                            const blob = new Blob([csvContent], { type: 'text/csv' });
                                            const url = window.URL.createObjectURL(blob);
                                            const a = document.createElement('a');
                                            a.href = url;
                                            a.download = `attendance-${event.name.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.csv`;
                                            a.click();
                                        }}
                                        className="inline-flex items-center gap-1 rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 hover:bg-blue-200"
                                    >
                                        Export
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
