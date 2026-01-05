import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Building,
    ClipboardCheck,
    Clock,
    TrendingUp,
    Users,
    Settings,
    ArrowLeft,
    ChevronRight,
    Shield,
    Globe,
    Mail,
    Phone,
    MapPin
} from 'lucide-react';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface CompanyLayoutProps {
    children: ReactNode;
    company: any;
    title?: string;
}

export default function CompanyLayout({
                                          children,
                                          company,
                                          title,
                                      }: CompanyLayoutProps) {
    const { url } = usePage();
    const currentPath = url;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Companies',
            href: '/companies',
        },
        {
            title: company.name,
            href: `/companies/${company.id}`,
        },
    ];

    const tabs = [
        {
            name: 'Overview',
            href: `/companies/${company.id}/details`,
            icon: Building,
            current: currentPath === `/companies/${company.id}` || currentPath === `/companies/${company.id}/details`,
        },
        {
            name: 'Onboarding',
            href: `/companies/${company.id}/onboarding`,
            icon: ClipboardCheck,
            current: currentPath.includes('onboarding'),
        },
        {
            name: 'Attendance',
            href: `/companies/${company.id}/attendance`,
            icon: Clock,
            current: currentPath.includes('attendance'),
        },
        {
            name: 'Performance',
            href: `/companies/${company.id}/performance-records`,
            icon: TrendingUp,
            current: currentPath.includes('performance'),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={title || `${company.name} - Company Details`} />

            <div className="min-h-screen bg-gray-50">
                {/* Header with Background */}
                <div className="bg-gradient-to-r from-pink-600 via-violet-600 to-cyan-600">
                    <div className="px-4 py-6 sm:px-6 lg:px-8">
                        <div className="flex flex-col justify-between sm:flex-row sm:items-center">
                            <div className="flex items-center space-x-3">
                                <Link
                                    href="/companies"
                                    className="rounded-lg bg-white/10 p-1.5 transition-colors hover:bg-white/20"
                                >
                                    <ArrowLeft className="h-5 w-5 text-white" />
                                </Link>
                                <div>
                                    <h1 className="mt-1 text-2xl font-bold text-white">
                                        {company.name}
                                    </h1>
                                </div>
                            </div>

                            <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white ring-1 ring-white/30 backdrop-blur-sm">
                                Added{' '}
                                {format(
                                    new Date(company.created_at),
                                    'MMM dd, yyyy',
                                )}
                            </span>
                        </div>

                        {/* Company Info Bar */}
                        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-white/90">
                            {company.email && (
                                <div className="flex items-center gap-1.5">
                                    <Mail className="h-4 w-4" />
                                    <span>{company.email}</span>
                                </div>
                            )}
                            {company.phone && (
                                <div className="flex items-center gap-1.5">
                                    <Phone className="h-4 w-4" />
                                    <span>{company.phone}</span>
                                </div>
                            )}
                            {company.website && (
                                <div className="flex items-center gap-1.5">
                                    <Globe className="h-4 w-4" />
                                    <a
                                        href={company.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="underline hover:text-white"
                                    >
                                        {company.website.replace(
                                            /^https?:\/\//,
                                            '',
                                        )}
                                    </a>
                                </div>
                            )}
                            {company.address && (
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="h-4 w-4" />
                                    <span>{company.address}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="px-4 py-6 sm:px-6 lg:px-8">
                    {/* Tabs Navigation - Enhanced */}
                    <div className="mb-6">
                        <div className="border-b border-gray-200">
                            <nav className="scrollbar-hide -mb-px flex space-x-1 overflow-x-auto pb-0.5">
                                {tabs.map((tab) => (
                                    <Link
                                        key={tab.name}
                                        href={tab.href}
                                        className={cn(
                                            'group relative inline-flex items-center gap-2 border-b-2 px-3 py-3 text-sm font-medium whitespace-nowrap transition-all',
                                            tab.current
                                                ? 'border-blue-600 bg-blue-50/50 text-blue-600'
                                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                                        )}
                                    >
                                        <tab.icon
                                            className={cn(
                                                'h-4 w-4 transition-colors',
                                                tab.current
                                                    ? 'text-blue-600'
                                                    : 'text-gray-400 group-hover:text-gray-500',
                                            )}
                                        />
                                        {tab.name}
                                        {tab.current && (
                                            <div className="absolute right-0 bottom-0 left-0 h-0.5 bg-blue-600" />
                                        )}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                        <div className="p-6">{children}</div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
