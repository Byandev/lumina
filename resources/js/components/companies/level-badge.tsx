import React, { useMemo } from 'react';
import { startCase } from 'lodash';

const LevelBadge = ({ level } : { level: string }) => {
    const color = useMemo(() => {
        switch (level?.toLowerCase()) {
            case 'educate':
                return 'border-yellow-200 bg-yellow-50 text-yellow-700';
            case 'empowerment':
                return 'border-gray-200 bg-gray-50 text-gray-700';
            case 'enterprise':
                return 'border-blue-200 bg-blue-50 text-blue-700';
            case 'exponential':
                return 'border-orange-200 bg-orange-50 text-orange-700';
            default:
                return 'border-gray-200 bg-gray-50 text-gray-700';
        }
    }, [level])

    return <span
        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold sm:text-[11px] ${color}`}
    >
                                <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
        {startCase(level)}
                            </span>
}

export default LevelBadge
