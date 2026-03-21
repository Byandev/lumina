import { useForm } from '@inertiajs/react';
import { Edit, Eye, FileText, Loader2 } from 'lucide-react';
import { FormEvent, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import FileInput from '@/components/ui/file-input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { OnboardingChecklist } from '@/types/models/OnboardingChecklist';

interface Props {
    open: boolean;
    onOpenChange: (bool: boolean) => void;
    checklist: OnboardingChecklist;
}

const OnboardingRemark = ({ open, onOpenChange, checklist }: Props) => {
    const { data, setData, processing, errors, post, setError } = useForm<{
        remark: string;
        new_attachment: File | null;
    }>({
        remark: checklist.remark ?? '',
        new_attachment: null,
    });

    const hasExistingRemark = !!checklist.remark || !!checklist.attachment;
    const [isEditMode, setIsEditMode] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        post(`/companies/${checklist.company_id}/onboarding/${checklist.id}`, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                onOpenChange(false);
                setIsEditMode(false);
            },
        });
    };

    const handleEdit = () => {
        setIsEditMode(true);
    };

    const handleCancel = () => {
        if (isEditMode) {
            setIsEditMode(false);
            // Reset form data
            setData({
                remark: checklist.remark ?? '',
                new_attachment: null,
            });
        } else {
            onOpenChange(false);
        }
    };

    const openAttachmentInNewTab = () => {
        if (checklist.attachment) {
            // Assuming attachment is a URL or file path
            window.open(checklist?.attachment?.original_url, '_blank');
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-full sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-between text-lg">
                        <span>{checklist.title}</span>
                    </DialogTitle>
                </DialogHeader>

                {!hasExistingRemark || isEditMode ? (
                    <form onSubmit={handleSubmit} className="w-full">
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
                                    placeholder="Enter your remarks here..."
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
                                    value={
                                        data.new_attachment ??
                                        (checklist.attachment
                                            ? checklist.attachment
                                            : null)
                                    }
                                    onChange={(file) =>
                                        setData('new_attachment', file)
                                    }
                                    error={errors.new_attachment}
                                    required={!hasExistingRemark}
                                />
                            </div>
                        </div>

                        <DialogFooter className="mt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCancel}
                                disabled={processing}
                                size="sm"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                                size="sm"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                                        Submitting...
                                    </>
                                ) : hasExistingRemark ? (
                                    'Update'
                                ) : (
                                    'Submit'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                ) : (
                    // View Mode
                    <div className="space-y-4 py-3">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="name" className="text-sm">
                                Remarks
                            </Label>
                            <div className="min-h-32 rounded-md border bg-gray-50 p-3">
                                <p className="text-sm whitespace-pre-wrap">
                                    {checklist.remark || 'No remarks added'}
                                </p>
                            </div>
                        </div>

                        {checklist.attachment && (
                            <div className="flex flex-col space-y-1.5">
                                <Label className="text-sm">Attachment</Label>
                                <div className="flex items-center gap-2 rounded-md border bg-gray-50 p-3">
                                    <FileText className="h-4 w-4 text-gray-500" />
                                    <span className="flex-1 truncate text-sm">

                                        {checklist.attachment?.file_name}
                                    </span>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={openAttachmentInNewTab}
                                        className="flex items-center gap-2"
                                    >
                                        <Eye className="h-3 w-3" />
                                        View
                                    </Button>
                                </div>
                            </div>
                        )}

                        <DialogFooter className="mt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                size="sm"
                            >
                                Close
                            </Button>
                        </DialogFooter>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default OnboardingRemark;
