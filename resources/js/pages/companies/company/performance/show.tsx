import moment from 'moment/moment';

import CompanyLayout from '@/pages/companies/company/company-layout';
import { Company } from '@/types/models/Company';
import { PerformanceRecord } from '@/types/models/PerformanceRecord';

import PerformancePhaseBadge from '@/components/companies/performance-phase-badge';
import { currencyFormatter, percentageFormatter } from '@/lib/formatter';
import { Link } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    Calendar,
    CheckCircle,
    DollarSign,
    Download,
    FileText,
    Hash,
    Lightbulb, Pencil,
    Target,
    TrendingUp,
} from 'lucide-react';

interface Props {
    company: Company;
    record: PerformanceRecord;
}

const Show = ({ company, record }: Props) => {
    const metrics = [
        {
            icon: Hash,
            label: 'Items Tested',
            value: `${record.no_of_items} items`,
            color: 'text-pink-600',
        },
        {
            icon: DollarSign,
            label: 'Average Ad Spend',
            value: currencyFormatter(record.avg_ads_spent),
            color: 'text-pink-600',
        },
        {
            icon: TrendingUp,
            label: 'ROAS',
            value: record.roas,
            color: 'text-pink-600',
        },
        {
            icon: Target,
            label: 'RTS',
            value: percentageFormatter(record.rts / 100),
            color: 'text-pink-600',
        },
    ];

    const sections = [
        {
            title: 'Highlights',
            content: record.highlights,
            icon: CheckCircle,
            borderColor: 'border-green-500',
            bgColor: 'bg-green-50',
            textColor: 'text-green-800',
            iconColor: 'text-green-600',
        },
        {
            title: 'Challenges',
            content: record.challenges,
            icon: AlertCircle,
            borderColor: 'border-red-500',
            bgColor: 'bg-red-50',
            textColor: 'text-red-800',
            iconColor: 'text-red-600',
        },
        {
            title: 'Action Plan',
            content: record.action_plan,
            icon: Lightbulb,
            borderColor: 'border-blue-500',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-800',
            iconColor: 'text-blue-600',
        },
    ];

    return (
        <CompanyLayout company={company}>
            <div className="mx-auto max-w-7xl">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="flex items-center space-x-3">
                                <Link
                                    href={`/companies/${company.id}/performance-records`}
                                    className="p-2 transition-colors duration-200 hover:bg-gray-100"
                                >
                                    <ArrowLeft className="h-5 w-5 text-gray-600" />
                                </Link>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900">
                                        Performance Record Details
                                    </h1>
                                    <div className="mt-1 flex items-center space-x-2">
                                        <Calendar className="h-4 w-4 text-gray-400" />
                                        <p className="text-sm text-gray-500">
                                            {moment(record.start_date).format(
                                                'MMM DD, YYYY',
                                            )}{' '}
                                            -{' '}
                                            {moment(record.end_date).format(
                                                'MMM DD, YYYY',
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <PerformancePhaseBadge phase={record.phase} />
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {metrics.map((metric, index) => (
                        <div
                            key={index}
                            className="border border-gray-200 bg-white p-6 transition-colors duration-200 hover:bg-gray-50"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <p className="mb-1 text-sm font-medium text-gray-500">
                                        {metric.label}
                                    </p>
                                    <p className="text- xl font-semibold text-gray-900">
                                        {metric.value}
                                    </p>
                                </div>
                                <metric.icon
                                    className={`h-5 w-5 ${metric.color} flex-shrink-0`}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Analysis Sections */}
                <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {sections.map((section, index) => (
                        <div
                            key={index}
                            className={`border-l-4 ${section.borderColor} ${section.bgColor} p-6`}
                        >
                            <div className="mb-3 flex items-center space-x-2">
                                <section.icon
                                    className={`h-5 w-5 ${section.iconColor}`}
                                />
                                <h2
                                    className={`text-lg font-semibold ${section.textColor}`}
                                >
                                    {section.title}
                                </h2>
                            </div>
                            <div className="text-sm leading-relaxed whitespace-pre-wrap text-gray-700">
                                {section.content ? (
                                    section.content
                                ) : (
                                    <span className="text-gray-400 italic">
                                        No data provided
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Attachment Section */}
                {record.attachment && (
                    <div className="mb-8 border border-gray-200 bg-white">
                        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                            <div className="flex items-center space-x-2">
                                <FileText className="h-5 w-5 text-pink-500" />
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Supporting Documents
                                </h2>
                            </div>
                        </div>
                        <div className="p-6">
                            <a
                                target="_blank"
                                href={record.attachment.original_url}
                                className="inline-flex items-center space-x-2 font-medium text-pink-600 transition-colors duration-200 hover:text-pink-700"
                                rel="noopener noreferrer"
                            >
                                <Download className="h-4 w-4" />
                                <span>Download Attachment</span>
                            </a>
                            <p className="mt-2 text-xs text-gray-500">
                                File will open in a new tab
                            </p>
                        </div>
                    </div>
                )}

                {/* Actions Footer */}
                <div className="flex justify-end space-x-3 border-t border-gray-200 pt-6">
                    <div className="inline-block  bg-gradient-to-r from-pink-500 to-violet-400 p-[2px]">
                        <Link
                            href={`/companies/${company.id}/performance-records/${record.id}/edit`}
                            className="items-center gap-2  flex bg-white px-6 py-1.5 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-pink-500 hover:to-violet-400 hover:text-white"
                        >
                            <Pencil className='h-5 w-4 ' />
                            Edit Record
                        </Link>
                    </div>
                </div>
            </div>
        </CompanyLayout>
    );
};

export default Show;
