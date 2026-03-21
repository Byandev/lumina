import AttendanceBadge from '@/components/events/attendance-badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    ATTENDANCE_STATUSES,
    AttendanceStatus,
} from '@/types/models/Attendance';
import { useForm } from '@inertiajs/react';
import { Check, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface Props {
    company_id: number;
    event_id: number;
    status: AttendanceStatus | null;
    onSuccess?: () => void;
}

const AttendanceSelector = ({
    company_id,
    event_id,
    status,
    onSuccess,
}: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const { data, post, processing } = useForm({
        company_id,
        event_id,
        status,
    });

    const getStatusLabel = (status: AttendanceStatus): string => {
        switch (status) {
            case 'present':
                return 'Present';
            case 'late':
                return 'Late';
            case 'clearing':
                return 'Clearing';
            case 'absent':
                return 'Absent';
            default:
                return status;
        }
    };

    const onSelect = (newStatus: AttendanceStatus) => {
        if (processing) return;

        data.status = newStatus;

        post('/attendances', {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setIsOpen(false);
                if (onSuccess) onSuccess();
            },
        });
    };

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger
                className="focus:outline-none"
                disabled={processing}
            >
                <div className="group flex items-center gap-1.5">
                    <AttendanceBadge status={status} size="md" />
                    <ChevronDown
                        className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                            isOpen ? 'rotate-180' : ''
                        } ${processing ? 'opacity-50' : ''}`}
                    />
                </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                className="min-w-[140px] border border-gray-200 bg-white p-1"
                align="start"
                sideOffset={5}
            >
                {ATTENDANCE_STATUSES.map((attendanceStatus) => {
                    const isSelected = status === attendanceStatus;

                    return (
                        <DropdownMenuItem
                            onClick={() => onSelect(attendanceStatus)}
                            key={attendanceStatus}
                            className={`cursor-pointer px-3 py-2 transition-colors duration-150 ${
                                isSelected ? 'bg-gray-50' : 'hover:bg-gray-50'
                            } ${processing ? 'cursor-not-allowed opacity-50' : ''}`}
                            disabled={processing}
                        >
                            <div className="flex w-full items-center justify-between">
                                <AttendanceBadge
                                    status={attendanceStatus}
                                    size="sm"
                                    showIcon={true}
                                />
                                {isSelected && (
                                    <Check className="h-3.5 w-3.5 text-pink-600" />
                                )}
                            </div>
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default AttendanceSelector;
