export interface OnboardingChecklist {
    id: number;
    title: string;
    remark?: string;
    is_completed: boolean;
    company_id: number;
}
