import { Company } from '@/types/models/Company';
import { Progress } from '@/components/ui/progress';
import { percentageFormatter } from '@/lib/formatter';
import ComponentCard from '@/components/component-card';
import CompanyLayout from '@/pages/companies/company/company-layout';
import OnboardingChecklistItem from '@/components/companies/onboarding-checklist-item';

interface Props {
    company: Company
}

const Onboarding  = ({ company}: Props) => {
    return <CompanyLayout company={company}>
        <div className="space-y-6">
                <ComponentCard desc={`Onboarding summary progress: ${percentageFormatter(company.onboarding_percentage as number)}`}>
                <Progress color={'blue'} value={(company.onboarding_percentage ?? 0) * 100} max={100}/>
            </ComponentCard>

            <ComponentCard desc="Checklists">
                <div className="space-y-4">
                    {company.onboarding_checklists?.map(checklist => <OnboardingChecklistItem key={checklist.id} checklist={checklist}/>)}
                </div>
            </ComponentCard>
        </div>
    </CompanyLayout>
}

export default Onboarding
