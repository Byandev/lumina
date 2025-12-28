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
} from 'lucide-react';
import { useCallback, useState } from 'react';

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
    let timeout: NodeJS.Timeout;
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
            .map((word) => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const formatStatus = (status?: string) => {
        if (!status) return 'N/A';
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    const getStatusColor = (status?: string) => {
        switch (status?.toLowerCase()) {
            case 'active':
            case 'completed':
            case 'done':
                return 'bg-green-100 text-green-800';
            case 'pending':
            case 'in_progress':
                return 'bg-yellow-100 text-yellow-800';
            case 'inactive':
            case 'failed':
            case 'terminated':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getLevelColor = (level?: string) => {
        switch (level?.toLowerCase()) {
            case 'educate':
                return 'bg-yellow-100 text-yellow-800';
            case 'empowerment':
                return 'bg-gray-100 text-gray-800';
            case 'enterprise':
                return 'bg-blue-100 text-blue-800';
            case 'exponential':
                return 'bg-orange-100 text-orange-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const [searchTerm, setSearchTerm] = useState(initialSearch);

    const debouncedSearch = useCallback(
        debounce((value: string) => {
            router.get(
                '/companies',
                { search: value },
                { preserveState: true, replace: true },
            );
        }, 500),
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
            { search: searchTerm },
            { preserveState: true, replace: true },
        );
    };

    const clearSearch = () => {
        setSearchTerm('');
        router.get('/companies', {}, { preserveState: true, replace: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Companies" />

            <div className="px-4 py-6">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">
                            Companies
                        </h1>
                        <p className="mt-0.5 text-xs text-gray-500">
                            Manage all companies in your system
                        </p>
                    </div>
                    <div>
                        <Link
                            href="/companies/create"
                            className="inline-flex items-center gap-1.5 rounded-lg bg-black px-3 py-2 text-xs font-medium text-white transition hover:bg-gray-800"
                        >
                            <Plus className="h-3.5 w-3.5" />
                            Add Company
                        </Link>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="mb-4">
                    <form
                        onSubmit={handleSearchSubmit}
                        className="relative w-80"
                    >
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder="Search companies by name..."
                            className="w-full rounded-lg border border-gray-300 py-2 pr-10 pl-9 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                        {searchTerm && (
                            <button
                                type="button"
                                onClick={clearSearch}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                            >
                                ×
                            </button>
                        )}
                    </form>
                    {searchTerm && (
                        <p className="mt-2 text-xs text-gray-500">
                            Searching for: "{searchTerm}" • {companies.total}{' '}
                            result{companies.total !== 1 ? 's' : ''} found
                        </p>
                    )}
                </div>

                {/* Companies Table - Compact */}
                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                    {companies.data.length === 0 ? (
                        <div className="px-6 py-8 text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                                <Building className="h-6 w-6 text-gray-400" />
                            </div>
                            <h3 className="mt-3 text-sm font-medium text-gray-900">
                                {searchTerm
                                    ? 'No companies found'
                                    : 'No companies yet'}
                            </h3>
                            <p className="mt-1 text-xs text-gray-500">
                                {searchTerm
                                    ? `No companies match your search for "${searchTerm}"`
                                    : 'Get started by creating your first company.'}
                            </p>
                            <div className="mt-4">
                                {searchTerm ? (
                                    <button
                                        onClick={clearSearch}
                                        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                                    >
                                        Clear search
                                    </button>
                                ) : (
                                    <Link
                                        href="/companies/create"
                                        className="inline-flex items-center gap-1.5 rounded-lg bg-black px-3 py-1.5 text-xs font-medium text-white transition hover:bg-gray-800"
                                    >
                                        <Plus className="h-3.5 w-3.5" />
                                        Add Company
                                    </Link>
                                )}
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 text-sm">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-3 py-2.5 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                Company
                                            </th>
                                            <th className="px-3 py-2.5 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                Owners
                                            </th>
                                            <th className="px-3 py-2.5 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                Sponsor
                                            </th>
                                            <th className="px-3 py-2.5 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                Onboarding
                                            </th>
                                            <th className="px-3 py-2.5 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                Notarization
                                            </th>
                                            <th className="px-3 py-2.5 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                ERP
                                            </th>
                                            <th className="px-3 py-2.5 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                Sales
                                            </th>
                                            <th className="px-3 py-2.5 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                Level
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {companies.data.map((company) => (
                                            <tr
                                                key={company.id}
                                                className="hover:bg-gray-50"
                                            >
                                                {/* Company Column */}
                                                <td className="px-3 py-2.5">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-7 w-7 flex-shrink-0">
                                                            {company.logo ? (
                                                                <img
                                                                    src={`/storage/${company.logo}`}
                                                                    alt={
                                                                        company.name
                                                                    }
                                                                    className="h-7 w-7 rounded border object-cover"
                                                                />
                                                            ) : (
                                                                <div className="flex h-7 w-7 items-center justify-center rounded border bg-gray-100">
                                                                    <span className="text-xs font-medium text-gray-600">
                                                                        {getInitials(
                                                                            company.name,
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="text-xs font-medium text-gray-900">
                                                                <Link
                                                                    href={`/companies/${company.id}`}
                                                                    className="hover:underline"
                                                                >
                                                                    {company
                                                                        .name
                                                                        .length >
                                                                    20
                                                                        ? `${company.name.substring(0, 20)}...`
                                                                        : company.name}
                                                                </Link>
                                                            </div>

                                                            {company.email && (
                                                                <div className="flex items-center text-xs text-gray-500">
                                                                    <Mail className="mr-1 h-3 w-3" />
                                                                    {company
                                                                        .email
                                                                        .length >
                                                                    25
                                                                        ? `${company.email.substring(0, 25)}...`
                                                                        : company.email}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Owners Column */}
                                                <td className="px-3 py-2.5">
                                                    <div className="space-y-1">
                                                        {company.owners &&
                                                        company.owners.length >
                                                            0 ? (
                                                            company.owners
                                                                .slice(0, 2)
                                                                .map(
                                                                    (owner) => (
                                                                        <div
                                                                            key={
                                                                                owner.id
                                                                            }
                                                                            className="flex items-center gap-1.5"
                                                                        >
                                                                            <div className="h-5 w-5 flex-shrink-0 overflow-hidden rounded-full border border-gray-200 bg-gray-100">
                                                                                {owner.photo ? (
                                                                                    <img
                                                                                        src={`/storage/${owner.photo}`}
                                                                                        alt={
                                                                                            owner.name
                                                                                        }
                                                                                        className="h-full w-full object-cover"
                                                                                    />
                                                                                ) : (
                                                                                    <div className="flex h-full w-full items-center justify-center">
                                                                                        <span className="text-[9px] font-medium text-gray-600">
                                                                                            {getInitials(
                                                                                                owner.name,
                                                                                            )}
                                                                                        </span>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                            <div className="min-w-0">
                                                                                <div className="truncate text-xs font-medium text-gray-900">
                                                                                    {owner
                                                                                        .name
                                                                                        .length >
                                                                                    15
                                                                                        ? `${owner.name.substring(0, 15)}...`
                                                                                        : owner.name}
                                                                                </div>
                                                                                <div className="truncate text-[10px] text-gray-500">
                                                                                    {owner
                                                                                        .email
                                                                                        .length >
                                                                                    20
                                                                                        ? `${owner.email.substring(0, 20)}...`
                                                                                        : owner.email}
                                                                                </div>
                                                                            </div>
                                                                            {owner.is_primary && (
                                                                                <span className="inline-flex items-center rounded-full bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-700">
                                                                                    Primary
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    ),
                                                                )
                                                        ) : (
                                                            <div className="flex items-center gap-1.5 text-gray-400">
                                                                <Users className="h-4 w-4" />
                                                                <span className="text-xs">
                                                                    No owners
                                                                </span>
                                                            </div>
                                                        )}
                                                        {company.owners &&
                                                            company.owners
                                                                .length > 2 && (
                                                                <div className="pl-6">
                                                                    <span className="text-xs text-gray-500">
                                                                        +
                                                                        {company
                                                                            .owners
                                                                            .length -
                                                                            2}{' '}
                                                                        more
                                                                        owner
                                                                        {company
                                                                            .owners
                                                                            .length -
                                                                            2 !==
                                                                        1
                                                                            ? 's'
                                                                            : ''}
                                                                    </span>
                                                                </div>
                                                            )}
                                                    </div>
                                                </td>

                                                <td className="px-3 py-2.5">
                                                    {company.sponsor ? (
                                                        <div className="flex items-center gap-1.5">
                                                            <div className="h-5 w-5 flex-shrink-0">
                                                                {company.sponsor
                                                                    .logo ? (
                                                                    <img
                                                                        src={`/storage/${company.sponsor.logo}`}
                                                                        alt={
                                                                            company
                                                                                .sponsor
                                                                                .name
                                                                        }
                                                                        className="h-5 w-5 rounded border object-cover"
                                                                    />
                                                                ) : (
                                                                    <div className="flex h-5 w-5 items-center justify-center rounded border bg-gray-100">
                                                                        <span className="text-[8px] font-medium text-gray-600">
                                                                            {getInitials(
                                                                                company
                                                                                    .sponsor
                                                                                    .name,
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <div className="truncate text-xs font-medium text-gray-900">
                                                                    <Link
                                                                        href={`/companies/${company.sponsor.id}`}
                                                                        className="hover:underline"
                                                                    >
                                                                        {company
                                                                            .sponsor
                                                                            .name
                                                                            .length >
                                                                        15
                                                                            ? `${company.sponsor.name.substring(0, 15)}...`
                                                                            : company
                                                                                  .sponsor
                                                                                  .name}
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-gray-400">
                                                            -
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="px-3 py-2.5">
                                                    <div className="flex items-center">
                                                        <div className="w-full">
                                                            <div className="mb-0.5 h-1.5 w-20 overflow-hidden rounded-full bg-gray-200">
                                                                <div
                                                                    className={`h-full transition-all duration-300 ${
                                                                        company.checklist_progress ===
                                                                        100
                                                                            ? 'bg-green-600'
                                                                            : company.checklist_progress >=
                                                                                70
                                                                              ? 'bg-blue-600'
                                                                              : company.checklist_progress >=
                                                                                  30
                                                                                ? 'bg-yellow-500'
                                                                                : 'bg-red-500'
                                                                    }`}
                                                                    style={{
                                                                        width: `${company.checklist_progress}%`,
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="flex items-center justify-between">
                                                                <span
                                                                    className={`text-xs font-medium ${
                                                                        company.checklist_progress ===
                                                                        100
                                                                            ? 'text-green-700'
                                                                            : company.checklist_progress >=
                                                                                70
                                                                              ? 'text-blue-700'
                                                                              : company.checklist_progress >=
                                                                                  30
                                                                                ? 'text-yellow-700'
                                                                                : 'text-red-700'
                                                                    }`}
                                                                >
                                                                    {
                                                                        company.checklist_progress
                                                                    }
                                                                    %
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Rest of the columns remain the same */}
                                                <td className="px-3 py-2.5">
                                                    <span
                                                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(company.notarization_status)}`}
                                                    >
                                                        {formatStatus(
                                                            company.notarization_status,
                                                        )}
                                                    </span>
                                                </td>

                                                <td className="px-3 py-2.5">
                                                    <span
                                                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(company.erp_status)}`}
                                                    >
                                                        {formatStatus(
                                                            company.erp_status,
                                                        )}
                                                    </span>
                                                </td>

                                                <td className="px-3 py-2.5">
                                                    <span
                                                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(company.sales_activity)}`}
                                                    >
                                                        {formatStatus(
                                                            company.sales_activity,
                                                        )}
                                                    </span>
                                                </td>

                                                <td className="px-3 py-2.5">
                                                    <span
                                                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getLevelColor(company.level)}`}
                                                    >
                                                        {formatStatus(
                                                            company.level,
                                                        )}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-200 px-4 py-3 sm:flex-row">
                                {/* Showing results info */}
                                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
                                    <p className="text-xs text-gray-700">
                                        Showing{' '}
                                        <span className="font-medium">
                                            {companies.from}
                                        </span>{' '}
                                        to{' '}
                                        <span className="font-medium">
                                            {companies.to}
                                        </span>{' '}
                                        of{' '}
                                        <span className="font-medium">
                                            {companies.total}
                                        </span>{' '}
                                        results
                                    </p>
                                    {searchTerm && (
                                        <div className="mt-1 sm:mt-0">
                                            <span className="text-xs text-gray-500">
                                                Search: "{searchTerm}"
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Pagination Links */}
                                <div className="flex items-center gap-1">
                                    {/* Previous Page */}
                                    <Link
                                        href={companies.links[0].url || '#'}
                                        className={`inline-flex items-center rounded border border-gray-300 px-2 py-1.5 text-xs font-medium ${
                                            companies.current_page === 1
                                                ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                                                : 'bg-white text-gray-700 hover:bg-gray-50'
                                        }`}
                                        preserveScroll
                                        preserveState
                                    >
                                        <ChevronLeft className="h-3.5 w-3.5" />
                                    </Link>

                                    {/* Page Numbers */}
                                    {companies.links
                                        .slice(1, -1)
                                        .map((link, index) => {
                                            const pageNum = link.label;
                                            const isCurrent = link.active;
                                            const isNearCurrent =
                                                Math.abs(
                                                    parseInt(pageNum) -
                                                        companies.current_page,
                                                ) <= 1 ||
                                                pageNum === '1' ||
                                                pageNum ===
                                                    companies.last_page.toString();

                                            if (!isNearCurrent) {
                                                if (
                                                    index === 1 ||
                                                    index ===
                                                        companies.links.length -
                                                            3
                                                ) {
                                                    return (
                                                        <span
                                                            key={`ellipsis-${index}`}
                                                            className="px-2 py-1.5 text-xs text-gray-500"
                                                        >
                                                            <MoreHorizontal className="h-3.5 w-3.5" />
                                                        </span>
                                                    );
                                                }
                                                return null;
                                            }

                                            return (
                                                <Link
                                                    key={index}
                                                    href={link.url || '#'}
                                                    className={`inline-flex items-center rounded border px-2.5 py-1.5 text-xs font-medium ${
                                                        isCurrent
                                                            ? 'z-10 border-blue-500 bg-blue-50 text-blue-600'
                                                            : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                                                    }`}
                                                    preserveScroll
                                                    preserveState
                                                >
                                                    {link.label}
                                                </Link>
                                            );
                                        })}

                                    {/* Next Page */}
                                    <Link
                                        href={
                                            companies.links[
                                                companies.links.length - 1
                                            ].url || '#'
                                        }
                                        className={`inline-flex items-center rounded border border-gray-300 px-2 py-1.5 text-xs font-medium ${
                                            companies.current_page ===
                                            companies.last_page
                                                ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                                                : 'bg-white text-gray-700 hover:bg-gray-50'
                                        }`}
                                        preserveScroll
                                        preserveState
                                    >
                                        <ChevronRight className="h-3.5 w-3.5" />
                                    </Link>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
