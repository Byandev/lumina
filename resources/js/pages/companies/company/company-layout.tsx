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

            <div className="min-h-screen bg-gray-50 p-4">
                {/* Header with Background */}
                <h1 className='text-lg font-bold mb-4'>Company Details</h1>

                {/* Main Content */}
                <div className="">
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
