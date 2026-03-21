import { AttendanceStatus } from '@/types/models/Attendance';
import { startCase } from 'lodash';
import { AlertCircle, CheckCircle, Circle, Clock, XCircle } from 'lucide-react';
import React from 'react';

const STATUS_STYLES: Record<
    AttendanceStatus,
    {
        bg: string;
        text: string;
        border: string;
        icon: React.ElementType;
    }
> = {
    present: {
        bg: 'bg-green-50',
        text: 'text-green-700',
        border: 'border-green-200',
        icon: CheckCircle,
    },
    late: {
        bg: 'bg-yellow-50',
        text: 'text-yellow-700',
        border: 'border-yellow-200',
        icon: Clock,
    },
    clearing: {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        icon: AlertCircle,
    },
    absent: {
        bg: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-200',
        icon: XCircle,
    },
};

type AttendanceBadgeProps = {
    status: AttendanceStatus | null;
    size?: 'sm' | 'md';
    showIcon?: boolean;
};

const AttendanceBadge = ({
    status,
    size = 'md',
    showIcon = true,
}: AttendanceBadgeProps) => {
    if (!status) {
        const sizeClasses = {
            sm: 'px-2 py-0.5 text-[10px] gap-1',
            md: 'px-2.5 py-1 text-xs gap-1.5',
        };

        return (
            <span
                className={`inline-flex items-center rounded-full ${sizeClasses[size]} border border-gray-200 bg-gray-50 font-medium text-gray-500`}
            >
                {showIcon && (
                    <Circle
                        className={`${size === 'sm' ? 'h-2.5 w-2.5' : 'h-3 w-3'} text-gray-400`}
                    />
                )}
                <span>No Record</span>
            </span>
        );
    }

    const config = STATUS_STYLES[status];
    const Icon = config.icon;

    const sizeClasses = {
        sm: 'px-2 py-0.5 text-[10px] gap-1',
        md: 'px-2.5 py-1 text-xs gap-1.5',
    };

    const iconSizes = {
        sm: 'h-2.5 w-2.5',
        md: 'h-3 w-3',
    };

    return (
        <span
            className={`inline-flex items-center rounded-full ${sizeClasses[size]} border font-medium ${config.bg} ${config.text} ${config.border}`}
        >
            {showIcon && <Icon className={iconSizes[size]} />}
            {startCase(status)}
        </span>
    );
};

export default AttendanceBadge;
