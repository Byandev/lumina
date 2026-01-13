import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Building,
    ClipboardCheck,
    Clock,
    TrendingUp,
} from 'lucide-react';
import { ReactNode } from 'react';
import { Company } from '@/types/models/Company';

interface CompanyLayoutProps {
    children: ReactNode;
    company: Company;
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
            current:
                currentPath === `/companies/${company.id}` ||
                currentPath === `/companies/${company.id}/details`,
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

            <div className="px-4 sm:px-8 pb-8">
                <div className="my-4 sm:my-8">
                    <p className="font-semibold text-foreground text-3xl my-0">
                        Company Details
                    </p>
                </div>

                <div className="mb-4 sm:mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="scrollbar-hide -mb-px flex space-x-1 overflow-x-auto">
                            {tabs.map((tab) => (
                                <Link
                                    key={tab.name}
                                    href={tab.href}
                                    className={cn(
                                        'group relative inline-flex items-center gap-2 border-b-2 px-3 py-2.5 font-medium whitespace-nowrap transition-all sm:px-4 sm:py-3 text-sm',
                                        tab.current
                                            ? 'border-blue-600 bg-blue-50/50 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                                    )}
                                >
                                    <tab.icon
                                        className={cn(
                                            'h-3.5 w-3.5 transition-colors sm:h-4 sm:w-4',
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

                <div>
                    {children}
                </div>
            </div>

            {/*<div className="min-h-screen bg-gradient-to-b from-white via-gray-50/50 to-blue-50/30 p-3 sm:p-4 md:p-6">*/}
            {/*    /!* Header *!/*/}
            {/*    <div className="mb-4 sm:mb-6">*/}
            {/*        <div className="flex items-center justify-between">*/}
            {/*            <div className="flex items-center gap-3">*/}
            {/*                <div>*/}
            {/*                    <h1 className="text-base font-bold text-gray-900 text-lg md:text-xl">*/}
            {/*                        */}
            {/*                    </h1>*/}
            {/*                    <p className="hidden text-xs text-gray-500 sm:block">*/}
            {/*                        Company Details*/}
            {/*                    </p>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}



            {/*    /!* Content Area *!/*/}
            {/*    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">*/}
            {/*        <div className="p-4 sm:p-6">{children}</div>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </AppLayout>
    );
}
