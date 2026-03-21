import React from 'react';
import { useForm, Link } from '@inertiajs/react';

import CompanyLayout from '@/pages/companies/company/company-layout';

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';
import { Textarea } from '@/components/ui/textarea';
import FileInput from '@/components/ui/file-input';

import { Company } from '@/types/models/Company';
import { PerformanceRecord } from '@/types/models/PerformanceRecord';
import {
    ArrowLeft,
    Save,
    Calendar,
    Hash,
    DollarSign,
    TrendingUp,
    Target,
    FileText,
} from 'lucide-react';

interface Props {
    company: Company;
    record: PerformanceRecord;
}

const Edit = ({ record, company }: Props) => {
    const { data, setData, errors, put, processing } = useForm({
        company_id: company.id,
        start_date: record.start_date,
        end_date: record.end_date,
        phase: record.phase,
        no_of_items: String(record.no_of_items),
        avg_ads_spent: String(record.avg_ads_spent),
        roas: String(record.roas),
        rts: String(record.rts),
        highlights: record.highlights || '',
        challenges: record.challenges || '',
        action_plan: record.action_plan || '',
        new_attachment: null,
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/companies/${company.id}/performance-records/${record.id}`);
    };

    const phases = [
        {
            value: 'Testing',
            label: 'Testing',
            color: 'bg-blue-50 text-blue-700',
        },
        {
            value: 'Maintaining',
            label: 'Maintaining',
            color: 'bg-yellow-50 text-yellow-700',
        },
        {
            value: 'Scaling',
            label: 'Scaling',
            color: 'bg-green-50 text-green-700',
        },
    ];

    return (
        <CompanyLayout company={company}>
            <div className="mx-auto max-w-7xl">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center space-x-3">
                                <Link
                                    href={`/companies/${company.id}/performance-records/${record.id}`}
                                    className="p-2 transition-colors duration-200 hover:bg-gray-100"
                                >
                                    <ArrowLeft className="h-5 w-5 text-gray-600" />
                                </Link>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900">
                                        Edit Performance Record
                                    </h1>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {company.name} • Update campaign
                                        performance data
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <form onSubmit={onSubmit} className="space-y-8">
                    {/* Date Range Card */}
                    <div className="overflow-hidden border border-gray-200 bg-white">
                        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                            <div className="flex items-center space-x-2">
                                <Calendar className="h-5 w-5 text-pink-500" />
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Date Range
                                </h2>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">
                                        Start Date{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        type="date"
                                        value={data.start_date}
                                        onChange={(e) =>
                                            setData(
                                                'start_date',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full border-gray-300 focus:border-pink-500 focus:ring-0"
                                    />
                                    <InputError message={errors.start_date} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">
                                        End Date{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        type="date"
                                        value={data.end_date}
                                        onChange={(e) =>
                                            setData('end_date', e.target.value)
                                        }
                                        className="w-full border-gray-300 focus:border-pink-500 focus:ring-0"
                                    />
                                    <InputError message={errors.end_date} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Performance Metrics Card */}
                    <div className="overflow-hidden border border-gray-200 bg-white">
                        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                            <div className="flex items-center space-x-2">
                                <TrendingUp className="h-5 w-5 text-pink-500" />
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Performance Metrics
                                </h2>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">
                                        Phase{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={data.phase}
                                        onValueChange={(value) =>
                                            setData('phase', value)
                                        }
                                    >
                                        <SelectTrigger className="w-full border-gray-300 focus:border-pink-500 focus:ring-0">
                                            <SelectValue placeholder="Select current phase" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {phases.map((phase) => (
                                                    <SelectItem
                                                        key={phase.value}
                                                        value={phase.value}
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <span
                                                                className={`px-2 py-0.5 text-xs font-medium ${phase.color}`}
                                                            >
                                                                {phase.label}
                                                            </span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.phase} />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">
                                        <div className="flex items-center space-x-1">
                                            <Hash className="h-4 w-4" />
                                            <span>Number of Items Tested</span>
                                        </div>
                                    </Label>
                                    <Input
                                        type="number"
                                        value={data.no_of_items}
                                        placeholder="e.g., 25"
                                        onChange={(e) =>
                                            setData(
                                                'no_of_items',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full border-gray-300 focus:border-pink-500 focus:ring-0"
                                    />
                                    <InputError message={errors.no_of_items} />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">
                                        <div className="flex items-center space-x-1">
                                            <DollarSign className="h-4 w-4" />
                                            <span>Average Ad Spend</span>
                                        </div>
                                    </Label>
                                    <div className="relative">
                                        <span className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-500">
                                            $
                                        </span>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            value={data.avg_ads_spent}
                                            placeholder="0.00"
                                            onChange={(e) =>
                                                setData(
                                                    'avg_ads_spent',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full border-gray-300 pl-7 focus:border-pink-500 focus:ring-0"
                                        />
                                    </div>
                                    <InputError
                                        message={errors.avg_ads_spent}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">
                                        <div className="flex items-center space-x-1">
                                            <Target className="h-4 w-4" />
                                            <span>
                                                ROAS (Return on Ad Spend)
                                            </span>
                                        </div>
                                    </Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        value={data.roas}
                                        placeholder="e.g., 3.5"
                                        onChange={(e) =>
                                            setData('roas', e.target.value)
                                        }
                                        className="w-full border-gray-300 focus:border-pink-500 focus:ring-0"
                                    />
                                    <InputError message={errors.roas} />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">
                                        RTS (Return to Scale)
                                    </Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        value={data.rts}
                                        placeholder="e.g., 1.2"
                                        onChange={(e) =>
                                            setData('rts', e.target.value)
                                        }
                                        className="w-full border-gray-300 focus:border-pink-500 focus:ring-0"
                                    />
                                    <InputError message={errors.rts} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Analysis Section */}
                    <div className="overflow-hidden border border-gray-200 bg-white">
                        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                            <div className="flex items-center space-x-2">
                                <FileText className="h-5 w-5 text-pink-500" />
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Campaign Analysis
                                </h2>
                            </div>
                        </div>
                        <div className="space-y-6 p-6">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">
                                    Highlights{' '}
                                    <span className="text-xs text-gray-500">
                                        (Key achievements and successes)
                                    </span>
                                </Label>
                                <Textarea
                                    rows={4}
                                    value={data.highlights}
                                    placeholder="What went well? Notable achievements, successful strategies, etc."
                                    onChange={(e) =>
                                        setData('highlights', e.target.value)
                                    }
                                    className="w-full resize-none border-gray-300 focus:border-pink-500 focus:ring-0"
                                />
                                <InputError message={errors.highlights} />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">
                                    Challenges{' '}
                                    <span className="text-xs text-gray-500">
                                        (Obstacles and difficulties faced)
                                    </span>
                                </Label>
                                <Textarea
                                    rows={4}
                                    value={data.challenges}
                                    placeholder="What challenges did you encounter? What could have been better?"
                                    onChange={(e) =>
                                        setData('challenges', e.target.value)
                                    }
                                    className="w-full resize-none border-gray-300 focus:border-pink-500 focus:ring-0"
                                />
                                <InputError message={errors.challenges} />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">
                                    Action Plan{' '}
                                    <span className="text-xs text-gray-500">
                                        (Next steps and improvements)
                                    </span>
                                </Label>
                                <Textarea
                                    rows={4}
                                    value={data.action_plan}
                                    placeholder="What are the next steps? Planned improvements and strategies for the next period"
                                    onChange={(e) =>
                                        setData('action_plan', e.target.value)
                                    }
                                    className="w-full resize-none border-gray-300 focus:border-pink-500 focus:ring-0"
                                />
                                <InputError message={errors.action_plan} />
                            </div>
                        </div>
                    </div>

                    {/* Attachment Section */}
                    <div className="overflow-hidden border border-gray-200 bg-white">
                        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                            <div className="flex items-center space-x-2">
                                <FileText className="h-5 w-5 text-pink-500" />
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Supporting Documents
                                </h2>
                            </div>
                        </div>
                        <div className="p-6">
                            {record.attachment && (
                                <div className="mb-4 border border-gray-200 bg-gray-50 p-4">
                                    <p className="mb-2 text-sm font-medium text-gray-700">
                                        Current Attachment:
                                    </p>
                                    <a
                                        target="_blank"
                                        href={record.attachment.original_url}
                                        className="inline-flex items-center space-x-2 text-sm text-pink-600 hover:text-pink-700"
                                        rel="noopener noreferrer"
                                    >
                                        <FileText className="h-4 w-4" />
                                        <span>View Current File</span>
                                    </a>
                                </div>
                            )}
                            <FileInput
                                label={
                                    record.attachment
                                        ? 'Replace Attachment (Optional)'
                                        : 'Attachment'
                                }
                                accept="image/*,.pdf,.doc,.docx"
                                value={data.new_attachment}
                                onChange={(file) =>
                                    setData('new_attachment', file)
                                }
                                error={errors.new_attachment}
                                required={false}
                            />
                            <p className="mt-2 text-xs text-gray-500">
                                Upload screenshots, reports, or any supporting
                                documents (Max: 10MB)
                                {record.attachment &&
                                    ' • Leave empty to keep current file'}
                            </p>
                        </div>
                    </div>
                    <div className="col-span-4 flex flex-col mt-6 gap-2">

                        <FileInput
                            label="Attachment"
                            value={data.attachment}
                            onChange={(file) => setData('attachment', file)}
                        />
                        <InputError message={errors.attachment} />
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-3 border-t border-gray-200 pt-6">
                        <Link
                            href={`/companies/${company.id}/performance-records/${record.id}`}
                            className="border border-gray-300 px-6 py-1.5 text-gray-700 transition-colors duration-200 hover:bg-gray-50"
                        >
                            Cancel
                        </Link>
                        <Button
                            type="submit"
                            variant="default"
                            disabled={processing}
                            className="flex items-center space-x-2  px-6 py-2 text-white transition-colors duration-200 hover:bg-pink-700"
                        >
                            <Save className="h-4 w-4" />
                            <span>
                                {processing ? 'Updating...' : 'Update Record'}
                            </span>
                        </Button>
                    </div>
                </form>
            </div>
        </CompanyLayout>
    );
};

export default Edit;
