import CompanyLayout from '@/pages/companies/company/company-layout';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Company } from '@/pages/companies/company/types';

interface Event {
    id: number;
    name: string;
    date: string;
    type: string;
    location: string;
    created_at: string;
    updated_at: string;
}

interface Attendance {
    company_id: number;
    event_id: number;
    status: string;
    created_at: string;
    updated_at: string;
    event: Event;
}

interface PaginatedResponse {
    current_page: number;
    data: Attendance[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

interface AttendanceProps {
    attendances: PaginatedResponse;
    company: Company
}

export default function AttendanceTab({ attendances, company }: AttendanceProps) {
    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch {
            return 'N/A';
        }
    };

    const getStatusColor = (status: string) => {
        const lowerStatus = status.toLowerCase();
        if (['present', 'attended', 'confirmed'].includes(lowerStatus))
            return 'bg-green-50 text-green-700';
        if (['absent', 'no_show', 'cancelled'].includes(lowerStatus))
            return 'bg-red-50 text-red-700';
        if (['pending', 'waiting', 'tentative'].includes(lowerStatus))
            return 'bg-yellow-50 text-yellow-700';
        return 'bg-gray-50 text-gray-700';
    };

    // Extract pagination links
    const prev = attendances.links[0];
    const next = attendances.links[attendances.links.length - 1];
    const pages = attendances.links.slice(1, -1);

    return (
        <CompanyLayout company={company}>
            <div className="">
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Attendance
                    </h3>
                </div>

                <div className="overflow-hidden">
                    <table className="w-full">
                        <thead>
                        <tr className="bg-gray-100 border-b border-gray-200">
                            <th className="px-3 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                Event
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                Date
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                Type
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                Location
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                Status
                            </th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                        {attendances.data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="px-3 py-8 text-center"
                                >
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="mb-2 rounded-full bg-gray-100 p-2">
                                            <svg
                                                className="h-5 w-5 text-gray-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                                />
                                            </svg>
                                        </div>
                                        <p className="text-sm text-gray-900">
                                            No attendance records
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            No events attended yet
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            attendances.data.map((attendance) => (
                                <tr
                                    key={`${attendance.event_id}-${attendance.company_id}`}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="px-3 py-3">
                                        <div className="text-sm font-medium text-gray-900">
                                            {attendance.event?.name ||
                                                'N/A'}
                                        </div>
                                    </td>
                                    <td className="px-3 py-3 whitespace-nowrap">
                                        <div className="text-sm text-gray-700">
                                            {attendance.event?.date
                                                ? formatDate(
                                                    attendance.event.date,
                                                )
                                                : 'N/A'}
                                        </div>
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className="text-sm text-gray-700">
                                            {attendance.event?.type ||
                                                'N/A'}
                                        </div>
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className="max-w-[120px] truncate text-sm text-gray-700">
                                            {attendance.event?.location ||
                                                'N/A'}
                                        </div>
                                    </td>
                                    <td className="px-3 py-3">
                                            <span
                                                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusColor(attendance.status)}`}
                                            >
                                                {attendance.status
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                    attendance.status.slice(1)}
                                            </span>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    {attendances.data.length > 0 && (
                        <div className="flex items-center justify-between border-t border-gray-200 px-3 py-3">
                            <div className="text-sm text-gray-700">
                                Showing {attendances.from} to {attendances.to} of {attendances.total} results
                            </div>

                            <div className="flex items-center gap-1">
                                {/* Previous */}
                                <Link
                                    href={prev.url || '#'}
                                    className={`inline-flex items-center rounded border border-gray-300 px-2 py-1.5 text-xs ${
                                        prev.url
                                            ? 'bg-white text-gray-700 hover:bg-gray-50'
                                            : 'pointer-events-none opacity-50'
                                    }`}
                                    preserveScroll
                                    preserveState
                                >
                                    <ChevronLeft className="h-3.5 w-3.5" />
                                </Link>

                                {/* Page Numbers */}
                                {pages.map((link, index) => {
                                    const label = link.label;

                                    // Ellipsis for truncated pages
                                    if (!/^\d+$/.test(label)) {
                                        return (
                                            <span
                                                key={`ellipsis-${index}`}
                                                className="px-2 py-1.5 text-xs text-gray-500"
                                            >
                                                <MoreHorizontal className="h-3.5 w-3.5" />
                                            </span>
                                        );
                                    }

                                    const pageNum = parseInt(label, 10);
                                    const isNear =
                                        Math.abs(pageNum - attendances.current_page) <= 1 ||
                                        pageNum === 1 ||
                                        pageNum === attendances.last_page;

                                    if (!isNear) return null;

                                    return (
                                        <Link
                                            key={`page-${pageNum}-${index}`}
                                            href={link.url || '#'}
                                            className={`inline-flex items-center rounded border px-2.5 py-1.5 text-xs ${
                                                link.active
                                                    ? 'border-transparent bg-gray-900 text-white'
                                                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                                            }`}
                                            preserveScroll
                                            preserveState
                                            aria-current={link.active ? 'page' : undefined}
                                        >
                                            {label}
                                        </Link>
                                    );
                                })}

                                {/* Next */}
                                <Link
                                    href={next.url || '#'}
                                    className={`inline-flex items-center rounded border border-gray-300 px-2 py-1.5 text-xs ${
                                        next.url
                                            ? 'bg-white text-gray-700 hover:bg-gray-50'
                                            : 'pointer-events-none opacity-50'
                                    }`}
                                    preserveScroll
                                    preserveState
                                >
                                    <ChevronRight className="h-3.5 w-3.5" />
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </CompanyLayout>
    );
}
