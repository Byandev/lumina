import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { Edit, Plus, Trash2, CheckCircle, AlertTriangle, Target } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@headlessui/react';

import CompanyLayout from '@/pages/companies/company/company-layout';
import { Company } from '@/pages/companies/company/types';

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
    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingRecord, setEditingRecord] = useState<PerformanceRecord | null>(null);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState<PerformanceRecord | null>(null);

    const { data, setData, post, delete: destroy, processing, errors, reset, clearErrors } =
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

    const closeFormModal = () => {
        setIsOpen(false);
        setIsEditing(false);
        setEditingRecord(null);
        reset();
        clearErrors();
    };

    const handleOpenDialog = (record?: PerformanceRecord) => {
        clearErrors();

        if (record) {
            setIsEditing(true);
            setEditingRecord(record);

            setData({
                start_date: record.start_date?.split('T')?.[0] ?? '',
                end_date: record.end_date?.split('T')?.[0] ?? '',
                phase: (record.phase as Phase) ?? '',
                no_of_items: String(record.no_of_items ?? ''),
                avg_ads_spent: record.avg_ads_spent ?? '',
                roas: record.roas ?? '',
                rts: record.rts ?? '',
                highlights: record.highlights ?? '',
                challenges: record.challenges ?? '',
                action_plan: record.action_plan ?? '',
                attachment: null,
            });
        } else {
            setIsEditing(false);
            setEditingRecord(null);
            reset();
        }

        setIsOpen(true);
    };

    // IMPORTANT: Shadcn Dialog expects (open: boolean) => void
    const handleFormOpenChange = (open: boolean) => {
        if (!open) {
            closeFormModal();
            return;
        }
        setIsOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const url =
            isEditing && editingRecord
                ? `/companies/${company.id}/performance-records/${editingRecord.id}`
                : `/companies/${company.id}/performance-records`;

        const payload: FormData =
            isEditing && editingRecord ? { ...data, _method: 'PUT' } : data;

        // IMPORTANT: In newer @inertiajs/react typings, use post(url, options) and pass payload via options.data
        post(url, {
            data: payload,
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                // Close modal after add/update
                closeFormModal();
            },
            onError: (errs) => console.error('Submit errors:', errs),
        });
    };

    const openDeleteDialog = (record: PerformanceRecord) => {
        setRecordToDelete(record);
        setDeleteDialogOpen(true);
    };

    const handleDelete = () => {
        if (!recordToDelete) return;

        destroy(`/companies/${company.id}/performance-records/${recordToDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteDialogOpen(false);
                setRecordToDelete(null);
            },
            onError: (errs) => console.error('Delete errors:', errs),
        });
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
            ? 'bg-blue-50 text-blue-700 border-blue-200'
            : 'bg-green-50 text-green-700 border-green-200';
    };

    if (!records.data.length) {
        return (
            <CompanyLayout company={company}>
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Performance Records</h3>
                            <p className="text-sm text-gray-600">Track and manage company performance metrics</p>
                        </div>
                        <Button onClick={() => handleOpenDialog()}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Record
                        </Button>
                    </div>

                    <div className="py-12 text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                            <Plus className="h-6 w-6 text-gray-400" />
                        </div>
                        <h3 className="mb-2 text-sm font-medium text-gray-900">No performance records</h3>
                        <p className="mb-4 text-sm text-gray-500">
                            Get started by creating your first performance record.
                        </p>
                        <Button onClick={() => handleOpenDialog()}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add First Record
                        </Button>
                    </div>
                </div>

                {/* Add/Edit Dialog */}
                <Dialog open={isOpen} onOpenChange={handleFormOpenChange}>
                    <DialogContent className="max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{isEditing ? 'Edit Performance Record' : 'Add Performance Record'}</DialogTitle>
                            <DialogDescription>
                                {isEditing
                                    ? 'Update the performance record details below.'
                                    : 'Fill in the details to create a new performance record.'}
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="start_date">Start Date *</Label>
                                    <Input
                                        id="start_date"
                                        type="date"
                                        value={data.start_date}
                                        onChange={(e) => setData('start_date', e.target.value)}
                                        required
                                    />
                                    {errors.start_date && <p className="text-sm text-red-500">{errors.start_date}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="end_date">End Date *</Label>
                                    <Input
                                        id="end_date"
                                        type="date"
                                        value={data.end_date}
                                        onChange={(e) => setData('end_date', e.target.value)}
                                        required
                                    />
                                    {errors.end_date && <p className="text-sm text-red-500">{errors.end_date}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phase">Phase *</Label>
                                <Select value={data.phase} onValueChange={(value) => setData('phase', value as Phase)}>
                                    <SelectTrigger>
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
                                {errors.phase && <p className="text-sm text-red-500">{errors.phase}</p>}
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="no_of_items">Items Sold *</Label>
                                    <Input
                                        id="no_of_items"
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={data.no_of_items}
                                        onChange={(e) => setData('no_of_items', e.target.value)}
                                        required
                                    />
                                    {errors.no_of_items && <p className="text-sm text-red-500">{errors.no_of_items}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="avg_ads_spent">Average Ad Spend (₱) *</Label>
                                    <Input
                                        id="avg_ads_spent"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={data.avg_ads_spent}
                                        onChange={(e) => setData('avg_ads_spent', e.target.value)}
                                        required
                                    />
                                    {errors.avg_ads_spent && <p className="text-sm text-red-500">{errors.avg_ads_spent}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="roas">ROAS *</Label>
                                    <Input
                                        id="roas"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={data.roas}
                                        onChange={(e) => setData('roas', e.target.value)}
                                        required
                                    />
                                    {errors.roas && <p className="text-sm text-red-500">{errors.roas}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="rts">RTS (%) *</Label>
                                    <Input
                                        id="rts"
                                        type="number"
                                        min="0"
                                        max="100"
                                        step="0.1"
                                        value={data.rts}
                                        onChange={(e) => setData('rts', e.target.value)}
                                        required
                                    />
                                    {errors.rts && <p className="text-sm text-red-500">{errors.rts}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="highlights">Highlights</Label>
                                <Textarea
                                    id="highlights"
                                    value={data.highlights}
                                    onChange={(e) => setData('highlights', e.target.value)}
                                    rows={3}
                                    placeholder="Key achievements and successes during this period..."
                                    className="w-full rounded-md border border-gray-200 p-2 text-sm"
                                />
                                {errors.highlights && <p className="text-sm text-red-500">{errors.highlights}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="challenges">Challenges</Label>
                                <Textarea
                                    id="challenges"
                                    value={data.challenges}
                                    onChange={(e) => setData('challenges', e.target.value)}
                                    rows={3}
                                    placeholder="Difficulties and obstacles faced..."
                                    className="w-full rounded-md border border-gray-200 p-2 text-sm"
                                />
                                {errors.challenges && <p className="text-sm text-red-500">{errors.challenges}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="action_plan">Action Plan</Label>
                                <Textarea
                                    id="action_plan"
                                    value={data.action_plan}
                                    onChange={(e) => setData('action_plan', e.target.value)}
                                    rows={3}
                                    placeholder="Plan for addressing challenges and future improvements..."
                                    className="w-full rounded-md border border-gray-200 p-2 text-sm"
                                />
                                {errors.action_plan && <p className="text-sm text-red-500">{errors.action_plan}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="attachment">Attachment (Optional)</Label>
                                <Input
                                    id="attachment"
                                    type="file"
                                    onChange={(e) => setData('attachment', e.target.files?.[0] || null)}
                                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                                />
                                <p className="text-xs text-gray-500">
                                    Supported formats: PDF, Word, Excel, JPG, PNG (Max 10MB)
                                </p>
                                {errors.attachment && <p className="text-sm text-red-500">{errors.attachment}</p>}
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={closeFormModal} disabled={processing}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Saving...' : isEditing ? 'Update Record' : 'Create Record'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete Performance Record</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete this performance record? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={processing}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={handleDelete} disabled={processing}>
                                {processing ? 'Deleting...' : 'Delete Record'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CompanyLayout>
        );
    }

    return (
        <CompanyLayout company={company}>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Performance Records</h3>
                        <p className="text-sm text-gray-600">Track and manage company performance metrics</p>
                    </div>
                    <Button onClick={() => handleOpenDialog()}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Record
                    </Button>
                </div>

                {/* Records Table (Metrics separated into multiple columns) */}
                <div className="space-y-4">
                    <div className="overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Period
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Phase
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Items Sold
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ad Spend
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ROAS
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    RTS
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Notes
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                            </thead>

                            <tbody className="bg-white divide-y divide-gray-200">
                            {records.data.map((record) => (
                                <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{formatDate(record.start_date)}</div>
                                        <div className="text-sm text-gray-500">to {formatDate(record.end_date)}</div>
                                    </td>

                                    <td className="px-6 py-4">
                      <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPhaseColor(
                              record.phase,
                          )}`}
                      >
                        {record.phase}
                      </span>
                                    </td>

                                    <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                                        {record.no_of_items.toLocaleString()}
                                    </td>

                                    <td className="px-6 py-4 text-right text-sm font-medium text-blue-600">
                                        {formatCurrency(record.avg_ads_spent)}
                                    </td>

                                    <td className="px-6 py-4 text-right text-sm font-medium text-green-600">
                                        {record.roas}x
                                    </td>

                                    <td className="px-6 py-4 text-right text-sm font-medium text-purple-600">
                                        {record.rts}%
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="space-y-3 max-w-xs">
                                            {record.highlights && (
                                                <div className="flex items-start gap-2">
                                                    <CheckCircle className="mt-0.5 h-4 w-4 text-green-500 flex-shrink-0" />
                                                    <div className="text-sm">
                                                        <div className="font-medium text-gray-700">Highlights</div>
                                                        <div className="text-gray-600 line-clamp-2">{record.highlights}</div>
                                                    </div>
                                                </div>
                                            )}

                                            {record.challenges && (
                                                <div className="flex items-start gap-2">
                                                    <AlertTriangle className="mt-0.5 h-4 w-4 text-yellow-500 flex-shrink-0" />
                                                    <div className="text-sm">
                                                        <div className="font-medium text-gray-700">Challenges</div>
                                                        <div className="text-gray-600 line-clamp-2">{record.challenges}</div>
                                                    </div>
                                                </div>
                                            )}

                                            {record.action_plan && (
                                                <div className="flex items-start gap-2">
                                                    <Target className="mt-0.5 h-4 w-4 text-blue-500 flex-shrink-0" />
                                                    <div className="text-sm">
                                                        <div className="font-medium text-gray-700">Action Plan</div>
                                                        <div className="text-gray-600 line-clamp-2">{record.action_plan}</div>
                                                    </div>
                                                </div>
                                            )}

                                            {!record.highlights && !record.challenges && !record.action_plan && (
                                                <span className="text-sm text-gray-400 italic">No notes</span>
                                            )}
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleOpenDialog(record)}
                                                className="h-8 w-8 p-0"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                                                onClick={() => openDeleteDialog(record)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {records.total > records.per_page && (
                        <div className="flex items-center justify-between px-6 py-3 bg-gray-50">
                            <div className="text-sm text-gray-700">
                                Showing <span className="font-medium">{records.from}</span> to{' '}
                                <span className="font-medium">{records.to}</span> of{' '}
                                <span className="font-medium">{records.total}</span> results
                            </div>

                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => loadPage(records.current_page - 1)}
                                    disabled={!records.prev_page_url}
                                >
                                    Previous
                                </Button>

                                <div className="flex items-center space-x-1">
                                    {records.links.slice(1, -1).map((link, index) => (
                                        <Button
                                            key={index}
                                            variant={link.active ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => link.url && loadPage(parseInt(link.label, 10))}
                                            disabled={!link.url}
                                        >
                                            {link.label}
                                        </Button>
                                    ))}
                                </div>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => loadPage(records.current_page + 1)}
                                    disabled={!records.next_page_url}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Add/Edit Dialog */}
                <Dialog open={isOpen} onOpenChange={handleFormOpenChange}>
                    <DialogContent className="max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{isEditing ? 'Edit Performance Record' : 'Add Performance Record'}</DialogTitle>
                            <DialogDescription>
                                {isEditing
                                    ? 'Update the performance record details below.'
                                    : 'Fill in the details to create a new performance record.'}
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* same form fields as above (keep your existing form block) */}
                            {/* If you want, I can DRY this into a component to avoid duplication. */}
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="start_date">Start Date *</Label>
                                    <Input
                                        id="start_date"
                                        type="date"
                                        value={data.start_date}
                                        onChange={(e) => setData('start_date', e.target.value)}
                                        required
                                    />
                                    {errors.start_date && <p className="text-sm text-red-500">{errors.start_date}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="end_date">End Date *</Label>
                                    <Input
                                        id="end_date"
                                        type="date"
                                        value={data.end_date}
                                        onChange={(e) => setData('end_date', e.target.value)}
                                        required
                                    />
                                    {errors.end_date && <p className="text-sm text-red-500">{errors.end_date}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phase">Phase *</Label>
                                <Select value={data.phase} onValueChange={(value) => setData('phase', value as Phase)}>
                                    <SelectTrigger>
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
                                {errors.phase && <p className="text-sm text-red-500">{errors.phase}</p>}
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="no_of_items">Items Sold *</Label>
                                    <Input
                                        id="no_of_items"
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={data.no_of_items}
                                        onChange={(e) => setData('no_of_items', e.target.value)}
                                        required
                                    />
                                    {errors.no_of_items && <p className="text-sm text-red-500">{errors.no_of_items}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="avg_ads_spent">Average Ad Spend (₱) *</Label>
                                    <Input
                                        id="avg_ads_spent"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={data.avg_ads_spent}
                                        onChange={(e) => setData('avg_ads_spent', e.target.value)}
                                        required
                                    />
                                    {errors.avg_ads_spent && <p className="text-sm text-red-500">{errors.avg_ads_spent}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="roas">ROAS *</Label>
                                    <Input
                                        id="roas"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={data.roas}
                                        onChange={(e) => setData('roas', e.target.value)}
                                        required
                                    />
                                    {errors.roas && <p className="text-sm text-red-500">{errors.roas}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="rts">RTS (%) *</Label>
                                    <Input
                                        id="rts"
                                        type="number"
                                        min="0"
                                        max="100"
                                        step="0.1"
                                        value={data.rts}
                                        onChange={(e) => setData('rts', e.target.value)}
                                        required
                                    />
                                    {errors.rts && <p className="text-sm text-red-500">{errors.rts}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="highlights">Highlights</Label>
                                <Textarea
                                    id="highlights"
                                    value={data.highlights}
                                    onChange={(e) => setData('highlights', e.target.value)}
                                    rows={3}
                                    className="w-full rounded-md border border-gray-200 p-2 text-sm"
                                />
                                {errors.highlights && <p className="text-sm text-red-500">{errors.highlights}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="challenges">Challenges</Label>
                                <Textarea
                                    id="challenges"
                                    value={data.challenges}
                                    onChange={(e) => setData('challenges', e.target.value)}
                                    rows={3}
                                    className="w-full rounded-md border border-gray-200 p-2 text-sm"
                                />
                                {errors.challenges && <p className="text-sm text-red-500">{errors.challenges}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="action_plan">Action Plan</Label>
                                <Textarea
                                    id="action_plan"
                                    value={data.action_plan}
                                    onChange={(e) => setData('action_plan', e.target.value)}
                                    rows={3}
                                    className="w-full rounded-md border border-gray-200 p-2 text-sm"
                                />
                                {errors.action_plan && <p className="text-sm text-red-500">{errors.action_plan}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="attachment">Attachment (Optional)</Label>
                                <Input
                                    id="attachment"
                                    type="file"
                                    onChange={(e) => setData('attachment', e.target.files?.[0] || null)}
                                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                                />
                                {errors.attachment && <p className="text-sm text-red-500">{errors.attachment}</p>}
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={closeFormModal} disabled={processing}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Saving...' : isEditing ? 'Update Record' : 'Create Record'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete Performance Record</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete this performance record? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={processing}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={handleDelete} disabled={processing}>
                                {processing ? 'Deleting...' : 'Delete Record'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </CompanyLayout>
    );
}
