import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

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

import { useForm } from '@inertiajs/react';
import {
    AlertCircle,
    Calendar,
    CheckCircle,
    DollarSign,
    FileText,
    Package,
    Plus,
    Target,
    TrendingUp,
} from 'lucide-react';
import { ChangeEvent, useMemo, useState } from 'react';

// Plate Editor components
import { Editor, EditorContainer } from '@/components/ui/editor';
import { parseHtmlString, serializeHtml } from '@udecode/plate-serializer-html';
import { Plate, ReactPlugin } from 'platejs/react';

interface PerformanceRecord {
    id?: number;
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
}

type FormData = {
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
    attachment_path: File | null; // IMPORTANT: File for upload
};

// Custom RichTextEditor component that uses your existing Editor
function RichTextEditor({
    value,
    onChange,
    placeholder,
    className,
}: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}) {
    const initialValue = useMemo(() => {
        if (!value || value.trim() === '') {
            return [{ type: 'p', children: [{ text: '' }] }];
        }
        try {
            const parsed = parseHtmlString(value);
            return parsed.length > 0
                ? parsed
                : [{ type: 'p', children: [{ text: '' }] }];
        } catch {
            return [{ type: 'p', children: [{ text: '' }] }];
        }
    }, [value]);

    const plugins = useMemo(() => {
        return ReactPlugin(
            [
                { key: 'basicElements', plugins: [] },
                { key: 'basicMarks', plugins: [] },
                { key: 'list', plugins: [] },
                { key: 'heading', plugins: [] },
                { key: 'blockquote', plugins: [] },
            ],
            { components: {} },
        );
    }, []);

    const handleChange = (newValue: any[]) => {
        try {
            const html = serializeHtml({ children: newValue });
            onChange(html);
        } catch (error) {
            console.error('Error serializing editor content:', error);
            const plainText = newValue
                .map((node) =>
                    node?.children
                        ? node.children
                              .map((child: any) => child.text || '')
                              .join('')
                        : '',
                )
                .join('\n');
            onChange(`<p>${plainText}</p>`);
        }
    };

    return (
        <div className={className}>
            <Plate
                plugins={plugins}
                initialValue={initialValue}
                onChange={handleChange}
            >
                <EditorContainer>
                    <Editor
                        placeholder={placeholder}
                        variant="default"
                        className="min-h-[120px]"
                    />
                </EditorContainer>
            </Plate>
        </div>
    );
}

export default function PerformanceTab() {
    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingRecord, setEditingRecord] =
        useState<PerformanceRecord | null>(null);

    // Mock data - replace with actual data from props
    const [performanceRecords, setPerformanceRecords] = useState<
        PerformanceRecord[]
    >([
        {
            id: 1,
            start_date: '2024-01-01',
            end_date: '2024-01-31',
            phase: 'Launch',
            no_of_items: 150,
            avg_ads_spent: '5000.00',
            roas: '3.5',
            rts: '85.5',
            highlights:
                '<p>Successful launch with <strong>strong initial sales</strong></p><ul><li>Exceeded sales targets by 20%</li><li>Positive customer feedback</li><li>High engagement on social media</li></ul>',
            challenges:
                '<p>Initial ad costs were <em>higher than expected</em></p><ol><li>CPC increased by 15%</li><li>Inventory management issues</li><li>Longer shipping times</li></ol>',
            action_plan:
                '<p>Optimize ad targeting and reduce CPA:</p><ul><li>Refine audience segments</li><li>Test new ad creatives</li><li>Implement better inventory tracking system</li></ul>',
            attachment_path: '/reports/q1-2024.pdf',
        },
        {
            id: 2,
            start_date: '2024-02-01',
            end_date: '2024-02-29',
            phase: 'Growth',
            no_of_items: 250,
            avg_ads_spent: '7500.00',
            roas: '4.2',
            rts: '92.3',
            highlights:
                '<p>Increased ROAS by <strong>20%</strong> from previous month</p><ul><li>Improved conversion rate</li><li>Better ad performance</li><li>Expanded to new markets</li></ul>',
            challenges:
                '<p>Inventory management issues:</p><ol><li>Stockouts on popular items</li><li>Warehouse capacity limitations</li><li>Supplier delays</li></ol>',
            action_plan:
                '<p>Implement better inventory tracking system:</p><ul><li>Real-time inventory updates</li><li>Automated reordering</li><li>Supplier communication improvements</li></ul>',
            attachment_path: null,
        },
    ]);

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm<FormData>({
            start_date: '',
            end_date: '',
            phase: '',
            no_of_items: 0,
            avg_ads_spent: '0.00',
            roas: '0.00',
            rts: '0.00',
            highlights: '',
            challenges: '',
            action_plan: '',
            attachment_path: null,
        });

    const phases = ['Launch', 'Growth', 'Maturity', 'Optimization', 'Scale'];

    const handleClose = () => {
        setIsOpen(false);
        setIsEditing(false);
        setEditingRecord(null);
        clearErrors();
        reset();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // IMPORTANT FIX:
        // With useForm, DO NOT pass `data` as the 2nd argument.
        // Call post/put with options only. Inertia will submit internal `data`.
        if (editingRecord?.id) {
            put(`/performance/${editingRecord.id}`, {
                preserveScroll: true,
                forceFormData: true, // IMPORTANT for File uploads
                onSuccess: () => handleClose(),
            });
        } else {
            post('/performance', {
                preserveScroll: true,
                forceFormData: true, // IMPORTANT for File uploads
                onSuccess: () => handleClose(),
            });
        }
    };

    const handleEdit = (record: PerformanceRecord) => {
        setEditingRecord(record);
        setIsEditing(true);

        setData({
            start_date: record.start_date,
            end_date: record.end_date,
            phase: record.phase,
            no_of_items: record.no_of_items,
            avg_ads_spent: record.avg_ads_spent,
            roas: record.roas,
            rts: record.rts,
            highlights: record.highlights,
            challenges: record.challenges,
            action_plan: record.action_plan,
            attachment_path: null, // reset file on edit
        });

        setIsOpen(true);
    };

    const handleDelete = (id: number) => {
        if (
            confirm('Are you sure you want to delete this performance record?')
        ) {
            // Replace with your real delete call
            setPerformanceRecords((prev) => prev.filter((r) => r.id !== id));
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setData('attachment_path', file);
    };

    const formatCurrency = (amount: string) => {
        const n = Number(amount || 0);
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        }).format(Number.isFinite(n) ? n : 0);
    };

    const getPhaseColor = (phase: string) => {
        const colors: Record<string, string> = {
            Launch: 'bg-blue-100 text-blue-800',
            Growth: 'bg-green-100 text-green-800',
            Maturity: 'bg-yellow-100 text-yellow-800',
            Optimization: 'bg-purple-100 text-purple-800',
            Scale: 'bg-orange-100 text-orange-800',
        };
        return colors[phase] || 'bg-gray-100 text-gray-800';
    };

    const getRoasColor = (roas: string) => {
        const v = parseFloat(roas);
        if (v >= 4) return 'text-green-600';
        if (v >= 2) return 'text-yellow-600';
        return 'text-red-600';
    };

    const renderHtmlContent = (htmlString: string) => (
        <div
            className="prose prose-sm max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: htmlString }}
        />
    );

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">
                    Performance Metrics
                </h3>

                <Button
                    size="sm"
                    onClick={() => {
                        setIsOpen(true);
                        setIsEditing(false);
                        setEditingRecord(null);
                        clearErrors();
                        reset();
                    }}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Performance Record
                </Button>
            </div>

            {performanceRecords.length === 0 ? (
                <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                    <TrendingUp className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-sm font-semibold text-gray-900">
                        No Performance Records
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Add your first performance record to track metrics and
                        progress.
                    </p>
                    <Button className="mt-4" onClick={() => setIsOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Record
                    </Button>
                </div>
            ) : (
                <div className="space-y-4">
                    {performanceRecords.map((record) => (
                        <div
                            key={record.id}
                            className="rounded-lg border border-gray-200 bg-white p-4"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getPhaseColor(record.phase)}`}
                                        >
                                            {record.phase}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            <Calendar className="mr-1 inline h-3 w-3" />
                                            {record.start_date} -{' '}
                                            {record.end_date}
                                        </span>
                                    </div>
                                    <h4 className="mt-2 text-sm font-medium text-gray-900">
                                        Performance Overview
                                    </h4>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleEdit(record)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() =>
                                            record.id && handleDelete(record.id)
                                        }
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>

                            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                                        <Package className="h-3.5 w-3.5" />
                                        Items Sold
                                    </div>
                                    <div className="text-xl font-bold text-gray-900">
                                        {record.no_of_items.toLocaleString()}
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                                        <DollarSign className="h-3.5 w-3.5" />
                                        Avg. Ad Spend
                                    </div>
                                    <div className="text-xl font-bold text-gray-900">
                                        {formatCurrency(record.avg_ads_spent)}
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                                        <Target className="h-3.5 w-3.5" />
                                        ROAS
                                    </div>
                                    <div
                                        className={`text-xl font-bold ${getRoasColor(record.roas)}`}
                                    >
                                        {record.roas}x
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                                        <TrendingUp className="h-3.5 w-3.5" />
                                        RTS (%)
                                    </div>
                                    <div className="text-xl font-bold text-gray-900">
                                        {record.rts}%
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                                        <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                                        Highlights
                                    </div>
                                    <div className="text-sm text-gray-700">
                                        {renderHtmlContent(record.highlights)}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                                        <AlertCircle className="h-3.5 w-3.5 text-yellow-500" />
                                        Challenges
                                    </div>
                                    <div className="text-sm text-gray-700">
                                        {renderHtmlContent(record.challenges)}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                                        <FileText className="h-3.5 w-3.5 text-blue-500" />
                                        Action Plan
                                    </div>
                                    <div className="text-sm text-gray-700">
                                        {renderHtmlContent(record.action_plan)}
                                    </div>
                                </div>
                            </div>

                            {record.attachment_path && (
                                <div className="mt-4 flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-gray-400" />
                                    <a
                                        href={record.attachment_path}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-blue-600 hover:text-blue-800"
                                    >
                                        View Attachment
                                    </a>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <Dialog
                open={isOpen}
                onOpenChange={(open) => {
                    if (!open) handleClose();
                    else setIsOpen(true);
                }}
            >
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[800px]">
                    <DialogHeader>
                        <DialogTitle>
                            {isEditing
                                ? 'Edit Performance Record'
                                : 'Add Performance Record'}
                        </DialogTitle>
                        <DialogDescription>
                            {isEditing
                                ? 'Update the performance metrics and details.'
                                : 'Track performance metrics for a specific period.'}
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
                                    disabled={processing}
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
                                    disabled={processing}
                                />
                                {errors.end_date && (
                                    <p className="text-sm text-red-500">
                                        {errors.end_date}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Phase *</Label>
                            <Select
                                value={data.phase}
                                onValueChange={(v) => setData('phase', v)}
                                disabled={processing}
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
                                    Number of Items Sold *
                                </Label>
                                <Input
                                    id="no_of_items"
                                    type="number"
                                    min="0"
                                    value={data.no_of_items}
                                    onChange={(e) =>
                                        setData(
                                            'no_of_items',
                                            parseInt(
                                                e.target.value || '0',
                                                10,
                                            ) || 0,
                                        )
                                    }
                                    required
                                    disabled={processing}
                                />
                                {errors.no_of_items && (
                                    <p className="text-sm text-red-500">
                                        {errors.no_of_items}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="avg_ads_spent">
                                    Average Ad Spend *
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
                                    disabled={processing}
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
                                <Label htmlFor="roas">ROAS *</Label>
                                <Input
                                    id="roas"
                                    type="number"
                                    min="0"
                                    step="0.1"
                                    value={data.roas}
                                    onChange={(e) =>
                                        setData('roas', e.target.value)
                                    }
                                    required
                                    disabled={processing}
                                    placeholder="e.g., 3.5"
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
                                    disabled={processing}
                                    placeholder="e.g., 85.5"
                                />
                                {errors.rts && (
                                    <p className="text-sm text-red-500">
                                        {errors.rts}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Highlights</Label>
                            <RichTextEditor
                                value={data.highlights}
                                onChange={(v) => setData('highlights', v)}
                                placeholder="Key achievements and successes during this period"
                                className="rounded-md border border-input bg-background"
                            />
                            {errors.highlights && (
                                <p className="text-sm text-red-500">
                                    {errors.highlights}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Challenges</Label>
                            <RichTextEditor
                                value={data.challenges}
                                onChange={(v) => setData('challenges', v)}
                                placeholder="Challenges and obstacles faced"
                                className="rounded-md border border-input bg-background"
                            />
                            {errors.challenges && (
                                <p className="text-sm text-red-500">
                                    {errors.challenges}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Action Plan</Label>
                            <RichTextEditor
                                value={data.action_plan}
                                onChange={(v) => setData('action_plan', v)}
                                placeholder="Steps to address challenges and improve performance"
                                className="rounded-md border border-input bg-background"
                            />
                            {errors.action_plan && (
                                <p className="text-sm text-red-500">
                                    {errors.action_plan}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="attachment">Attachment</Label>
                            <div className="flex items-center gap-4">
                                <Input
                                    id="attachment"
                                    type="file"
                                    onChange={handleFileChange}
                                    disabled={processing}
                                    className="flex-1"
                                />
                                {data.attachment_path && (
                                    <span className="text-sm text-gray-600">
                                        {data.attachment_path.name}
                                    </span>
                                )}
                            </div>
                            {errors.attachment_path && (
                                <p className="text-sm text-red-500">
                                    {errors.attachment_path}
                                </p>
                            )}
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                                disabled={processing}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing
                                    ? 'Saving...'
                                    : isEditing
                                      ? 'Update Record'
                                      : 'Add Record'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
