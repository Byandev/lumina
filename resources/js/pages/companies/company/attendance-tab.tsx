import CompanyLayout from '@/pages/companies/company/company-layout';

// Define interfaces in this file
interface Event {
    id: number;
    name: string;
    date: string;
    type: string;
    location: string;
    description?: string;
    created_at?: string;
    updated_at?: string;
}

interface Attendance {
    company_id: number;
    event_id: number;
    status: string;
    created_at: string | null;
    updated_at: string | null;
    event: Event;
}

interface Company {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    logo: string | null;
    logo_url?: string;
    owner_photo: string | null;
    status: string;
    notarization_status: string;
    erp_status: string;
    sales_activity: string;
    level: string;
    sponsor_id: number | null;
    coach_id: number | null;
    checklist_percentage?: number;
    created_at: string;
    updated_at: string;
    attendances?: Attendance[];
    // Add other company properties as needed
    sponsor?: {
        id: number;
        name: string;
    };
    owners?: Array<{
        id: number;
        name: string;
        email: string;
        phone?: string;
        facebook?: string;
        address?: string;
        birthdate?: string;
    }>;
}

interface AttendanceProps {
    company: Company;
}

export default function AttendanceTab({ company }: AttendanceProps) {
    // Cast attendances to the correct type
    const attendances = (company.attendances as Attendance[]) || [];

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch {
            return 'Invalid Date';
        }
    };

    const formatStatus = (status: string) => {
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    const getStatusColor = (status: string) => {
        const lowerStatus = status.toLowerCase();

        if (['present', 'attended', 'confirmed'].includes(lowerStatus)) {
            return 'bg-green-100 text-green-800';
        }
        if (['absent', 'no_show', 'cancelled'].includes(lowerStatus)) {
            return 'bg-red-100 text-red-800';
        }
        if (['pending', 'waiting', 'tentative'].includes(lowerStatus)) {
            return 'bg-yellow-100 text-yellow-800';
        }
        return 'bg-gray-100 text-gray-800';
    };

    // Calculate statistics
    const presentCount = attendances.filter((a) =>
        ['present', 'attended'].includes(a.status.toLowerCase()),
    ).length;

    const absentCount = attendances.filter((a) =>
        ['absent', 'no_show'].includes(a.status.toLowerCase()),
    ).length;

    return (
        <CompanyLayout company={company} title={`${company.name} - Attendance`}>
            <div className="space-y-6">
                <div className="rounded-lg border border-gray-200 bg-white p-6">
                    <div className="mb-6 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Attendance Overview
                        </h3>
                        <div className="text-sm text-gray-500">
                            Total Events: {attendances.length}
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                                    >
                                        Event Name
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                                    >
                                        Date & Time
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                                    >
                                        Type
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                                    >
                                        Location
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                                    >
                                        Status
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                                    >
                                        Updated
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {attendances.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-6 py-8 text-center text-gray-500"
                                        >
                                            No attendance records found
                                        </td>
                                    </tr>
                                ) : (
                                    attendances.map((attendance, index) => (
                                        <tr
                                            key={`${attendance.event_id}-${attendance.company_id}-${index}`}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="font-medium text-gray-900">
                                                    {attendance.event?.name ||
                                                        'N/A'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-gray-900">
                                                    {attendance.event?.date
                                                        ? formatDate(
                                                              attendance.event
                                                                  .date,
                                                          )
                                                        : 'N/A'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-gray-900">
                                                    {attendance.event?.type ||
                                                        'N/A'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="max-w-xs truncate text-gray-900">
                                                    {attendance.event
                                                        ?.location || 'N/A'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(attendance.status)}`}
                                                >
                                                    {formatStatus(
                                                        attendance.status,
                                                    )}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                                                {attendance.updated_at
                                                    ? formatDate(
                                                          attendance.updated_at,
                                                      )
                                                    : 'Never'}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Attendance Statistics */}
                    {attendances.length > 0 && (
                        <div className="mt-6 border-t border-gray-200 pt-6">
                            <h4 className="mb-4 text-sm font-semibold text-gray-900">
                                Attendance Statistics
                            </h4>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div className="rounded-lg bg-gradient-to-r from-green-50 to-green-100 p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-green-800">
                                                Present
                                            </p>
                                            <p className="text-2xl font-bold text-green-900">
                                                {presentCount}
                                            </p>
                                        </div>
                                        <div className="text-green-600">
                                            {attendances.length > 0
                                                ? `${Math.round((presentCount / attendances.length) * 100)}%`
                                                : '0%'}
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-lg bg-gradient-to-r from-red-50 to-red-100 p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-red-800">
                                                Absent
                                            </p>
                                            <p className="text-2xl font-bold text-red-900">
                                                {absentCount}
                                            </p>
                                        </div>
                                        <div className="text-red-600">
                                            {attendances.length > 0
                                                ? `${Math.round((absentCount / attendances.length) * 100)}%`
                                                : '0%'}
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-blue-800">
                                                Total Events
                                            </p>
                                            <p className="text-2xl font-bold text-blue-900">
                                                {attendances.length}
                                            </p>
                                        </div>
                                        <div className="text-blue-600">
                                            100%
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Attendance Progress Bar */}
                            {attendances.length > 0 && (
                                <div className="mt-4">
                                    <div className="mb-1 flex justify-between text-sm text-gray-600">
                                        <span>Attendance Rate</span>
                                        <span>
                                            {Math.round(
                                                (presentCount /
                                                    attendances.length) *
                                                    100,
                                            )}
                                            %
                                        </span>
                                    </div>
                                    <div className="h-2.5 w-full rounded-full bg-gray-200">
                                        <div
                                            className="h-2.5 rounded-full bg-green-600"
                                            style={{
                                                width: `${(presentCount / attendances.length) * 100}%`,
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </CompanyLayout>
    );
}
