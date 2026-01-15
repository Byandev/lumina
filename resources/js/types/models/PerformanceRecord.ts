export interface PerformanceRecord {
    id: number;
    company_id: number;
    start_date: string;
    end_date: string;
    phase: string;
    no_of_items: number;
    avg_ads_spent: number;
    roas: number;
    rts: number;
    highlights: string;
    challenges: string;
    action_plan: string;
}
