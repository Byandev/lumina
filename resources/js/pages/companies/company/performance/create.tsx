import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import CompanyLayout from '@/pages/companies/company/company-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { Calendar, File, Upload, X } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { Textarea } from '@headlessui/react';

interface Company {
    id: number;
    name: string;
}

interface CreateProps {
    company: Company;
}

interface FormData {
    start_date: string;
    end_date: string;
    phase: string;
    no_of_items: string;
    avg_ads_spent: string;
    roas: string;
    rts: string;
    highlights: string;
    challenges: string;
    action_plan: string;
    attachment: File | null;
}

const phases = ['Testing', 'Scaling'] as const;
type Phase = (typeof phases)[number];

export default function Create({ company }: CreateProps) {
    const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
    const [attachmentName, setAttachmentName] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors, reset } =
        useForm<FormData>({
            start_date: '',
            end_date: '',
            phase: '',
            no_of_items: '',
            avg_ads_spent: '',
            roas: '',
            rts: '',
            highlights: '',
            challenges: '',
            action_plan: '',
            attachment: null,
        });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        console.log(company.id);

        post(`/companies/${company.id}/performance-records/add-record`, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setAttachmentFile(null);
                setAttachmentName('');
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            },
        });
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setData(name as keyof FormData, value);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const validTypes = [
                'image/jpeg',
                'image/png',
                'image/gif',
                'image/webp',
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            ];

            if (!validTypes.includes(file.type)) {
                alert('Please upload a valid file (images, PDF, Word, Excel)');
                return;
            }

            const maxSize = 10 * 1024 * 1024;
            if (file.size > maxSize) {
                alert('File size should not exceed 10MB');
                return;
            }

            setAttachmentFile(file);
            setAttachmentName(file.name);
            setData('attachment', file);
        }
    };

    const removeAttachment = () => {
        setAttachmentFile(null);
        setAttachmentName('');
        setData('attachment', null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <CompanyLayout company={company}>
            <Head title={company.name} />
            <div className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="mb-4 min-w-0 border-b pb-4">
                    <h3 className="text-base font-semibold text-gray-900">
                        Add Performance record.
                    </h3>
                </div>
                <form onSubmit={submit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <Label
                                htmlFor="start_date"
                                className="text-sm font-medium"
                            >
                                Start Date *
                            </Label>
                            <div className="relative mt-1">
                                <Calendar className="absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <Input
                                    id="start_date"
                                    name="start_date"
                                    type="date"
                                    required
                                    value={data.start_date}
                                    onChange={handleChange}
                                    disabled={processing}
                                    className="pl-10"
                                />
                            </div>
                            <InputError message={errors.start_date} />
                        </div>

                        <div>
                            <Label
                                htmlFor="end_date"
                                className="text-sm font-medium"
                            >
                                End Date *
                            </Label>
                            <div className="relative mt-1">
                                <Calendar className="absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <Input
                                    id="end_date"
                                    name="end_date"
                                    type="date"
                                    required
                                    value={data.end_date}
                                    onChange={handleChange}
                                    disabled={processing}
                                    className="pl-10"
                                />
                            </div>
                            <InputError message={errors.end_date} />
                        </div>

                        <div>
                            <Label
                                    htmlFor="phase"
                                className="text-sm font-medium"
                            >
                                Phase *
                            </Label>
                            <Select
                                name="phase"
                                value={data.phase}
                                onValueChange={(value) =>
                                    setData('phase', value)
                                }
                            >
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Select phase" />
                                </SelectTrigger>
                                <SelectContent>
                                    {phases.map((phase) => (
                                        <SelectItem key={phase} value={phase}>
                                            {phase}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.phase} />
                        </div>

                        <div>
                            <Label
                                htmlFor="no_of_items"
                                className="text-sm font-medium"
                            >
                                Number of Items *
                            </Label>
                            <Input
                                id="no_of_items"
                                name="no_of_items"
                                type="number"
                                required
                                min="0"
                                step="1"
                                value={data.no_of_items}
                                onChange={handleChange}
                                disabled={processing}
                                className="mt-1"
                                placeholder="0"
                            />
                            <InputError message={errors.no_of_items} />
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        <div>
                            <Label
                                htmlFor="avg_ads_spent"
                                className="text-sm font-medium"
                            >
                                Average Ads Spent *
                            </Label>
                            <Input
                                id="avg_ads_spent"
                                name="avg_ads_spent"
                                type="number"
                                required
                                min="0"
                                step="0.01"
                                value={data.avg_ads_spent}
                                onChange={handleChange}
                                disabled={processing}
                                className="mt-1"
                                placeholder="0.00"
                            />
                            <InputError message={errors.avg_ads_spent} />
                        </div>

                        <div>
                            <Label
                                htmlFor="roas"
                                className="text-sm font-medium"
                            >
                                ROAS (Return on Ad Spend) *
                            </Label>
                            <Input
                                id="roas"
                                name="roas"
                                type="number"
                                required
                                min="0"
                                step="0.1"
                                value={data.roas}
                                onChange={handleChange}
                                disabled={processing}
                                className="mt-1"
                                placeholder="0.0"
                            />
                            <InputError message={errors.roas} />
                        </div>

                        <div>
                            <Label
                                htmlFor="rts"
                                className="text-sm font-medium"
                            >
                                RTS (Return to Spend) *
                            </Label>
                            <Input
                                id="rts"
                                name="rts"
                                type="number"
                                required
                                min="0"
                                max="100"
                                step="0.1"
                                value={data.rts}
                                onChange={handleChange}
                                disabled={processing}
                                className="mt-1"
                                placeholder="0.0"
                            />
                            <InputError message={errors.rts} />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <Label
                                htmlFor="highlights"
                                className="text-sm font-medium"
                            >
                                Highlights
                            </Label>
                            <Textarea
                                id="highlights"
                                name="highlights"
                                value={data.highlights}
                                onChange={handleChange}
                                disabled={processing}
                                className="mt-1 min-h-[100px] w-full rounded-lg border p-2 focus:border-pink-400"
                                placeholder="Key achievements and successes..."
                            />
                            <InputError message={errors.highlights} />
                        </div>

                        <div>
                            <Label
                                htmlFor="challenges"
                                className="text-sm font-medium"
                            >
                                Challenges
                            </Label>
                            <Textarea
                                id="challenges"
                                name="challenges"
                                value={data.challenges}
                                onChange={handleChange}
                                disabled={processing}
                                className="mt-1 min-h-[100px] w-full rounded-lg border p-2 focus:border-pink-400"
                                placeholder="Difficulties encountered..."
                            />
                            <InputError message={errors.challenges} />
                        </div>

                        <div>
                            <Label
                                htmlFor="action_plan"
                                className="text-sm font-medium"
                            >
                                Action Plan
                            </Label>
                            <Textarea
                                id="action_plan"
                                name="action_plan"
                                value={data.action_plan}
                                onChange={handleChange}
                                disabled={processing}
                                className="mt-1 min-h-[100px] w-full rounded-lg border p-2 focus:border-pink-400"
                                placeholder="Next steps and improvements..."
                            />
                            <InputError message={errors.action_plan} />
                        </div>
                    </div>

                    <div>
                        <Label
                            htmlFor="attachment"
                            className="text-sm font-medium"
                        >
                            Attachment (Optional)
                        </Label>
                        <div className="mt-2">
                            {attachmentFile ? (
                                <div className="to rounded-lg border border-blue-200 bg-gradient-to-r from-pink-100 via-blue-50 p-3 accent-cyan-100">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <File className="h-4 w-4 text-green-600" />
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-medium text-gray-900">
                                                    {attachmentName}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {(
                                                        attachmentFile.size /
                                                        1024 /
                                                        1024
                                                    ).toFixed(2)}{' '}
                                                    MB
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={removeAttachment}
                                            className="text-gray-400 hover:text-gray-600"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                    className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4 text-center transition-colors hover:border-gray-400 hover:bg-gray-100"
                                >
                                    <Upload className="mx-auto h-6 w-6 text-gray-400" />
                                    <p className="mt-2 text-sm text-gray-600">
                                        Click to upload file
                                    </p>
                                    <p className="mt-1 text-xs text-gray-400">
                                        Images, PDF, Word, Excel (Max 10MB)
                                    </p>
                                </div>
                            )}
                            <input
                                ref={fileInputRef}
                                id="attachment"
                                type="file"
                                className="hidden"
                                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                                onChange={handleFileChange}
                            />
                        </div>
                        <InputError message={errors.attachment} />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                                router.get(
                                    `/companies/${company.id}/performance-records`,
                                )
                            }
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Save Record'}
                        </Button>
                    </div>
                </form>
            </div>
        </CompanyLayout>
    );
}
