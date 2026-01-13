import { User } from '@/types';
import { OnboardingChecklist } from '@/types/models/OnboardingChecklist';
import { Media } from '@/types/models/Media';

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
}

export type OwnerPayload = Pick<User, 'name' | 'email' | 'phone' | 'facebook' | 'birthdate' | 'address' | 'profile_picture'>

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
> & {
    sponsor_id: string;
    coach_id: string;
    logo: File | Media | null;
    owners: OwnerPayload[];
};
