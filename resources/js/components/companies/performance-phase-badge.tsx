import { startCase } from 'lodash';
import { useMemo } from 'react';

type CompanyPerformancePhase = 'scaling' | 'maintaining' | 'testing' | string;

const PerformancePhaseBadge = ({
    phase,
}: {
    phase: CompanyPerformancePhase;
}) => {
    const color = useMemo(() => {
        switch (phase?.toLowerCase()) {
            case 'scaling':
                return 'border-green-200 bg-green-50 text-green-700';
            case 'maintaining':
                return 'border-blue-200 bg-blue-50 text-blue-700';
            case 'testing':
                return 'border-amber-200 bg-amber-50 text-amber-700';
            default:
                return 'border-gray-200 bg-gray-50 text-gray-700';
        }
    }, [phase]);

    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold sm:text-[11px] ${color}`}
        >
            <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
            {startCase(phase)}
        </span>
    );
};

export default PerformancePhaseBadge;
