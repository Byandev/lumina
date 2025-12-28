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
    photo: string;
}

export interface Sponsor {
    id: number;
    name: string;
    logo: string;
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
    sponsor?: Sponsor;
    notarization_status?: string;
    erp_status?: string;
    sales_activity?: string;
    level?: string;
    owners?: Owner[];
    coach?: Coach[];
    checklists?: ChecklistItem[];
    checklist_percentage: number;
    completed_checklist_count?: number;
    total_checklist_count?: number;
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
    sponsors: Sponsor[];
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
