import AppLayout from '@/layouts/app-layout';
import { companies } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    Building,
    ChevronLeft,
    ChevronRight,
    Mail,
    MoreHorizontal,
    Plus,
    Search,
    Users,
    X,
} from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Company {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
    address: string | null;
    logo: string | null;
    logo_url: string | null;
    owners_count: number;
    created_at: string;
    updated_at: string;
    sponsor?: {
        id: number;
        name: string;
        logo: string | null;
        logo_url: string | null
    };
    total_checklist_count: number;
    completed_checklist_count: number;
    checklist_progress: number;
    notarization_status?: string;
    erp_status?: string;
    sales_activity?: string;
    level?: string;
    owners?: Array<{
        id: number;
        name: string;
        email: string;
        photo: string | null;
        photo_url: string | null;
        is_primary: boolean;
    }>;
}

interface CompaniesProps {
    companies: {
        data: Company[];
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    search?: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Companies',
        href: companies().url,
    },
];

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number,
): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

export default function CompaniesIndex({
    companies,
    search: initialSearch = '',
}: CompaniesProps) {
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .filter(Boolean)
            .map((word) => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const formatStatus = (status?: string) => {
        if (!status) return 'N/A';
        return status
            .replace(/_/g, ' ')
            .split(' ')
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ');
    };

    const getStatusColor = (status?: string) => {
        switch (status?.toLowerCase()) {
            case 'active':
            case 'completed':
            case 'done':
                return 'border-green-200 bg-green-50 text-green-700';
            case 'pending':
            case 'in_progress':
                return 'border-yellow-200 bg-yellow-50 text-yellow-700';
            case 'inactive':
            case 'failed':
            case 'terminated':
                return 'border-red-200 bg-red-50 text-red-700';
            default:
                return 'border-gray-200 bg-gray-50 text-gray-700';
        }
    };

    const getLevelColor = (level?: string) => {
        switch (level?.toLowerCase()) {
            case 'educate':
                return 'border-yellow-200 bg-yellow-50 text-yellow-700';
            case 'empowerment':
                return 'border-gray-200 bg-gray-50 text-gray-700';
            case 'enterprise':
                return 'border-blue-200 bg-blue-50 text-blue-700';
            case 'exponential':
                return 'border-orange-200 bg-orange-50 text-orange-700';
            default:
                return 'border-gray-200 bg-gray-50 text-gray-700';
        }
    };

    const [searchTerm, setSearchTerm] = useState(initialSearch);

    const debouncedSearch = useCallback(
        debounce((value: string) => {
            router.get(
                '/companies',
                { search: value || undefined },
                { preserveState: true, replace: true, preserveScroll: true },
            );
        }, 450),
        [],
    );

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/companies',
            { search: searchTerm || undefined },
            { preserveState: true, replace: true, preserveScroll: true },
        );
    };

    const clearSearch = () => {
        setSearchTerm('');
        router.get(
            '/companies',
            {},
            { preserveState: true, replace: true, preserveScroll: true },
        );
    };

    const hasData = companies.data.length > 0;

    const pagination = useMemo(() => {
        const prev = companies.links[0];
        const next = companies.links[companies.links.length - 1];
        const pages = companies.links.slice(1, -1);
        return { prev, next, pages };
    }, [companies.links]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Companies" />

            <div className="px-4 py-2 md:py-6">
                <div className="mb-4">
                    <div className="flex flex-col md:flex-row justify-between gap-3">
                        <div className="">
                            <h1 className="text-lg font-semibold text-foreground">
                                Companies
                            </h1>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                                Manage all companies in your system
                            </p>
                        </div>

                        {/* Search + Add */}
                        <div className="flex items-center gap-3">
                            <form
                                onSubmit={handleSearchSubmit}
                                className="relative w-full sm:w-80"
                            >
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Search className="z-10 h-4 w-4 text-gray-400" />
                                </div>

                                <Input
                                    type="text"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    placeholder="Search companies..."
                                    className="h-9 pl-8 text-sm"
                                />

                                {searchTerm && (
                                    <button
                                        type="button"
                                        onClick={clearSearch}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-700"
                                        aria-label="Clear search"
                                    >
                                        ×
                                    </button>
                                )}
                            </form>

                            <Link
                                href="/companies/create"
                                className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-pink-500 via-blue-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white transition hover:scale-105"
                            >
                                <Plus className="h-4 w-4" />
                                <span className='hidden md:block'>Add Company</span>
                            </Link>
                        </div>
                    </div>
                </div>

                <p className="mb-2 text-xs text-gray-500">
                    {searchTerm ? (
                        <p className="mt-2 text-xs text-muted-foreground">
                            Results for{' '}
                            <span className="font-medium text-foreground">
                                "{searchTerm}"
                            </span>
                        </p>
                    ) : null}
                </p>

                {/* Content Card */}
                <div className="overflow-hidden">
                    {!hasData ? (
                        <div className="rounded-2xl border px-6 py-10 text-center">
                            {/* Icon */}
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
                                <Building className="h-6 w-6 text-gray-400" />
                            </div>

                            {/* Title */}
                            <h3 className="mt-4 text-sm font-semibold text-gray-900">
                                {searchTerm
                                    ? 'No companies found'
                                    : 'No companies yet'}
                            </h3>

                            {/* Description */}
                            <p className="mt-1 text-xs text-gray-600">
                                {searchTerm
                                    ? `No companies match your search for "${searchTerm}"`
                                    : 'Get started by creating your first company.'}
                            </p>

                            {/* Action */}
                            <div className="mt-6">
                                {searchTerm ? (
                                    <Button
                                        onClick={clearSearch}
                                        variant="outline"
                                    >
                                        Clear search
                                    </Button>
                                ) : (
                                    <Link
                                        href="/companies/create"
                                        className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-pink-500 via-blue-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Add Company
                                    </Link>
                                )}
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                                <div className="overflow-x-auto">
                                    <table className="min-w-[1024px] sm:min-w-full">
                                        <thead className="bg-gradient-to-r from-pink-50 via-blue-50 to-sky-50">
                                        <tr>
                                            <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 sm:px-4 sm:py-3">
                                                Company
                                            </th>
                                            <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 sm:px-4 sm:py-3">
                                                Owners
                                            </th>
                                            <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 sm:px-4 sm:py-3">
                                                Sponsor
                                            </th>
                                            <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 sm:px-4 sm:py-3">
                                                Onboarding
                                            </th>
                                            <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 sm:px-4 sm:py-3">
                                                Notarization
                                            </th>
                                            <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 sm:px-4 sm:py-3">
                                                ERP
                                            </th>
                                            <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 sm:px-4 sm:py-3">
                                                Sales
                                            </th>
                                            <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 sm:px-4 sm:py-3">
                                                Level
                                            </th>
                                        </tr>
                                        </thead>

                                        <tbody className="divide-y divide-gray-100">
                                        {companies.data.map((company) => (
                                            <tr
                                                key={company.id}
                                                className="align-top transition-colors hover:bg-gradient-to-r hover:from-pink-50/30 hover:via-blue-50/30 hover:to-sky-50/30"
                                            >
                                                {/* Company */}
                                                <td className="px-3 py-2.5 sm:px-4 sm:py-3">
                                                    <div className="flex items-center gap-2 sm:gap-3">
                                                        <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gradient-to-br from-pink-100 via-blue-100 to-sky-100 sm:h-9 sm:w-9">
                                                            {company.logo_url ? (
                                                                <img
                                                                    src={company.logo_url}
                                                                    alt={company.name}
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="flex h-full w-full items-center justify-center">
                                            <span className="text-xs font-semibold text-gray-700">
                                                {getInitials(company.name)}
                                            </span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="min-w-0">
                                                            <div className="max-w-[140px] truncate text-sm font-semibold text-gray-900 sm:max-w-[240px]">
                                                                <Link
                                                                    href={`/companies/${company.id}/details`}
                                                                    className="font-light hover:underline"
                                                                >
                                                                    {company.name}
                                                                </Link>
                                                            </div>
                                                            {company.email && (
                                                                <div className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                                                                    <Mail className="h-3 w-3 flex-shrink-0 text-gray-400 sm:h-3.5 sm:w-3.5" />
                                                                    <span className="max-w-[120px] truncate sm:max-w-[260px]">
                                                {company.email}
                                            </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Owners */}
                                                <td className="px-3 py-2.5 sm:px-4 sm:py-3">
                                                    <div className="space-y-1.5 sm:space-y-2">
                                                        {company.owners && company.owners.length > 0 ? (
                                                            <>
                                                                {company.owners.slice(0, 1).map((owner) => (
                                                                    <div key={owner.id} className="flex items-center gap-1.5 sm:gap-2">
                                                                        <div className="h-6 w-6 flex-shrink-0 overflow-hidden rounded-full border border-gray-200 bg-gray-50 sm:h-7 sm:w-7">
                                                                            {owner.photo_url ? (
                                                                                <img
                                                                                    src={owner.photo_url}
                                                                                    alt={owner.name}
                                                                                    className="h-full w-full object-cover"
                                                                                />
                                                                            ) : (
                                                                                <div className="flex h-full w-full items-center justify-center">
                                                            <span className="text-[9px] font-semibold text-gray-700 sm:text-[10px]">
                                                                {getInitials(owner.name)}
                                                            </span>
                                                                                </div>
                                                                            )}
                                                                        </div>

                                                                        <div className="min-w-0">
                                                                            <div className="max-w-[100px] truncate text-xs font-light text-gray-900 sm:max-w-[180px]">
                                                                                {owner.name}
                                                                            </div>
                                                                            <div className="max-w-[100px] truncate text-[10px] text-gray-500 sm:max-w-[200px] sm:text-[11px]">
                                                                                {owner.email}
                                                                            </div>
                                                                        </div>

                                                                        {owner.is_primary && (
                                                                            <span className="inline-flex items-center rounded-full bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700 sm:px-2 sm:py-0.5 sm:text-[11px]">
                                                        P
                                                    </span>
                                                                        )}
                                                                    </div>
                                                                ))}

                                                                {company.owners.length > 1 && (
                                                                    <div className="text-xs text-gray-500 sm:pl-9">
                                                                        +{company.owners.length - 1} more
                                                                    </div>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <div className="flex items-center gap-1.5 text-gray-500 sm:gap-2">
                                                                <Users className="h-3.5 w-3.5 text-gray-400 sm:h-4 sm:w-4" />
                                                                <span className="text-xs">No owners</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Sponsor */}
                                                <td className="px-3 py-2.5 sm:px-4 sm:py-3">
                                                    {company.sponsor ? (
                                                        <div className="flex items-center gap-1.5 sm:gap-2">
                                                            <div className="h-6 w-6 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 sm:h-7 sm:w-7">
                                                                {company.sponsor.logo_url ? (
                                                                    <img
                                                                        src={company.sponsor.logo_url}
                                                                        alt={company.sponsor.name}
                                                                        className="h-full w-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <div className="flex h-full w-full items-center justify-center">
                                                <span className="text-[9px] font-semibold text-gray-700 sm:text-[10px]">
                                                    {getInitials(company.sponsor.name)}
                                                </span>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div className="min-w-0">
                                                                <div className="max-w-[100px] truncate text-xs font-semibold text-gray-900 sm:max-w-[160px]">
                                                                    <Link
                                                                        href={`/companies/${company.sponsor.id}`}
                                                                        className="font-light transition hover:text-gray-900 hover:underline"
                                                                    >
                                                                        {company.sponsor.name}
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-gray-400">—</span>
                                                    )}
                                                </td>

                                                {/* Onboarding */}
                                                <td className="px-3 py-2.5 sm:px-4 sm:py-3">
                                                    <div className="w-20 sm:w-28">
                                                        <div className="flex items-center justify-between">
                                    <span
                                        className={`text-xs font-semibold tabular-nums ${
                                            company.checklist_progress === 100
                                                ? 'text-green-700'
                                                : company.checklist_progress >= 70
                                                    ? 'text-blue-700'
                                                    : company.checklist_progress >= 30
                                                        ? 'text-yellow-700'
                                                        : 'text-red-700'
                                        }`}
                                    >
                                        {company.checklist_progress}%
                                    </span>
                                                            <span className="hidden text-[10px] text-gray-500 tabular-nums sm:block sm:text-[11px]">
                                        {company.completed_checklist_count}/{company.total_checklist_count}
                                    </span>
                                                        </div>

                                                        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-gray-200 sm:h-2">
                                                            <div
                                                                className={`h-full transition-all duration-300 ${
                                                                    company.checklist_progress === 100
                                                                        ? 'bg-green-600'
                                                                        : company.checklist_progress >= 70
                                                                            ? 'bg-blue-600'
                                                                            : company.checklist_progress >= 30
                                                                                ? 'bg-yellow-500'
                                                                                : 'bg-red-500'
                                                                }`}
                                                                style={{ width: `${company.checklist_progress}%` }}
                                                            />
                                                        </div>
                                                        <span className="mt-0.5 block text-[10px] text-gray-500 tabular-nums sm:hidden">
                                    {company.completed_checklist_count}/{company.total_checklist_count}
                                </span>
                                                    </div>
                                                </td>

                                                {/* Status Columns (Compact on mobile) */}
                                                <td className="px-3 py-2.5 sm:px-4 sm:py-3">
                            <span
                                className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold sm:text-[11px] ${getStatusColor(
                                    company.notarization_status,
                                )}`}
                            >
                                <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
                                <span className="hidden sm:inline">
                                    {formatStatus(company.notarization_status)}
                                </span>
                                <span className="sm:hidden">
                                    {formatStatus(company.notarization_status).substring(0, 3)}
                                </span>
                            </span>
                                                </td>

                                                <td className="px-3 py-2.5 sm:px-4 sm:py-3">
                            <span
                                className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold sm:text-[11px] ${getStatusColor(
                                    company.erp_status,
                                )}`}
                            >
                                <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
                                <span className="hidden sm:inline">
                                    {formatStatus(company.erp_status)}
                                </span>
                                <span className="sm:hidden">
                                    {formatStatus(company.erp_status).substring(0, 3)}
                                </span>
                            </span>
                                                </td>

                                                <td className="px-3 py-2.5 sm:px-4 sm:py-3">
                            <span
                                className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold sm:text-[11px] ${getStatusColor(
                                    company.sales_activity,
                                )}`}
                            >
                                <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
                                <span className="hidden sm:inline">
                                    {formatStatus(company.sales_activity)}
                                </span>
                                <span className="sm:hidden">
                                    {formatStatus(company.sales_activity).substring(0, 3)}
                                </span>
                            </span>
                                                </td>

                                                <td className="px-3 py-2.5 sm:px-4 sm:py-3">
                            <span
                                className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold sm:text-[11px] ${getLevelColor(
                                    company.level,
                                )}`}
                            >
                                <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
                                <span className="hidden sm:inline">
                                    {formatStatus(company.level)}
                                </span>
                                <span className="sm:hidden">
                                    {formatStatus(company.level).substring(0, 3)}
                                </span>
                            </span>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile Pagination Banner */}
                                <div className="border-t border-gray-200 bg-gradient-to-r from-pink-50/50 via-blue-50/50 to-sky-50/50 sm:hidden">
                                    <div className="p-2">
                                        <div className="flex items-center justify-between">
                                            <div className="text-xs text-gray-700">
                                                <span className="font-semibold">{companies.from}</span>-
                                                <span className="font-semibold">{companies.to}</span> of{' '}
                                                <span className="font-semibold">{companies.total}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Link
                                                    href={pagination.prev.url || '#'}
                                                    className={`inline-flex items-center rounded border border-gray-300 p-1.5 ${
                                                        !pagination.prev.url
                                                            ? 'pointer-events-none opacity-30'
                                                            : 'hover:bg-gray-50'
                                                    }`}
                                                    preserveScroll
                                                    preserveState
                                                >
                                                    <ChevronLeft className="h-3.5 w-3.5" />
                                                </Link>
                                                <Link
                                                    href={pagination.next.url || '#'}
                                                    className={`inline-flex items-center rounded border border-gray-300 p-1.5 ${
                                                        !pagination.next.url
                                                            ? 'pointer-events-none opacity-30'
                                                            : 'hover:bg-gray-50'
                                                    }`}
                                                    preserveScroll
                                                    preserveState
                                                >
                                                    <ChevronRight className="h-3.5 w-3.5" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Desktop Pagination */}
                                <div className="hidden flex-col items-center justify-between gap-3 border-t border-gray-200 bg-gradient-to-r from-pink-50/50 via-blue-50/50 to-sky-50/50 px-4 py-3 sm:flex sm:flex-row">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
                                        <p className="text-xs text-gray-700 sm:text-sm">
                                            Showing{' '}
                                            <span className="font-semibold text-gray-900">{companies.from}</span> to{' '}
                                            <span className="font-semibold text-gray-900">{companies.to}</span> of{' '}
                                            <span className="font-semibold text-gray-900">{companies.total}</span> results
                                        </p>
                                        {searchTerm && (
                                            <div className="mt-1 sm:mt-0">
                                                <span className="text-xs text-gray-500 sm:text-sm">Search: "{searchTerm}"</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-1">
                                        {/* Prev */}
                                        <Link
                                            href={pagination.prev.url || '#'}
                                            className={`inline-flex items-center rounded-lg border border-gray-300 px-2 py-1.5 text-xs font-semibold transition sm:text-sm ${
                                                !pagination.prev.url
                                                    ? 'pointer-events-none opacity-50'
                                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                            }`}
                                            preserveScroll
                                            preserveState
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Link>

                                        {/* Pages */}
                                        {pagination.pages.map((link, index) => {
                                            const label = link.label;
                                            const isNumeric = /^\d+$/.test(label);

                                            if (!isNumeric) {
                                                return (
                                                    <span
                                                        key={`ellipsis-${index}-${label}`}
                                                        className="px-2 py-1.5 text-xs text-gray-400 sm:text-sm"
                                                    >
                            <MoreHorizontal className="h-4 w-4" />
                        </span>
                                                );
                                            }

                                            const pageNum = parseInt(label, 10);
                                            const isNear =
                                                Math.abs(pageNum - companies.current_page) <= 1 ||
                                                pageNum === 1 ||
                                                pageNum === companies.last_page;

                                            if (!isNear) return null;

                                            return (
                                                <Link
                                                    key={`${label}-${index}`}
                                                    href={link.url || '#'}
                                                    className={`inline-flex items-center rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition sm:text-sm ${
                                                        link.active
                                                            ? 'border-transparent bg-gradient-to-r from-pink-500 via-blue-500 to-sky-500 text-white'
                                                            : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                                                    }`}
                                                    aria-current={link.active ? 'page' : undefined}
                                                    preserveScroll
                                                    preserveState
                                                >
                                                    {label}
                                                </Link>
                                            );
                                        })}

                                        {/* Next */}
                                        <Link
                                            href={pagination.next.url || '#'}
                                            className={`inline-flex items-center rounded-lg border border-gray-300 px-2 py-1.5 text-xs font-semibold transition sm:text-sm ${
                                                !pagination.next.url
                                                    ? 'pointer-events-none opacity-50'
                                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                            }`}
                                            preserveScroll
                                            preserveState
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Link>
                                    </div>
                                </div>
                            </div>

                        </>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
