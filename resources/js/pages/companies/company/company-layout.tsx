import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Building, ClipboardCheck, Clock, TrendingUp } from 'lucide-react';
import { ReactNode } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Companies',
        href: '/companies',
    },
];

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

    const tabs = [
        {
            name: 'Details',
            href: `/companies/${company.id}/details`,
            icon: Building,
            current: currentPath === `/companies/${company.id}/details`,
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
            <Head title={title || `${company.name} - Details`} />
            <div className="px-3 py-4">
                {/* Header */}
                <div className="mb-6">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-semibold text-gray-900">
                                {company.name}
                            </h1>
                            <p className="mt-0.5 text-sm text-gray-600">
                                Company Management
                            </p>
                        </div>
                    </div>

                    {/* Tabs Navigation */}
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            {tabs.map((tab) => (
                                <Link
                                    key={tab.name}
                                    href={tab.href}
                                    className={`group inline-flex items-center border-b-2 px-1 py-3 text-sm font-medium ${
                                        tab.current
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                    } `}
                                >
                                    <tab.icon
                                        className={`mr-2 h-4 w-4 ${tab.current ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'} `}
                                    />
                                    {tab.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="mt-6">{children}</div>
            </div>
        </AppLayout>
    );
}
