import { Company } from '@/types/models/Company';
import CompanyLayout from '@/pages/companies/company/company-layout';
import ComponentCard from '@/components/component-card';
import CompanyOwnerCard from '@/components/companies/company-owner-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import StatusBadge from '@/components/companies/status-badge';
import LevelBadge from '@/components/companies/level-badge';
import { percentageFormatter } from '@/lib/formatter';

interface Props {
    company: Company
}

const DetailTab = ({ company }: Props) => {

    return <CompanyLayout company={company}>
        <div className="space-y-6">
            <ComponentCard title={"Company Information"}>
                <div>
                    <div className='flex flex-col md:flex-row items-center gap-x-2'>
                        <Avatar className="size-20">
                            <AvatarImage src={`/${company.logo}`} alt="@shadcn" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>

                        <p className="text-xl md:text-2xl font-bold">{company.name}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <div className="flex flex-col gap-2">
                            <Label className="text-sm font-medium">Email</Label>
                            <Label className='font-normal text-gray-800'>{company.email}</Label>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label className="text-sm font-medium">Phone Number</Label>
                            <Label className='font-normal text-gray-800'>{company.phone}</Label>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label className="text-sm font-medium">Address</Label>
                            <Label className='font-normal text-gray-800'>{company.address}</Label>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label className="text-sm font-medium">Sponsor Company</Label>
                            <Label className='font-normal text-gray-800'>{company.sponsor?.name}</Label>
                        </div>
                    </div>
                </div>
            </ComponentCard>

            <ComponentCard title={"Company Status"}>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="flex flex-col gap-2">
                        <Label className="text-sm font-medium">Status</Label>
                        <div>
                           <StatusBadge status={company.status as string} />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label className="text-sm font-medium">Level</Label>
                        <div>
                            <LevelBadge level={company.level as string} />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label className="text-sm font-medium">Sales Activity</Label>
                        <div>
                            <StatusBadge status={company.sales_activity as string} />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label className="text-sm font-medium">Onboarding Progress</Label>
                        <Label className='font-normal text-gray-800'>{percentageFormatter(company.onboarding_percentage as number)}</Label>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label className="text-sm font-medium">Notarization Status</Label>
                        <div>
                            <StatusBadge status={company.notarization_status as string} />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label className="text-sm font-medium">ERP Status</Label>
                        <div>
                            <StatusBadge status={company.erp_status as string} />
                        </div>
                    </div>
                </div>
            </ComponentCard>

            <ComponentCard title={"Company Owners"}>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4">
                    {(company.owners ?? [])?.map(owner => <CompanyOwnerCard key={owner.id} owner={owner}/>)}
                </div>
            </ComponentCard>
        </div>
    </CompanyLayout>
}

export default DetailTab
