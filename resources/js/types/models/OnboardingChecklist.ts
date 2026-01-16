import { Media } from '@/types/models/Media';

export interface OnboardingChecklist {
    id: number;
    title: string;
    remark?: string;
    is_completed: boolean;
    company_id: number;
    attachment: Media | null
}
