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


import { useForm } from '@inertiajs/react';
import { CheckCircle, Edit, Plus, Trash2, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import CompanyLayout from '@/pages/companies/company/company-layout';
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
    total_revenue?: string | number | null;
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

interface PerformanceFormData {
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

export default function PerformanceTab({ company }: PerformanceProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingRecord, setEditingRecord] = useState<PerformanceRecord | null>(null);
    const [performanceRecords, setPerformanceRecords] = useState<PerformanceRecord[]>([]);

    // Initialize with company records from backend
    useEffect(() => {
        if (company.records && company.records.length > 0) {
            setPerformanceRecords(company.records);
        }
    }, [company.records]);

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm<PerformanceFormData>({
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
                no_of_items: record.no_of_items.toString(),
                avg_ads_spent: typeof record.avg_ads_spent === 'number'
                    ? record.avg_ads_spent.toString()
                    : record.avg_ads_spent || '',
                roas: typeof record.roas === 'number'
                    ? record.roas.toString()
                    : record.roas || '',
                rts: typeof record.rts === 'number'
                    ? record.rts.toString()
                    : record.rts || '',
                highlights: record.highlights || '',
                challenges: record.challenges || '',
                action_plan: record.action_plan || '',
                attachment: null,
            });
        } else {
            setIsEditing(false);
            setEditingRecord(null);
            reset({
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
        }
        setIsOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Prepare form data
        const formData = new FormData();

        // Append all form data
        formData.append('start_date', data.start_date);
        formData.append('end_date', data.end_date);
        formData.append('phase', data.phase);
        formData.append('no_of_items', data.no_of_items);
        formData.append('avg_ads_spent', data.avg_ads_spent);
        formData.append('roas', data.roas);
        formData.append('rts', data.rts);
        formData.append('highlights', data.highlights);
        formData.append('challenges', data.challenges);
        formData.append('action_plan', data.action_plan);

        if (data.attachment instanceof File) {
            formData.append('attachment', data.attachment);
        }

        if (isEditing && editingRecord) {
            // Handle update - use post with _method=PUT for Inertia
            formData.append('_method', 'PUT');
            post(`/companies/${company.id}/performance-records/${editingRecord.id}`, {
                data: formData,
                preserveScroll: true,
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                },
                onError: (errors) => {
                    console.error('Update errors:', errors);
                },
            });
        } else {
            // Handle create
            post(`/companies/${company.id}/performance-records`, {
                data: formData,
                preserveScroll: true,
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                },
                onError: (errors) => {
                    console.error('Create errors:', errors);
                },
            });
        }
    };

    const handleDelete = (recordId: number) => {
        if (confirm('Are you sure you want to delete this performance record?')) {
            destroy(`/companies/${company.id}/performance-records/${recordId}`, {
                preserveScroll: true,
                onSuccess: () => {
                    // Remove from local state
                    setPerformanceRecords(prev => prev.filter(record => record.id !== recordId));
                },
                onError: (errors) => {
                    console.error('Delete errors:', errors);
                },
            });
        }
    };

    const formatCurrency = (amount: string | number | null | undefined): string => {
        if (amount === null || amount === undefined) return '$0.00';

        const num = typeof amount === 'string' ? parseFloat(amount) : amount;
        if (isNaN(num as number)) return '$0.00';

        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(num as number);
    };

    const formatDate = (dateString: string | null | undefined): string => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Invalid Date';

            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        } catch (e) {
            return 'Invalid Date';
        }
    };

    const calculateROASColor = (roas: string | number | null | undefined): string => {
        if (roas === null || roas === undefined) return 'text-gray-600';

        const roasNum = typeof roas === 'string' ? parseFloat(roas) : roas;
        if (isNaN(roasNum as number)) return 'text-gray-600';

        if (roasNum >= 4) return 'text-green-600';
        if (roasNum >= 2) return 'text-yellow-600';
        return 'text-red-600';
    };

    const calculateRTSColor = (rts: string | number | null | undefined): string => {
        if (rts === null || rts === undefined) return 'text-gray-600';

        const rtsNum = typeof rts === 'string' ? parseFloat(rts) : rts;
        if (isNaN(rtsNum as number)) return 'text-gray-600';

        if (rtsNum >= 90) return 'text-green-600';
        if (rtsNum >= 70) return 'text-yellow-600';
        return 'text-red-600';
    };

    const parseToFloat = (value: string | number | null | undefined): number => {
        if (value === null || value === undefined) return 0;
        const num = typeof value === 'string' ? parseFloat(value) : value;
        return isNaN(num as number) ? 0 : num as number;
    };

    // Calculate totals
    const totalRevenue = performanceRecords.reduce((sum, record) => {
        return sum + parseToFloat(record.total_revenue);
    }, 0);

    const totalAdsSpent = performanceRecords.reduce((sum, record) => {
        return sum + parseToFloat(record.avg_ads_spent);
    }, 0);

    const totalItemsSold = performanceRecords.reduce((sum, record) => {
        return sum + (record.no_of_items || 0);
    }, 0);

    const avgROAS = performanceRecords.length > 0
        ? performanceRecords.reduce((sum, record) => {
        return sum + parseToFloat(record.roas);
    }, 0) / performanceRecords.length
        : 0;

    const avgRTS = performanceRecords.length > 0
        ? performanceRecords.reduce((sum, record) => {
        return sum + parseToFloat(record.rts);
    }, 0) / performanceRecords.length
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
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        <div className="rounded-lg border border-gray-200 bg-white p-4">
                            <div className="text-sm text-gray-600">
                                Total Revenue
                            </div>
                            <div className="text-xl font-bold text-green-600">
                                {formatCurrency(totalRevenue)}
                            </div>
                        </div>
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
                                {isNaN(avgROAS)
                                    ? '0.0x'
                                    : `${avgROAS.toFixed(1)}x`}
                            </div>
                        </div>
                    </div>
                )}

                {/* Performance Records */}
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
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-gray-900">
                            Performance History ({performanceRecords.length}{' '}
                            records)
                        </h4>
                        {performanceRecords.map((record) => (
                            <div
                                key={record.id}
                                className="rounded-lg border border-gray-200 bg-white p-5 transition-all hover:border-gray-300 hover:shadow-sm"
                            >
                                <div className="mb-4 flex items-start justify-between">
                                    <div>
                                        <div className="mb-2 flex items-center gap-2">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                    record.phase === 'Testing'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : 'bg-green-100 text-green-800'
                                                }`}
                                            >
                                                {record.phase}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {formatDate(record.start_date)}{' '}
                                                - {formatDate(record.end_date)}
                                            </span>
                                        </div>
                                        <h4 className="text-base font-semibold text-gray-900">
                                            Performance Report #{record.id}
                                        </h4>
                                        {record.total_revenue && (
                                            <p className="mt-1 text-sm text-gray-600">
                                                Revenue:{' '}
                                                {formatCurrency(
                                                    record.total_revenue,
                                                )}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                                handleOpenDialog(record)
                                            }
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                            onClick={() =>
                                                handleDelete(record.id)
                                            }
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                                    <div className="rounded bg-gray-50 p-3">
                                        <div className="mb-1 text-xs text-gray-600">
                                            Items Sold
                                        </div>
                                        <div className="font-semibold text-gray-900">
                                            {record.no_of_items.toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="rounded bg-gray-50 p-3">
                                        <div className="mb-1 text-xs text-gray-600">
                                            Ad Spend
                                        </div>
                                        <div className="font-semibold text-blue-600">
                                            {formatCurrency(
                                                record.avg_ads_spent,
                                            )}
                                        </div>
                                    </div>
                                    <div className="rounded bg-gray-50 p-3">
                                        <div className="mb-1 text-xs text-gray-600">
                                            ROAS
                                        </div>
                                        <div
                                            className={`font-semibold ${calculateROASColor(record.roas)}`}
                                        >
                                            {parseToFloat(record.roas).toFixed(
                                                1,
                                            )}
                                            x
                                        </div>
                                    </div>
                                    <div className="rounded bg-gray-50 p-3">
                                        <div className="mb-1 text-xs text-gray-600">
                                            RTS
                                        </div>
                                        <div
                                            className={`font-semibold ${calculateRTSColor(record.rts)}`}
                                        >
                                            {parseToFloat(record.rts).toFixed(
                                                1,
                                            )}
                                            %
                                        </div>
                                    </div>
                                </div>

                                {record.highlights && (
                                    <div className="mb-3">
                                        <div className="mb-2 flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                            <span className="text-sm font-medium text-gray-900">
                                                Highlights
                                            </span>
                                        </div>
                                        <p className="pl-6 text-sm text-gray-600">
                                            {record.highlights}
                                        </p>
                                    </div>
                                )}

                                {record.challenges && (
                                    <div className="mb-3">
                                        <div className="mb-2 flex items-center gap-2">
                                            <span className="text-sm font-medium text-gray-900">
                                                Challenges
                                            </span>
                                        </div>
                                        <p className="pl-6 text-sm text-gray-600">
                                            {record.challenges}
                                        </p>
                                    </div>
                                )}

                                {record.action_plan && (
                                    <div>
                                        <div className="mb-2 flex items-center gap-2">
                                            <span className="text-sm font-medium text-gray-900">
                                                Action Plan
                                            </span>
                                        </div>
                                        <p className="pl-6 text-sm text-gray-600">
                                            {record.action_plan}
                                        </p>
                                    </div>
                                )}

                                <div className="mt-4 flex justify-between border-t pt-4 text-xs text-gray-500">
                                    <span>
                                        Created: {formatDate(record.created_at)}
                                    </span>
                                    {record.updated_at !==
                                        record.created_at && (
                                        <span>
                                            Updated:{' '}
                                            {formatDate(record.updated_at)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
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
                                    Average Ad Spend ($) *
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
        </CompanyLayout>
    );
}
