import { router } from '@inertiajs/react';
import {
    AlertTriangle,
    Calendar,
    CheckCircle,
    Download,
    File,
    Plus,
    Target,
    Upload,
    X,
} from 'lucide-react';
import React, { useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import InputError from '@/components/input-error';

import CompanyLayout from '@/pages/companies/company/company-layout';
import { Company } from '@/pages/companies/company/types';
import { useForm } from '@inertiajs/react';
import { Textarea } from '@headlessui/react';

export interface PerformanceRecord {
    id: number;
    company_id: number;
    start_date: string;
    end_date: string;
    phase: string;
    no_of_items: number;
    avg_ads_spent: string;
    roas: string;
    rts: string;
    highlights: string;
    challenges: string;
    action_plan: string;
    attachment_path: string | null;
    attachment_path_url: string | null; // Added URL field
    attachment_name: string | null;
    created_at: string;
    updated_at: string;
}

export interface PaginatedPerformanceRecords {
    current_page: number;
    data: PerformanceRecord[];
    first_page_url: string;
    last_page: number;
    last_page_url: string;
    next_page_url: string | null;
    prev_page_url: string | null;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

interface Props {
    company: Company;
    records: PaginatedPerformanceRecords;
}

const phases = ['Testing', 'Scaling'] as const;
type Phase = (typeof phases)[number];

type FormData = {
    start_date: string;
    end_date: string;
    phase: Phase | '';
    no_of_items: string;
    avg_ads_spent: string;
    roas: string;
    rts: string;
    highlights: string;
    challenges: string;
    action_plan: string;
    attachment: File | null;
    _method?: 'PUT';
};

export default function PerformanceTab({ company, records }: Props) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
    const [attachmentName, setAttachmentName] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors, reset } = useForm<FormData>({
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

        post(`/companies/${company.id}/performance-records`, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setAttachmentFile(null);
                setAttachmentName('');
                setIsDialogOpen(false);
            },
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setData(name as keyof FormData, value);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            const validTypes = [
                'image/jpeg', 'image/png', 'image/gif', 'image/webp',
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

            // Validate file size (10MB max)
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

    // Helper function to get attachment display name
    const getAttachmentDisplayName = (record: PerformanceRecord): string => {
        // Use attachment_name if available
        if (record.attachment_name) {
            return record.attachment_name;
        }

        // Otherwise, extract from path or use default
        if (record.attachment_path) {
            const path = record.attachment_path;
            const filename = path.split('/').pop();
            return filename || 'Attachment';
        }

        return 'Attachment';
    };

    const loadPage = (page: number) => {
        router.get(
            `/companies/${company.id}/performance-records?page=${page}`,
            {},
            { preserveScroll: true },
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-PH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatCurrency = (amount: string) => {
        const num = parseFloat(amount);
        if (Number.isNaN(num)) return '₱0.00';

        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(num);
    };

    const getPhaseColor = (phase: string) => {
        return phase === 'Testing'
            ? 'bg-blue-50 text-violet-700 border-violet-200'
            : 'bg-green-50 text-green-700 border-green-200';
    };

    const NotePill = ({
                          type,
                          children,
                      }: {
        type: 'Highlights' | 'Challenges' | 'Actions';
        children: string;
    }) => {
        const base = 'inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[11px]';
        const map = {
            Highlights: 'bg-green-50 text-green-700 border-green-200',
            Challenges: 'bg-yellow-50 text-yellow-800 border-yellow-200',
            Actions: 'bg-blue-50 text-blue-700 border-blue-200',
        } as const;

        const icon =
            type === 'Highlights' ? (
                <CheckCircle className="h-3 w-3" />
            ) : type === 'Challenges' ? (
                <AlertTriangle className="h-3 w-3" />
            ) : (
                <Target className="h-3 w-3" />
            );

        return (
            <span className={`${base} ${map[type]}`}>
                {icon}
                <span className="font-medium">{type}</span>
                <span className="line-clamp-1">{children}</span>
            </span>
        );
    };

    return (
        <CompanyLayout company={company}>
            <div className="space-y-4">
                {/* Compact header */}
                <div className="flex items-center justify-between">
                    <div className="min-w-0">
                        <h3 className="text-base font-semibold text-gray-900">
                            Performance
                        </h3>
                        <p className="text-xs text-gray-500">
                            Period tracking for items, spend, ROAS, and RTS
                        </p>
                    </div>

                    {/* Add Record Button with Dialog */}
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" className="h-8">
                                <Plus className="mr-1.5 h-3.5 w-3.5" />
                                Add Record
                            </Button>
                        </DialogTrigger>

                        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>
                                    Add Performance Record
                                </DialogTitle>
                                <DialogDescription>
                                    Add a new performance record for{' '}
                                    {company.name}
                                </DialogDescription>
                            </DialogHeader>

                            <form onSubmit={submit} className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    {/* Period Section */}
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
                                        <InputError
                                            message={errors.start_date}
                                        />
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
                                            value={data.phase}
                                            onValueChange={(value) =>
                                                setData('phase', value as Phase)
                                            }
                                        >
                                            <SelectTrigger className="mt-1">
                                                <SelectValue placeholder="Select phase" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {phases.map((phase) => (
                                                    <SelectItem
                                                        key={phase}
                                                        value={phase}
                                                    >
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
                                        <InputError
                                            message={errors.no_of_items}
                                        />
                                    </div>
                                </div>

                                {/* Metrics Section */}
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
                                        <InputError
                                            message={errors.avg_ads_spent}
                                        />
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

                                {/* Notes Section */}
                                <div className="space-y-3">
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
                                            className="mt-1 min-h-[80px] w-full rounded-lg border p-2"
                                            placeholder="Key achievements and successes..."
                                        />
                                        <InputError
                                            message={errors.highlights}
                                        />
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
                                            className="mt-1 min-h-[80px] w-full rounded-lg border p-2"
                                            placeholder="Difficulties encountered..."
                                        />
                                        <InputError
                                            message={errors.challenges}
                                        />
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
                                            className="mt-1 min-h-[80px] w-full rounded-lg border p-2"
                                            placeholder="Next steps and improvements..."
                                        />
                                        <InputError
                                            message={errors.action_plan}
                                        />
                                    </div>
                                </div>

                                {/* Attachment Section */}
                                <div>
                                    <Label className="text-sm font-medium">
                                        Attachment (Optional)
                                    </Label>
                                    <div className="mt-2">
                                        {attachmentFile ? (
                                            <div className="rounded-lg border border-green-200 bg-green-50 p-3">
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
                                                                ).toFixed(
                                                                    2,
                                                                )}{' '}
                                                                MB
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={
                                                            removeAttachment
                                                        }
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
                                                    Images, PDF, Word, Excel
                                                    (Max 10MB)
                                                </p>
                                            </div>
                                        )}
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            className="hidden"
                                            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                    <InputError message={errors.attachment} />
                                </div>

                                <DialogFooter>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsDialogOpen(false)}
                                        disabled={processing}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        {processing
                                            ? 'Saving...'
                                            : 'Save Record'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Empty state (compact) */}
                {!records.data.length ? (
                    <div className="rounded-lg border bg-white p-6 text-center">
                        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                            <Plus className="h-5 w-5 text-gray-400" />
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                            No records yet
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                            Add your first performance record to start tracking.
                        </div>
                    </div>
                ) : (
                    <div className="bg-white">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 text-sm">
                                <thead className="bg-gray-100">
                                    <tr className="text-[11px] tracking-wider text-gray-500 uppercase">
                                        <th className="px-3 py-2 text-left font-medium">
                                            Period
                                        </th>
                                        <th className="px-3 py-2 text-left font-medium">
                                            Phase
                                        </th>
                                        <th className="px-3 py-2 text-right font-medium">
                                            Items
                                        </th>
                                        <th className="px-3 py-2 text-right font-medium">
                                            Spend
                                        </th>
                                        <th className="px-3 py-2 text-right font-medium">
                                            ROAS
                                        </th>
                                        <th className="px-3 py-2 text-right font-medium">
                                            RTS
                                        </th>
                                        <th className="px-3 py-2 text-left font-medium">
                                            Notes
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-100">
                                    {records.data.map((record) => {
                                        const attachmentName =
                                            getAttachmentDisplayName(record);

                                        return (
                                            <tr
                                                key={record.id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="px-3 py-2">
                                                    <div className="text-xs font-medium text-gray-900">
                                                        {formatDate(
                                                            record.start_date,
                                                        )}
                                                    </div>
                                                    <div className="text-[11px] text-gray-500">
                                                        {formatDate(
                                                            record.end_date,
                                                        )}
                                                    </div>
                                                </td>

                                                <td className="px-3 py-2">
                                                    <span
                                                        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${getPhaseColor(
                                                            record.phase,
                                                        )}`}
                                                    >
                                                        <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
                                                        {record.phase}
                                                    </span>
                                                </td>

                                                <td className="px-3 py-2 text-right text-xs font-semibold text-gray-900">
                                                    {record.no_of_items.toLocaleString()}
                                                </td>

                                                <td className="px-3 py-2 text-right text-xs font-semibold text-blue-600">
                                                    {formatCurrency(
                                                        record.avg_ads_spent,
                                                    )}
                                                </td>

                                                <td className="px-3 py-2 text-right text-xs font-semibold text-green-600">
                                                    {record.roas}x
                                                </td>

                                                <td className="px-3 py-2 text-right text-xs font-semibold text-purple-600">
                                                    {record.rts}%
                                                </td>

                                                <td className="px-3 py-2">
                                                    <div className="flex max-w-[380px] flex-col gap-1">
                                                        {record.highlights ? (
                                                            <NotePill type="Highlights">
                                                                {
                                                                    record.highlights
                                                                }
                                                            </NotePill>
                                                        ) : null}
                                                        {record.challenges ? (
                                                            <NotePill type="Challenges">
                                                                {
                                                                    record.challenges
                                                                }
                                                            </NotePill>
                                                        ) : null}
                                                        {record.action_plan ? (
                                                            <NotePill type="Actions">
                                                                {
                                                                    record.action_plan
                                                                }
                                                            </NotePill>
                                                        ) : null}

                                                        {/* Attachment shown at the bottom */}
                                                        {record.attachment_path_url && (
                                                            <div
                                                                className={`flex items-center gap-1.5 ${record.action_plan ? 'mt-1' : ''}`}
                                                            >
                                                                <File className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
                                                                <a
                                                                    href={
                                                                        record.attachment_path_url
                                                                    }
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="max-w-[180px] truncate text-[11px] text-blue-600 hover:underline"
                                                                    onClick={(
                                                                        e,
                                                                    ) =>
                                                                        e.stopPropagation()
                                                                    }
                                                                    title={
                                                                        attachmentName
                                                                    }
                                                                >
                                                                    {attachmentName.length >
                                                                    25
                                                                        ? attachmentName.substring(
                                                                              0,
                                                                              25,
                                                                          ) +
                                                                          '...'
                                                                        : attachmentName}
                                                                </a>
                                                            </div>
                                                        )}

                                                        {!record.highlights &&
                                                        !record.challenges &&
                                                        !record.action_plan &&
                                                        !record.attachment_path_url ? (
                                                            <span className="text-[11px] text-gray-400 italic">
                                                                No notes
                                                            </span>
                                                        ) : null}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Compact pagination */}
                        {records.total > records.per_page && (
                            <div className="flex flex-col gap-2 border-t bg-gray-50 px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
                                <div className="text-[11px] text-gray-600">
                                    Showing{' '}
                                    <span className="font-medium">
                                        {records.from}
                                    </span>
                                    –{' '}
                                    <span className="font-medium">
                                        {records.to}
                                    </span>{' '}
                                    of{' '}
                                    <span className="font-medium">
                                        {records.total}
                                    </span>
                                </div>

                                <div className="flex items-center gap-1.5">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8"
                                        onClick={() =>
                                            loadPage(records.current_page - 1)
                                        }
                                        disabled={!records.prev_page_url}
                                    >
                                        Prev
                                    </Button>

                                    <div className="flex items-center gap-1">
                                        {records.links
                                            .slice(1, -1)
                                            .map((link, index) => (
                                                <Button
                                                    key={index}
                                                    variant={
                                                        link.active
                                                            ? 'default'
                                                            : 'outline'
                                                    }
                                                    size="sm"
                                                    className="h-8 min-w-8 px-2"
                                                    onClick={() =>
                                                        link.url &&
                                                        loadPage(
                                                            parseInt(
                                                                link.label,
                                                                10,
                                                            ),
                                                        )
                                                    }
                                                    disabled={!link.url}
                                                >
                                                    {link.label}
                                                </Button>
                                            ))}
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8"
                                        onClick={() =>
                                            loadPage(records.current_page + 1)
                                        }
                                        disabled={!records.next_page_url}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </CompanyLayout>
    );
}
