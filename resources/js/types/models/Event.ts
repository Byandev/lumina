import { Company } from '@/types/models/Company';

export interface Event {
    id: number;
    name: string;
    date: string;
    type: string;
    location: string;
    company_ids: string[];
    companies?: Company[];
    created_at: string;
    updated_at: string;
}
