import React from 'react';
import { startCase } from 'lodash';
import { AttendanceStatus } from '@/types/models/Attendance';

const STATUS_STYLES: Record<AttendanceStatus, string> = {
    present: 'border-green-200 bg-green-50 text-green-700',
    late: 'border-yellow-200 bg-yellow-50 text-yellow-700',
    clearing: 'border-blue-200 bg-blue-50 text-blue-700',
    absent: 'border-red-200 bg-red-50 text-red-700',
};

type AttendanceBadgeProps = {
    status: AttendanceStatus | null;
};

const AttendanceBadge = ({ status }: AttendanceBadgeProps) => {
    if (!status) {
        return (
            <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-[10px] font-semibold text-gray-500 sm:text-[11px]">
                <span className="h-1.5 w-1.5 rounded-full bg-gray-400 opacity-60" />
                No Record
            </span>
        );
    }

    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold sm:text-[11px] ${
                STATUS_STYLES[status]
            }`}
        >
            <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
            {startCase(status)}
        </span>
    );
};

export default AttendanceBadge;
