export const ATTENDANCE_STATUSES = [
    'present',
    'absent',
    'late',
    'clearing',
] as const;

export type AttendanceStatus = typeof ATTENDANCE_STATUSES[number];

export interface Attendance {
    id: number;
    company_id: number;
    status: AttendanceStatus
}

