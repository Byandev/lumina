import CompanyOwnerCard from '@/components/companies/company-owner-card';
import LevelBadge from '@/components/companies/level-badge';
import StatusBadge from '@/components/companies/status-badge';
import ComponentCard from '@/components/component-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { percentageFormatter } from '@/lib/formatter';
import { cn } from '@/lib/utils';
import CompanyLayout from '@/pages/companies/company/company-layout';
import { Company } from '@/types/models/Company';
import {
    AlertCircle,
    Award,
    Briefcase,
    Calendar,
    CheckCircle2,
    Clock,
    Database,
    ExternalLink,
    FileCheck,
    Mail,
    MapPin,
    Phone,
    TrendingUp,
    User,
    Users,
} from 'lucide-react';

interface Props {
    company: Company;
}

const DetailTab = ({ company }: Props) => {
    // Helper function to get initials for avatar fallback
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((word) => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    // Enhanced Info field component
    const InfoField = ({
        icon: Icon,
        label,
        value,
        valueClassName = '',
        href,
    }: {
        icon?: any;
        label: string;
        value: React.ReactNode;
        valueClassName?: string;
        href?: string;
    }) => {
        const content = (
            <div className="group flex items-start gap-3      p-2 transition-all duration-200 hover:bg-muted/30 hover:shadow-sm">
                {Icon && (
                    <div className="mt-0.5 shrink-0      bg-gradient-to-br from-pink-500/10 to-blue-500/10 p-1.5 transition-colors group-hover:from-pink-500/20 group-hover:to-blue-500/20">
                        <Icon className="h-3.5 w-3.5 text-pink-500" />
                    </div>
                )}
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <Label className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                        {label}
                    </Label>
                    {href ? (
                        <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                                'inline-flex items-center gap-1 text-sm font-medium text-pink-500 transition-colors hover:text-pink-600',
                                valueClassName,
                            )}
                        >
                            {value || '-'}
                            <ExternalLink className="h-3 w-3" />
                        </a>
                    ) : (
                        <div
                            className={cn(
                                'text-sm font-medium break-words text-foreground',
                                valueClassName,
                            )}
                        >
                            {value || '-'}
                        </div>
                    )}
                </div>
            </div>
        );
        return content;
    };

    // Enhanced Status Card Component
    const StatusCard = ({
        label,
        value,
        badgeComponent,
        icon: Icon,
        description,
    }: {
        label: string;
        value: string;
        badgeComponent: React.ReactNode;
        icon?: any;
        description?: string;
    }) => (
        <div className="group relative overflow-hidden      border bg-card p-5 transition-all duration-200 hover:border-pink-500/20 hover:shadow-lg">
            <div className="absolute top-0 right-0 h-20 w-20 translate-x-8 -translate-y-8      bg-gradient-to-br from-pink-500/5 to-blue-500/5 blur-2xl transition-all group-hover:from-pink-500/10 group-hover:to-blue-500/10" />

            <div className="relative space-y-3">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            {Icon && (
                                <div className="     bg-gradient-to-br from-pink-500/10 to-blue-500/10 p-1.5">
                                    <Icon className="h-3.5 w-3.5 text-pink-500" />
                                </div>
                            )}
                            <Label className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                                {label}
                            </Label>
                        </div>
                        {description && (
                            <p className="text-xs text-muted-foreground">
                                {description}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex-1">{badgeComponent}</div>
                </div>
            </div>
        </div>
    );

    // Progress Section Component
    const ProgressSection = () => {
        const percentage = company.onboarding_percentage ?? 0;
        const isComplete = percentage === 100;
        const isStarted = percentage > 0 && percentage < 100;

        return (
            <div className="     border bg-card p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="     bg-gradient-to-br from-pink-500/10 to-blue-500/10 p-1.5">
                            <CheckCircle2 className="h-4 w-4 text-pink-500" />
                        </div>
                        <Label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                            Onboarding Progress
                        </Label>
                    </div>
                    {isComplete && (
                        <span className="inline-flex items-center gap-1      bg-gradient-to-r from-pink-500/10 to-blue-500/10 px-2 py-0.5 text-xs font-medium text-pink-600 dark:text-pink-400">
                            <CheckCircle2 className="h-3 w-3" />
                            Complete
                        </span>
                    )}
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="flex-1">
                            <div
                                className="relative h-2.5 w-full overflow-hidden      bg-muted"
                                role="progressbar"
                                aria-valuenow={percentage}
                                aria-valuemin={0}
                                aria-valuemax={100}
                            >
                                <div
                                    className={cn(
                                        'h-full      bg-gradient-to-r transition-all duration-700 ease-out',
                                        isComplete
                                            ? 'from-green-500 to-emerald-500'
                                            : 'from-pink-500 to-blue-500',
                                    )}
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                        </div>
                        <span className="min-w-[3.5rem] text-right text-sm font-semibold text-pink-500 tabular-nums">
                            {percentageFormatter(percentage)}
                        </span>
                    </div>

                    {isStarted && !isComplete && (
                        <div className="flex items-center gap-2      bg-gradient-to-r from-pink-500/5 to-blue-500/5 p-2">
                            <Clock className="h-3.5 w-3.5 text-pink-500" />
                            <p className="text-xs text-muted-foreground">
                                {100 - percentage}% remaining to complete
                                onboarding
                            </p>
                        </div>
                    )}

                    {percentage === 0 && (
                        <div className="flex items-center gap-2      bg-muted/50 p-2">
                            <AlertCircle className="h-3.5 w-3.5 text-muted-foreground" />
                            <p className="text-xs text-muted-foreground">
                                Onboarding not started yet
                            </p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <CompanyLayout company={company}>
            <div className="space-y-10 pb-8">
                {/* Hero Section - Redesigned with Pink to Blue Gradient */}
                <div className="relative overflow-hidden      bg-gradient-to-r from-pink-100 to-blue-100">
                    <div className="bg-grid-white/10 absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />

                    <div className="relative p-6 md:p-8">
                        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                            <div className="flex flex-col items-center gap-5 md:flex-row md:gap-6">
                                <Avatar className="h-24 w-24 shadow-xl ring-4 ring-white/50 md:h-28 md:w-28">
                                    <AvatarImage
                                        src={company.company_logo?.original_url}
                                        alt={company.name}
                                    />
                                    <AvatarFallback className="bg-gradient-to-br from-pink-500 to-blue-500 text-2xl font-bold text-white">
                                        {getInitials(company.name)}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="text-center md:text-left">
                                    <div className="mb-2 flex flex-wrap items-center justify-center gap-2 md:justify-start">
                                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
                                            {company.name}
                                        </h1>
                                        <div className="flex items-center gap-1.5">
                                            <StatusBadge
                                                status={
                                                    company.status as string
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-gray-600 md:justify-start">
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="h-4 w-4" />
                                            <span>{company.address}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Information Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                        <h2 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                            Contact Information
                        </h2>
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                    </div>

                    <div className="grid gap-6 lg:grid-cols-3">
                        <div className="lg:col-span-2">
                            <div className="grid gap-3 sm:grid-cols-2">
                                <InfoField
                                    icon={Mail}
                                    label="Email"
                                    value={company.email}
                                    href={`mailto:${company.email}`}
                                />
                                <InfoField
                                    icon={Phone}
                                    label="Phone Number"
                                    value={company.phone}
                                    href={`tel:${company.phone}`}
                                />
                                <InfoField
                                    icon={Briefcase}
                                    label="Sponsor Company"
                                    value={
                                        company.sponsor?.name ??
                                        'No sponsor assigned'
                                    }
                                    valueClassName="text-muted-foreground"
                                />
                                <InfoField
                                    icon={User}
                                    label="Assigned Coach"
                                    value={
                                        company.coach?.name ??
                                        'No coach assigned'
                                    }
                                    valueClassName="text-muted-foreground"
                                />
                            </div>
                        </div>

                        <ProgressSection />
                    </div>
                </div>

                {/* Status Cards Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                        <h2 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                            Company Status
                        </h2>
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <StatusCard
                            label="Level"
                            value={company.level as string}
                            badgeComponent={
                                <LevelBadge level={company.level as string} />
                            }
                            icon={Award}
                            description="Company tier level"
                        />

                        <StatusCard
                            label="Sales Activity"
                            value={company.sales_activity as string}
                            badgeComponent={
                                <StatusBadge
                                    status={company.sales_activity as string}
                                />
                            }
                            icon={TrendingUp}
                            description="Current sales status"
                        />

                        <StatusCard
                            label="Notarization"
                            value={company.notarization_status as string}
                            badgeComponent={
                                <StatusBadge
                                    status={
                                        company.notarization_status as string
                                    }
                                />
                            }
                            icon={FileCheck}
                            description="Legal document status"
                        />

                        <StatusCard
                            label="ERP System"
                            value={company.erp_status as string}
                            badgeComponent={
                                <StatusBadge
                                    status={company.erp_status as string}
                                />
                            }
                            icon={Database}
                            description="Enterprise system status"
                        />
                    </div>
                </div>

                {/* Company Owners Section */}
                <div className="space-y-4 ">
                    <div className="flex items-center gap-2">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                        <h2 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                            Company Owners
                        </h2>
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                    </div>

                    <div className="overflow-hidden border-0 shadow-none">
                        {company.owners && company.owners.length > 0 ? (
                            <div className="grid sm:grid-cols-2">
                                {company.owners.map((owner) => (
                                    <CompanyOwnerCard
                                        key={owner.id}
                                        owner={owner}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-4      border border-dashed bg-gradient-to-br from-pink-500/5 to-blue-500/5 p-12 text-center">
                                <div className="     bg-gradient-to-br from-pink-500/10 to-blue-500/10 p-4">
                                    <Users className="h-8 w-8 text-pink-500" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-base font-medium">
                                        No Owners Assigned
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        This company doesn't have any registered
                                        owners yet
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </CompanyLayout>
    );
};

export default DetailTab;
