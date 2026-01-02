import React, { useEffect, useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { CheckCircle, Edit, Plus, Trash2, TrendingUp, AlertCircle, Target, AlertTriangle } from 'lucide-react';

import CompanyLayout from '@/pages/companies/company/company-layout';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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

// Define interfaces matching backend structure
interface PerformanceRecord {
    id: number;
    company_id: number;
    start_date: string;
    end_date: string;
    phase: 'Testing' | 'Scaling' | string;
    no_of_items: number;
    avg_ads_spent: string | number;
    roas: string | number;
    rts: string | number;
    gross_profit?: string | number | null;
    profit_margin?: string | number | null;
    highlights: string | null;
    challenges: string | null;
    action_plan: string | null;
    attachment_path: string | null;
    created_at: string;
    updated_at: string;
    created_by?: number | null;
    updated_by?: number | null;
}

interface Company {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    logo: string | null;
    logo_url?: string;
    owner_photo: string | null;
    status: string;
    notarization_status: string;
    erp_status: string;
    sales_activity: string;
    level: string;
    sponsor_id: number | null;
    coach_id: number | null;
    checklist_percentage?: number;
    created_at: string;
    updated_at: string;
    records?: PerformanceRecord[];
    sponsor?: {
        id: number;
        name: string;
    };
    owners?: Array<{
        id: number;
        name: string;
        email: string;
        phone?: string;
        facebook?: string;
        address?: string;
        birthdate?: string;
    }>;
}

interface PerformanceProps {
    company: Company;
}

const phases = ['Testing', 'Scaling'] as const;

export default function PerformanceTab({ company }: PerformanceProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingRecord, setEditingRecord] = useState<PerformanceRecord | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState<PerformanceRecord | null>(null);
    const [performanceRecords, setPerformanceRecords] = useState<PerformanceRecord[]>([]);

    // Initialize with company records from backend
    useEffect(() => {
        setPerformanceRecords(company.records ?? []);
    }, [company.records]);

    const { data, setData, post, delete: destroy, processing, errors, reset } =
        useForm({
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

    const handleOpenDialog = (record?: PerformanceRecord) => {
        if (record) {
            setIsEditing(true);
            setEditingRecord(record);

            setData({
                start_date: record.start_date,
                end_date: record.end_date,
                phase: record.phase,
                no_of_items: String(record.no_of_items ?? ''),
                avg_ads_spent: String(record.avg_ads_spent ?? ''),
                roas: String(record.roas ?? ''),
                rts: String(record.rts ?? ''),
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const url = isEditing && editingRecord
            ? `/companies/${company.id}/performance-records/${editingRecord.id}`
            : `/companies/${company.id}/performance-records`;

        const submitData = isEditing
            ? { ...data, _method: 'PUT' }
            : data;

        post(url, submitData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                router.reload({ only: ['company'] });
                setIsOpen(false);
                reset();
            },
            onError: (errs) => console.error('Submit errors:', errs),
        });
    };

    const handleDelete = (recordId: number) => {
        if (!recordToDelete) return;

        destroy(`/companies/${company.id}/performance-records/${recordId}`, {
            preserveScroll: true,
            onSuccess: () => {
                // Update local list immediately
                setPerformanceRecords((prev) =>
                    prev.filter((r) => r.id !== recordId),
                );
                setDeleteDialogOpen(false);
                setRecordToDelete(null);
                router.reload({ only: ['company'] });
            },
            onError: (errs) => console.error('Delete errors:', errs),
        });
    };

    const openDeleteDialog = (record: PerformanceRecord) => {
        setRecordToDelete(record);
        setDeleteDialogOpen(true);
    };

    const parseToFloat = (value: string | number | null | undefined): number => {
        if (value === null || value === undefined) return 0;
        const num = typeof value === 'string' ? Number(value) : value;
        return Number.isFinite(num) ? num : 0;
    };

    const formatCurrency = (amount: string | number | null | undefined) => {
        const num =
            typeof amount === 'string'
                ? Number(amount)
                : typeof amount === 'number'
                    ? amount
                    : 0;

        if (!Number.isFinite(num)) return '₱0.00';

        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(num);
    };

    const formatDate = (dateString: string | null | undefined): string => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        if (Number.isNaN(date.getTime())) return 'Invalid Date';

        return date.toLocaleDateString('en-PH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const calculateROASColor = (roas: string | number | null | undefined) => {
        const roasNum = parseToFloat(roas);
        if (roasNum >= 4) return 'text-green-600';
        if (roasNum >= 2) return 'text-yellow-600';
        return 'text-red-600';
    };

    const calculateRTSColor = (rts: string | number | null | undefined) => {
        const rtsNum = parseToFloat(rts);
        if (rtsNum >= 90) return 'text-green-600';
        if (rtsNum >= 70) return 'text-yellow-600';
        return 'text-red-600';
    };

    // Totals
    const totalAdsSpent = performanceRecords.reduce(
        (sum, record) => sum + parseToFloat(record.avg_ads_spent),
        0,
    );

    const totalItemsSold = performanceRecords.reduce(
        (sum, record) => sum + (record.no_of_items || 0),
        0,
    );

    const avgROAS =
        performanceRecords.length > 0
            ? performanceRecords.reduce(
            (sum, r) => sum + parseToFloat(r.roas),
            0,
        ) / performanceRecords.length
            : 0;

    const avgRTS =
        performanceRecords.length > 0
            ? performanceRecords.reduce(
            (sum, r) => sum + parseToFloat(r.rts),
            0,
        ) / performanceRecords.length
            : 0;

    return (
        <CompanyLayout
            company={company}
            title={`${company.name} - Performance`}
        >
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            Performance Metrics
                        </h3>
                        <p className="text-sm text-gray-600">
                            Track business performance and growth metrics
                        </p>
                    </div>
                    <Button onClick={() => handleOpenDialog()}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Performance Record
                    </Button>
                </div>

                {/* Summary Statistics */}
                {performanceRecords.length > 0 && (
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                        <div className="rounded-lg border border-gray-200 bg-white p-4">
                            <div className="text-sm text-gray-600">
                                Total Ad Spend
                            </div>
                            <div className="text-xl font-bold text-blue-600">
                                {formatCurrency(totalAdsSpent)}
                            </div>
                        </div>
                        <div className="rounded-lg border border-gray-200 bg-white p-4">
                            <div className="text-sm text-gray-600">
                                Items Sold
                            </div>
                            <div className="text-xl font-bold text-purple-600">
                                {totalItemsSold.toLocaleString()}
                            </div>
                        </div>
                        <div className="rounded-lg border border-gray-200 bg-white p-4">
                            <div className="text-sm text-gray-600">
                                Avg ROAS
                            </div>
                            <div
                                className={`text-xl font-bold ${calculateROASColor(avgROAS)}`}
                            >
                                {Number.isFinite(avgROAS)
                                    ? `${avgROAS.toFixed(1)}x`
                                    : '0.0x'}
                            </div>
                        </div>
                    </div>
                )}

                {/* Performance Records Table */}
                {performanceRecords.length === 0 ? (
                    <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                        <TrendingUp className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                        <h4 className="mb-2 text-lg font-medium text-gray-900">
                            No Performance Records
                        </h4>
                        <p className="mb-4 text-sm text-gray-500">
                            Start tracking your company's performance by adding
                            your first record.
                        </p>
                        <Button onClick={() => handleOpenDialog()}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add First Record
                        </Button>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                        <div className="border-b border-gray-200 p-4">
                            <h4 className="text-sm font-semibold text-gray-900">
                                Performance History ({performanceRecords.length}{' '}
                                records)
                            </h4>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                                        >
                                            Period & Phase
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                                        >
                                            Items Sold
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                                        >
                                            Ad Spend
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                                        >
                                            ROAS
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                                        >
                                            RTS
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                                        >
                                            Notes
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                                        >
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {performanceRecords.map((record) => (
                                        <tr
                                            key={record.id}
                                            className="transition-colors hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span
                                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                                record.phase ===
                                                                'Testing'
                                                                    ? 'bg-blue-100 text-blue-800'
                                                                    : 'bg-green-100 text-green-800'
                                                            }`}
                                                        >
                                                            {record.phase}
                                                        </span>
                                                    </div>
                                                    <div className="text-sm text-gray-900">
                                                        {formatDate(
                                                            record.start_date,
                                                        )}{' '}
                                                        -{' '}
                                                        {formatDate(
                                                            record.end_date,
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        Created:{' '}
                                                        {formatDate(
                                                            record.created_at,
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {record.no_of_items.toLocaleString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-blue-600">
                                                    {formatCurrency(
                                                        record.avg_ads_spent,
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div
                                                    className={`text-sm font-medium ${calculateROASColor(record.roas)}`}
                                                >
                                                    {parseToFloat(
                                                        record.roas,
                                                    ).toFixed(1)}
                                                    x
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div
                                                    className={`text-sm font-medium ${calculateRTSColor(record.rts)}`}
                                                >
                                                    {parseToFloat(
                                                        record.rts,
                                                    ).toFixed(1)}
                                                    %
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="max-w-xs space-y-1">
                                                    {record.highlights && (
                                                        <div className="flex items-start gap-2">
                                                            <CheckCircle className="mt-0.5 h-3 w-3 flex-shrink-0 text-green-500" />
                                                            <div className="text-xs">
                                                                <div className="font-medium text-gray-700">
                                                                    Highlights:
                                                                </div>
                                                                <div className="truncate text-gray-600">
                                                                    {
                                                                        record.highlights
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {record.challenges && (
                                                        <div className="flex items-start gap-2">
                                                            <AlertTriangle className="mt-0.5 h-3 w-3 flex-shrink-0 text-yellow-500" />
                                                            <div className="text-xs">
                                                                <div className="font-medium text-gray-700">
                                                                    Challenges:
                                                                </div>
                                                                <div className="truncate text-gray-600">
                                                                    {
                                                                        record.challenges
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {record.action_plan && (
                                                        <div className="flex items-start gap-2">
                                                            <Target className="mt-0.5 h-3 w-3 flex-shrink-0 text-blue-500" />
                                                            <div className="text-xs">
                                                                <div className="font-medium text-gray-700">
                                                                    Action Plan:
                                                                </div>
                                                                <div className="truncate text-gray-600">
                                                                    {
                                                                        record.action_plan
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {!record.highlights &&
                                                        !record.challenges &&
                                                        !record.action_plan && (
                                                            <div className="text-xs text-gray-400 italic">
                                                                No notes
                                                            </div>
                                                        )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            handleOpenDialog(
                                                                record,
                                                            )
                                                        }
                                                        className="h-8 w-8 p-0"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                                                        onClick={() =>
                                                            openDeleteDialog(
                                                                record,
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                {performanceRecords.length > 0 && (
                                    <tfoot className="bg-gray-50">
                                        <tr>
                                            <td className="px-6 py-3 text-sm font-medium text-gray-900">
                                                Totals / Averages
                                            </td>
                                            <td className="px-6 py-3 text-sm font-medium text-gray-900">
                                                {totalItemsSold.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-3 text-sm font-medium text-blue-600">
                                                {formatCurrency(totalAdsSpent)}
                                            </td>
                                            <td className="px-6 py-3 text-sm font-medium">
                                                <span
                                                    className={calculateROASColor(
                                                        avgROAS,
                                                    )}
                                                >
                                                    {avgROAS.toFixed(1)}x
                                                </span>
                                            </td>
                                            <td className="px-6 py-3 text-sm font-medium">
                                                <span
                                                    className={calculateRTSColor(
                                                        avgRTS,
                                                    )}
                                                >
                                                    {avgRTS.toFixed(1)}%
                                                </span>
                                            </td>
                                            <td className="px-6 py-3"></td>
                                            <td className="px-6 py-3"></td>
                                        </tr>
                                    </tfoot>
                                )}
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Performance Dialog */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            {isEditing ? (
                                <>
                                    <Edit className="h-5 w-5" />
                                    Edit Performance Record
                                </>
                            ) : (
                                <>
                                    <Plus className="h-5 w-5" />
                                    New Performance Record
                                </>
                            )}
                        </DialogTitle>
                        <DialogDescription>
                            {isEditing
                                ? 'Update performance metrics for this period'
                                : 'Add new performance record for tracking'}
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
                                    onChange={(e) =>
                                        setData('start_date', e.target.value)
                                    }
                                    required
                                />
                                {errors.start_date && (
                                    <p className="text-sm text-red-500">
                                        {errors.start_date}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="end_date">End Date *</Label>
                                <Input
                                    id="end_date"
                                    type="date"
                                    value={data.end_date}
                                    onChange={(e) =>
                                        setData('end_date', e.target.value)
                                    }
                                    required
                                />
                                {errors.end_date && (
                                    <p className="text-sm text-red-500">
                                        {errors.end_date}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phase">Phase *</Label>
                            <Select
                                value={data.phase}
                                onValueChange={(value) =>
                                    setData('phase', value)
                                }
                            >
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
                            {errors.phase && (
                                <p className="text-sm text-red-500">
                                    {errors.phase}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="no_of_items">
                                    Items Sold *
                                </Label>
                                <Input
                                    id="no_of_items"
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={data.no_of_items}
                                    onChange={(e) =>
                                        setData('no_of_items', e.target.value)
                                    }
                                    required
                                />
                                {errors.no_of_items && (
                                    <p className="text-sm text-red-500">
                                        {errors.no_of_items}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="avg_ads_spent">
                                    Average Ad Spend (₱) *
                                </Label>
                                <Input
                                    id="avg_ads_spent"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={data.avg_ads_spent}
                                    onChange={(e) =>
                                        setData('avg_ads_spent', e.target.value)
                                    }
                                    required
                                />
                                {errors.avg_ads_spent && (
                                    <p className="text-sm text-red-500">
                                        {errors.avg_ads_spent}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="roas">
                                    ROAS (Return on Ad Spend) *
                                </Label>
                                <Input
                                    id="roas"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={data.roas}
                                    onChange={(e) =>
                                        setData('roas', e.target.value)
                                    }
                                    required
                                />
                                {errors.roas && (
                                    <p className="text-sm text-red-500">
                                        {errors.roas}
                                    </p>
                                )}
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
                                    onChange={(e) =>
                                        setData('rts', e.target.value)
                                    }
                                    required
                                />
                                {errors.rts && (
                                    <p className="text-sm text-red-500">
                                        {errors.rts}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="highlights">Highlights</Label>
                            <Textarea
                                id="highlights"
                                value={data.highlights}
                                onChange={(e) =>
                                    setData('highlights', e.target.value)
                                }
                                rows={3}
                                placeholder="Key achievements and successes during this period..."
                                className="mt-2 w-full rounded-lg border border-slate-300 p-2"
                            />
                            {errors.highlights && (
                                <p className="text-sm text-red-500">
                                    {errors.highlights}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="challenges">Challenges</Label>
                            <Textarea
                                id="challenges"
                                value={data.challenges}
                                onChange={(e) =>
                                    setData('challenges', e.target.value)
                                }
                                rows={3}
                                placeholder="Difficulties and obstacles faced..."
                                className="mt-2 w-full rounded-lg border border-slate-300 p-2"
                            />
                            {errors.challenges && (
                                <p className="text-sm text-red-500">
                                    {errors.challenges}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="action_plan">Action Plan</Label>
                            <Textarea
                                id="action_plan"
                                value={data.action_plan}
                                onChange={(e) =>
                                    setData('action_plan', e.target.value)
                                }
                                rows={3}
                                placeholder="Plan for addressing challenges and future improvements..."
                                className="mt-2 w-full rounded-lg border border-slate-300 p-2"
                            />
                            {errors.action_plan && (
                                <p className="text-sm text-red-500">
                                    {errors.action_plan}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="attachment">
                                Attachment (Optional)
                            </Label>
                            <Input
                                id="attachment"
                                type="file"
                                onChange={(e) =>
                                    setData(
                                        'attachment',
                                        e.target.files?.[0] || null,
                                    )
                                }
                                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                            />
                            <p className="text-xs text-gray-500">
                                Supported formats: PDF, Word, Excel, JPG, PNG
                                (Max 10MB)
                            </p>
                            {errors.attachment && (
                                <p className="text-sm text-red-500">
                                    {errors.attachment}
                                </p>
                            )}
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsOpen(false)}
                                disabled={processing}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing
                                    ? 'Saving...'
                                    : isEditing
                                      ? 'Update Record'
                                      : 'Create Record'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-red-500" />
                            Delete Performance Record
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this performance
                            record? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>

                    {recordToDelete && (
                        <div className="space-y-3">
                            <div className="rounded-lg bg-red-50 p-4">
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                                            recordToDelete.phase === 'Testing'
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-green-100 text-green-800'
                                        }`}
                                    >
                                        {recordToDelete.phase}
                                    </div>
                                    <div className="text-sm font-medium text-gray-900">
                                        {formatDate(recordToDelete.start_date)}{' '}
                                        - {formatDate(recordToDelete.end_date)}
                                    </div>
                                </div>
                                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <span className="text-gray-600">
                                            Items:{' '}
                                        </span>
                                        <span className="font-medium">
                                            {recordToDelete.no_of_items.toLocaleString()}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">
                                            Ad Spend:{' '}
                                        </span>
                                        <span className="font-medium">
                                            {formatCurrency(
                                                recordToDelete.avg_ads_spent,
                                            )}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">
                                            ROAS:{' '}
                                        </span>
                                        <span
                                            className={`font-medium ${calculateROASColor(recordToDelete.roas)}`}
                                        >
                                            {parseToFloat(
                                                recordToDelete.roas,
                                            ).toFixed(1)}
                                            x
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">
                                            RTS:{' '}
                                        </span>
                                        <span
                                            className={`font-medium ${calculateRTSColor(recordToDelete.rts)}`}
                                        >
                                            {parseToFloat(
                                                recordToDelete.rts,
                                            ).toFixed(1)}
                                            %
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setDeleteDialogOpen(false);
                                setRecordToDelete(null);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={() =>
                                recordToDelete &&
                                handleDelete(recordToDelete.id)
                            }
                            disabled={processing}
                        >
                            {processing ? 'Deleting...' : 'Delete Record'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </CompanyLayout>
    );
}
