import Attendance from '@/routes/attendance';

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface ChecklistItem {
    id: number;
    title: string;
    is_completed: boolean;
}

export interface Owner {
    id: number;
    name: string;
    email: string;
    photo: string | null;
    phone?: string;
    facebook?: string;
    address?: string;
    birthdate?: string;
}

export interface Coach {
    id: number;
    name: string;
    photo?: string | null;
    photo_url?: string | null;
}

export interface Sponsor {
    id?: number | null;
    name: string;
    logo: string;
}

export interface Event {
    id: number;
    name: string;
    date: string;
    type: string;
    location: string;
    companies: Company[];
}


export interface Attendance {
    company_id: number;
    event_id: number;
    type: string;
    status?: string;
    event: Event;
}

export interface Company {
    sponsor_id: number | null;
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
    address: string | null;
    status: string | null;
    logo: string | null;
    logo_url: string | null;
    owners_count: number;
    created_at: string;
    updated_at: string;
    sponsor?: Sponsor[];
    notarization_status?: string;
    erp_status?: string;
    sales_activity?: string;
    level?: string;
    owners?: Owner[];
    coach?: Coach[];
    checklist_percentage?: number;
}

export interface OwnerFormData {
    name: string;
    email: string;
    phone: string;
    facebook: string;
    address: string;
    birthdate: string;
}


export interface Sponsors {
    sponsors: Sponsor[] | null;
    map(element: (sponsor: Sponsor[]) => React.JSX.Element): React.ReactNode | undefined;
}


export interface CompanyFormData {
    name: string;
    email: string;
    phone: string;
    address: string;
    status: string;
    sponsor_id: string | number;
    notarization_status: string;
    erp_status: string;
    sales_activity: string;
    level: string;
}
