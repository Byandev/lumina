import React from 'react';
import moment from 'moment/moment';

import { Company } from '@/types/models/Company';
import { PerformanceRecord } from '@/types/models/PerformanceRecord';
import CompanyLayout from '@/pages/companies/company/company-layout';

import { Label } from '@/components/ui/label';
import ComponentCard from '@/components/component-card';
import PerformancePhaseBadge from '@/components/companies/performance-phase-badge';
import { currencyFormatter, percentageFormatter } from '@/lib/formatter';
import { Link } from '@inertiajs/react';
import { Download, Eye, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
    company: Company;
    record: PerformanceRecord;
}

const Show = ({ company, record }: Props) => {
    return (
        <CompanyLayout company={company}>
            <ComponentCard desc={'Record Details'}>
                <div className="mb-5 grid grid-cols-2 gap-5 text-sm font-medium">
                    <div>{`Date: ${moment(record.start_date).format('YYYY-MM-DD')} to ${moment(record.end_date).format('YYYY-MM-DD')}`}</div>
                    <div className="flex space-x-2">
                        <p>Phase:</p>
                        <PerformancePhaseBadge phase={record.phase} />
                    </div>
                    <div>{record.no_of_items} items tested</div>
                    <div>
                        {currencyFormatter(record.avg_ads_spent)} average ad
                        spent
                    </div>
                    <div>{record.roas} ROAS</div>
                    <div>{percentageFormatter(record.rts / 100)} RTS</div>
                </div>
                <div className="grid grid-cols-3 gap-5">
                    <div className="flex flex-col gap-1 rounded-xl border border-green-700 bg-green-200 p-4">
                        <Label className="text-sm font-medium">
                            Highlights
                        </Label>

                        <Label className="text-sm font-normal text-gray-700">
                            {record.highlights}
                        </Label>
                    </div>

                    <div className="flex flex-col gap-1 rounded-xl border border-red-700 bg-red-200 p-4">
                        <Label className="text-sm font-medium">
                            Challenges
                        </Label>

                        <Label className="text-sm font-normal text-gray-700">
                            {record.challenges}
                        </Label>
                    </div>
                    <div className="flex flex-col gap-1 rounded-xl border border-blue-700 bg-blue-200 p-4">
                        <Label className="text-sm font-medium">
                            Action Plan
                        </Label>

                        <Label className="text-sm font-normal text-gray-700">
                            {record.action_plan}
                        </Label>
                    </div>
                </div>
                {record.attachment && (
                    <div className="mt-8">
                        <Label className="mb-3 block text-sm font-semibold text-gray-800">
                            Attachment
                        </Label>
                        <div className="inline-flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">

                            <div className="min-w-0 flex-1">
                                <p className="flex items-center text-gray-600 truncate text-sm font-medium text-gray-900">
                                    <Paperclip className='h-4 '/>
                                    {record.attachment.file_name}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                        window.open(
                                            record.attachment?.original_url,
                                            '_blank',
                                        )
                                    }
                                    className="h-8 px-2"
                                >
                                    <Eye className="h-4 w-4" />
                                </Button>
                                <a
                                    href={record.attachment?.original_url}
                                    download
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Download className="h-4 w-4" />
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </ComponentCard>
        </CompanyLayout>
    );
};

export default Show;
