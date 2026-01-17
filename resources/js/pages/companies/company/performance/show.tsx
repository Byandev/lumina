import React from 'react';
import moment from 'moment/moment';

import { Company } from '@/types/models/Company';
import { PerformanceRecord } from '@/types/models/PerformanceRecord';
import CompanyLayout from '@/pages/companies/company/company-layout';

import { Label } from '@/components/ui/label';
import ComponentCard from '@/components/component-card';
import PerformancePhaseBadge from '@/components/companies/performance-phase-badge';
import { currencyFormatter, percentageFormatter } from '@/lib/formatter';

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
                    {record.attachment && <div>
                        <a target='_blank' href={record.attachment.original_url} className="font-medium text-blue-700 cursor-pointer">Download Attachment</a>
                    </div>}
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
            </ComponentCard>
        </CompanyLayout>
    );
};

export default Show;
