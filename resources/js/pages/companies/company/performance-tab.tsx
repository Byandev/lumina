import { router } from '@inertiajs/react';
import {
    AlertTriangle,
    CheckCircle,
    Download,
    File,
    Plus,
    Target,
} from 'lucide-react';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';

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
    const [isOpen, setIsOpen] = useState(false);

    // Helper function to get the full attachment URL
    const getAttachmentUrl = (path: string | null): string | null => {
        if (!path) return null;

        // If path already starts with /storage/, return as is
        if (path.startsWith('/storage/')) {
            return path;
        }

        // If path is a filename only or relative path, prepend /storage/
        // This handles cases where you might store just the filename in the database
        return `/storage/${path.replace(/^storage\//, '').replace(/^public\//, '')}`;
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

    const closeFormModal = () => {
        setIsOpen(false);
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
        const base =
            'inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[11px]';
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
                            No performance records available.
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
                                        <th className="px-3 py-2 text-left font-medium border">
                                            Notes
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-100">
                                    {records.data.map((record) => {
                                        const attachmentUrl = getAttachmentUrl(
                                            record.attachment_path,
                                        );
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
                                                        {attachmentUrl && (
                                                            <div
                                                                className={`flex items-center gap-1.5 ${record.action_plan ? 'mt-1' : ''}`}
                                                            >
                                                                <File className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
                                                                <a
                                                                    href={
                                                                        attachmentUrl
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
                                                                <Download className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
                                                            </div>
                                                        )}

                                                        {!record.highlights &&
                                                        !record.challenges &&
                                                        !record.action_plan &&
                                                        !attachmentUrl ? (
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
