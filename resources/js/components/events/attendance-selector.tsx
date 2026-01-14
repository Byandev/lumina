
import { useForm } from '@inertiajs/react';
import AttendanceBadge from '@/components/events/attendance-badge';
import { ATTENDANCE_STATUSES, AttendanceStatus } from '@/types/models/Attendance';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Props {
    company_id: number;
    event_id: number;
    status: AttendanceStatus | null
}

const AttendanceSelector = ({ company_id, event_id, status}: Props) => {
    const { data, post } = useForm({
        company_id,
        event_id,
        status
    })

    const onSelect = (status: AttendanceStatus) => {
        data.status = status;

        post('/attendances')
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <AttendanceBadge status={status} />
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-24" align="start">
                {ATTENDANCE_STATUSES.map(status => <DropdownMenuItem
                        onClick={() => onSelect(status)}
                        key={status}>
                        <AttendanceBadge status={status}/>
                </DropdownMenuItem>) }
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default AttendanceSelector
