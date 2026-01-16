import { User } from '@/types';
import { OnboardingChecklist } from '@/types/models/OnboardingChecklist';
import { Media } from '@/types/models/Media';
import { AttendanceStatus } from '@/types/models/Attendance';

export interface Company {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
    address: string | null;
    logo: string | null;
    logo_url: string | null;
    owners_count: number;
    created_at: string;
    updated_at: string;
    sponsor?: Company;
    total_checklist_count: number;
    completed_checklist_count: number;
    checklist_progress: number;
    notarization_status?: string;
    status?: string;
    erp_status?: string;
    sales_activity?: string;
    level?: string;
    owners?: User[];
    onboarding_percentage?: number
    onboarding_checklists?: OnboardingChecklist[]
    company_logo?: Media
    coach_id: number | string | null;
    sponsor_id: number | string| null;
    attendance_status: AttendanceStatus | null
}

export type OwnerPayload = Pick<User, 'name' | 'email' | 'phone' | 'facebook' | 'birthdate' | 'address' | 'profile_picture'> & {
    new_profile_picture: File | Media | null;
    signature?: File | null
};

export type CompanyForm = Pick<
    Company,
    | 'name'
    | 'email'
    | 'phone'
    | 'address'
    | 'status'
    | 'level'
    | 'sales_activity'
    | 'notarization_status'
    | 'erp_status'
    | 'coach_id'
    | 'sponsor_id'
> & {
    new_logo: File | Media | null;
    logo: File | Media | null;
    owners: OwnerPayload[];
};
