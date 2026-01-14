import { Company } from '@/types/models/Company';
import { AttendanceStatus } from '@/types/models/Attendance';

export interface Event {
    id: number;
    name: string;
    date: string;
    type: 'Online' | 'Face to Face';
    location: string;
    company_ids: string[];
    companies?: Company[];
    created_at: string;
    updated_at: string;
    attendance_status: AttendanceStatus | null
}
