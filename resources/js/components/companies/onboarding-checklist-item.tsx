import OnboardingRemark from '@/components/companies/onboarding-remark';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { OnboardingChecklist } from '@/types/models/OnboardingChecklist';
import { useForm } from '@inertiajs/react';
import { CheckedState } from '@radix-ui/react-checkbox';
import { FileText } from 'lucide-react';
import { useState } from 'react';

interface Props {
    checklist: OnboardingChecklist;
}

const OnboardingChecklistItem = ({ checklist }: Props) => {
    const [openRemark, setOpenRemark] = useState(false);

    const { put, data } = useForm({
        is_completed: checklist.is_completed,
    });

    const onChange = (checked: CheckedState) => {
        data.is_completed = checked as boolean;

        put(`/companies/${checklist.company_id}/onboarding/${checklist.id}`, {
            preserveScroll: true,
            preserveState: false,
        });
    };

    const hasRemarkOrAttachment = checklist?.remark || checklist?.attachment;

    return (
        <div className="p-4 text-sm font-medium">
            <OnboardingRemark
                open={openRemark}
                onOpenChange={setOpenRemark}
                checklist={checklist}
            />

            <div className="flex flex-col justify-between gap-2 sm:flex-row">
                <div className="flex items-center gap-x-2">
                    <Checkbox
                        checked={checklist.is_completed}
                        onCheckedChange={onChange}
                    />
                    <div>{checklist.title}</div>
                </div>
                <div>
                    <Button
                        variant={hasRemarkOrAttachment ? 'outline' : 'default'}
                        onClick={() => setOpenRemark(true)}
                        className="flex items-center gap-2"
                    >
                        {hasRemarkOrAttachment ? 'View' : 'Add remark'}
                        {checklist?.attachment && (
                            <FileText className="h-3 w-3" />
                        )}
                    </Button>
                </div>
            </div>
            
        </div>
    );
};

export default OnboardingChecklistItem;
