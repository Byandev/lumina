import { useForm } from '@inertiajs/react';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckedState } from '@radix-ui/react-checkbox';
import { OnboardingChecklist } from '@/types/models/OnboardingChecklist';

interface Props {
    checklist: OnboardingChecklist
}

const OnboardingChecklistItem = ({ checklist }: Props) => {
    const { put, data } = useForm({
        is_completed: checklist.is_completed
    })

    const onChange = (checked: CheckedState) => {
        data.is_completed = checked as boolean;
        put(`/companies/${checklist.company_id}/onboarding/${checklist.id}`, {
            preserveScroll: true,
            preserveState: false
        })
    }

    return <div className='p-4 text-sm font-medium'>
        <div className='flex items-center gap-x-2'>
            <Checkbox value={true} checked={checklist.is_completed} onCheckedChange={onChange}/>
            <div>{checklist.title}</div>
        </div>
    </div>
}

export default OnboardingChecklistItem
