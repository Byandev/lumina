import { useForm } from '@inertiajs/react';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckedState } from '@radix-ui/react-checkbox';
import { OnboardingChecklist } from '@/types/models/OnboardingChecklist';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import OnboardingRemark from '@/components/companies/onboarding-remark';

interface Props {
    checklist: OnboardingChecklist
}

const OnboardingChecklistItem = ({ checklist }: Props) => {
    const [openRemark, setOpenRemark] = useState(false);

    const { put, data } = useForm({
        is_completed: checklist.is_completed
    })

    const onChange = (checked: CheckedState) => {
        // eslint-disable-next-line react-hooks/immutability
        data.is_completed = checked as boolean;

        put(`/companies/${checklist.company_id}/onboarding/${checklist.id}`, {
            preserveScroll: true,
            preserveState: false
        })
    }

    return <div className='p-4 text-sm font-medium'>
        <OnboardingRemark open={openRemark} onOpenChange={setOpenRemark} checklist={checklist} />

        <div className="flex flex-col sm:flex-row justify-between gap-2">
            <div className='flex items-center gap-x-2'>
                <Checkbox checked={checklist.is_completed} onCheckedChange={onChange}/>
                <div>{checklist.title}</div>
            </div>

            <div>
                <Button onClick={() => setOpenRemark(true)}>Add remark</Button>
            </div>
        </div>
    </div>
}

export default OnboardingChecklistItem
