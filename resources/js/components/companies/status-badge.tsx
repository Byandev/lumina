import React, { useMemo } from 'react';
import { startCase } from 'lodash'
const StatusBadge = ({ status } : { status: string }) => {
    const color = useMemo<string>(() => {
        switch (status?.toLowerCase()) {
            case 'active':
            case 'completed':
            case 'done':
                return 'border-green-200 bg-green-50 text-green-700';
            case 'pending':
            case 'in_progress':
                return 'border-yellow-200 bg-yellow-50 text-yellow-700';
            case 'inactive':
            case 'failed':
            case 'terminated':
                return 'border-red-200 bg-red-50 text-red-700';
            default:
                return 'border-gray-200 bg-gray-50 text-gray-700';
        }
    }, [status])

    return  <span
        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold sm:text-[11px] ${color}`}
    >
                                <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
        {startCase(status)}
                            </span>
}

export default StatusBadge
