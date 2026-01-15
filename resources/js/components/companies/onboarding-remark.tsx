import { OnboardingChecklist } from '@/types/models/OnboardingChecklist';
import { useForm } from '@inertiajs/react';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import FileInput from '@/components/ui/file-input';

interface Props {
    open: boolean;
    onOpenChange: (bool: boolean) => void;
    checklist: OnboardingChecklist;
}
const OnboardingRemark = ({ open, onOpenChange, checklist }: Props) => {
    const { data, setData, processing, errors, put, setError } =
        useForm<{
            remark: string;
            new_attachment: File | null;
        }>({
            remark: checklist.remark ?? '',
            new_attachment: null,
        });

    const handleSubmit = () => {
        put(`/companies/${checklist.company_id}/onboarding/${checklist.id}`, {
            preserveScroll: true,
            preserveState: false,
        });
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg w-full">
                <DialogHeader>
                    <DialogTitle className="text-lg">
                        {checklist.title}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className='w-full'>
                    <div className="space-y-4 py-3">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="name" className="text-sm">
                                Remarks
                            </Label>

                            <Textarea
                                className={'min-h-32'}
                                value={data.remark}
                                onChange={(e) => {
                                    setData('remark', e.target.value);
                                    setError('remark', '');
                                }}
                            />

                            {errors.remark && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.remark}
                                </p>
                            )}
                        </div>

                        <div>
                            <FileInput
                                label="Attachment"
                                accept="image/*,.pdf"
                                value={data.new_attachment ?? checklist.attachment ?? null}
                                onChange={(file) =>
                                    setData('new_attachment', file)
                                }
                                error={errors.new_attachment}
                                required
                            />
                        </div>
                    </div>

                    <DialogFooter className="mt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={processing}
                            size="sm"
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing} size="sm">
                            {processing ? (
                                <>
                                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                'Submit'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default OnboardingRemark;
