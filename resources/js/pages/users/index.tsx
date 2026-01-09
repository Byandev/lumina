// app/pages/users/index.tsx
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Link, router, useForm } from '@inertiajs/react';
import debounce from 'lodash/debounce';
import {
    Calendar,
    ChevronLeft,
    ChevronRight,
    Loader2,
    MoreHorizontal,
    Plus,
    Search,
    User, X,
} from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type { BreadcrumbItem } from '@/types';

interface User {
    id: number;
    name: string;
    email: string;
    photo?: string | null;
    photo_url?: string | null; // Added photo_url field
    created_at?: string;
    updated_at?: string;
    email_verified_at?: string;
    role?: string;
}

interface PaginatedResponse<T> {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

interface UsersPageProps {
    users: PaginatedResponse<User>;
    search: string;
    status?: string;
    role?: string;
}

export default function Index({
                                  users,
                                  search: initialSearch,
                                  status: initialStatus,
                                  role: initialRole,
                              }: UsersPageProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(initialSearch || '');
    const [isSearching, setIsSearching] = useState(false);
    const [statusFilter, setStatusFilter] = useState(initialStatus || 'all');
    const [roleFilter, setRoleFilter] = useState(initialRole || 'all');

    // Create Form
    const {
        data: createData,
        setData: setCreateData,
        post: createUser,
        processing: creating,
        reset: resetCreate,
        errors: createErrors,
    } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'user',
    });

    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => [
            {
                title: 'Users',
                href: '/users',
            },
        ],
        [],
    );

    // Debounced search
    const performSearch = useCallback(
        debounce((term: string) => {
            setIsSearching(true);
            router.get(
                '/users',
                {
                    search: term || undefined,
                },
                {
                    preserveState: true,
                    replace: true,
                    preserveScroll: true,
                    onFinish: () => setIsSearching(false),
                },
            );
        }, 450),
        [],
    );

    useEffect(() => {
        return () => performSearch.cancel();
    }, [performSearch]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        performSearch(value, statusFilter, roleFilter);
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setIsSearching(true);
        router.get('/users', {}, { preserveState: true, preserveScroll: true, onFinish: () => setIsSearching(false) });
    };

    // Create
    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createUser('/users', {
            preserveScroll: true,
            onSuccess: () => {
                setIsCreateOpen(false);
                resetCreate();
            },
        });
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-PH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const pagination = useMemo(() => {
        const prev = users.links[0];
        const next = users.links[users.links.length - 1];
        const pages = users.links.slice(1, -1);
        return { prev, next, pages };
    }, [users.links]);

    const hasData = users.data.length > 0;
    const hasActiveFilters = Boolean(searchTerm);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="min-h-screen p-6 sm:p-4">
                {/* Header */}
                <div className=" mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div className="min-w-0">
                        <h1 className="text-lg font-semibold text-foreground">
                            Users
                        </h1>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                            Manage all users in your system
                        </p>
                    </div>

                    {/* Create */}
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" className=" gap-2">
                                <Plus className="h-4 w-4" />
                                <span className="hidden sm:inline">
                                    Add User
                                </span>
                                <span className="sm:hidden">Add</span>
                            </Button>
                        </DialogTrigger>

                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle className="text-lg">
                                    Create New User
                                </DialogTitle>
                                <DialogDescription className="text-sm">
                                    Add a new user to your system
                                </DialogDescription>
                            </DialogHeader>

                            <form onSubmit={handleCreate}>
                                <div className="space-y-4 py-3">
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="name"
                                            className="text-sm"
                                        >
                                            Full Name
                                        </Label>
                                        <Input
                                            id="name"
                                            value={createData.name}
                                            onChange={(e) => setCreateData('name', e.target.value)}
                                            placeholder="John Doe"
                                            className={
                                                createErrors.name
                                                    ? 'h-10 border-red-300'
                                                    : 'h-10'
                                            }
                                        />
                                        {createErrors.name && (
                                            <p className="mt-1 text-xs text-red-500">
                                                {createErrors.name}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="email"
                                            className="text-sm"
                                        >
                                            Email Address
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={createData.email}
                                            onChange={(e) => setCreateData('email', e.target.value)}
                                            placeholder="john@example.com"
                                            className={
                                                createErrors.email
                                                    ? 'h-10 border-red-300'
                                                    : 'h-10'
                                            }
                                        />
                                        {createErrors.email && (
                                            <p className="mt-1 text-xs text-red-500">
                                                {createErrors.email}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="password"
                                                className="text-sm"
                                            >
                                                Password
                                            </Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                value={createData.password}
                                                onChange={(e) =>
                                                    setCreateData(
                                                        'password',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="••••••••"
                                                className={
                                                    createErrors.password
                                                        ? 'h-10 border-red-300'
                                                        : 'h-10'
                                                }
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="password_confirmation"
                                                className="text-sm"
                                            >
                                                Confirm
                                            </Label>
                                            <Input
                                                id="password_confirmation"
                                                type="password"
                                                value={
                                                    createData.password_confirmation
                                                }
                                                onChange={(e) =>
                                                    setCreateData(
                                                        'password_confirmation',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="••••••••"
                                                className="h-10"
                                            />
                                        </div>
                                    </div>

                                    {createErrors.password && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {createErrors.password}
                                        </p>
                                    )}
                                </div>

                                <DialogFooter className="mt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsCreateOpen(false)}
                                        disabled={creating}
                                        size="sm"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={creating}
                                        size="sm"
                                    >
                                        {creating ? (
                                            <>
                                                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                                                Creating...
                                            </>
                                        ) : (
                                            'Create User'
                                        )}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="relative mt-4 max-w-md mb-2">
                    <Search className="pointer-events-none absolute top-4.5 left-3 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search events..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="h-9 pr-9 pl-9"
                    />
                    {searchTerm ? (
                        <button
                            type="button"
                            onClick={handleClearFilters}
                            className="absolute top-4.5 right-2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
                            aria-label="Clear search"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    ) : null}

                    {searchTerm ? (
                        <p className="mt-2 text-xs text-muted-foreground">
                            Results for{' '}
                            <span className="font-medium text-foreground">
                                "{searchTerm}"
                            </span>
                        </p>
                    ) : null}
                </div>


                {/* Table Card */}
                <div className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                            <tr className="bg-gray-100">
                                <th className="px-4 py-2 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                                    User
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                                    Email
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                                    Created
                                </th>
                            </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                            {!hasData ? (
                                <tr>
                                    <td
                                        colSpan={3}
                                        className="px-4 py-10 text-center"
                                    >
                                        <div className="mx-auto max-w-md">
                                            {isSearching ? (
                                                <div className="flex flex-col items-center justify-center gap-3">
                                                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        Searching users...
                                                    </p>
                                                </div>
                                            ) : hasActiveFilters ? (
                                                <div className="flex flex-col items-center justify-center gap-3">
                                                    <div className="rounded-full bg-gray-100 p-3">
                                                        <Search className="h-6 w-6 text-gray-400" />
                                                    </div>
                                                    <div className="space-y-1 text-center">
                                                        <p className="text-sm font-semibold text-gray-900">
                                                            No users found
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            Try adjusting
                                                            your search
                                                        </p>
                                                    </div>
                                                    <Button
                                                        variant="outline"
                                                        onClick={
                                                            handleClearFilters
                                                        }
                                                        size="sm"
                                                    >
                                                        Clear Search
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center gap-3">
                                                    <div className="rounded-full bg-blue-50 p-3">
                                                        <User className="h-6 w-6 text-blue-500" />
                                                    </div>
                                                    <div className="space-y-1 text-center">
                                                        <p className="text-sm font-semibold text-gray-900">
                                                            No users yet
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            Get started by
                                                            creating your
                                                            first user
                                                        </p>
                                                    </div>
                                                    <Button
                                                        onClick={() =>
                                                            setIsCreateOpen(
                                                                true,
                                                            )
                                                        }
                                                        size="sm"
                                                    >
                                                        <Plus className="mr-1.5 h-3.5 w-3.5" />
                                                        Add User
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                users.data.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="transition-colors even:bg-gray-50/30 hover:bg-gray-50/70"
                                    >
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#FF8AC4] to-[#6AA7FF] shadow-sm ring-1 ring-white">
                                                    {user?.photo_url ? (
                                                        <img
                                                            src={user.photo_url}
                                                            alt={user.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <User className="h-4 w-4 text-white" />
                                                    )}
                                                </div>

                                                <div className="min-w-0">
                                                    <div className="max-w-[260px] truncate text-sm font-semibold text-gray-900">
                                                        {user.name}
                                                    </div>
                                                    <div className="max-w-[260px] truncate text-xs text-gray-500">
                                                        ID: {user.id}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-4 py-3">
                                            <div className="text-sm text-gray-700">
                                                {user.email}
                                            </div>
                                        </td>

                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="h-3.5 w-3.5 text-gray-400" />
                                                <span className="text-xs text-gray-600">
                                                        {formatDate(
                                                            user.created_at,
                                                        )}
                                                    </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-100 bg-white px-4 py-3 sm:flex-row">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
                            <p className="text-xs text-gray-700">
                                Showing{' '}
                                <span className="font-medium">
                                    {users.from}
                                </span>{' '}
                                to{' '}
                                <span className="font-medium">{users.to}</span>{' '}
                                of{' '}
                                <span className="font-medium">
                                    {users.total}
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

                        <div className="flex items-center gap-1">
                            {/* Prev */}
                            <Link
                                href={pagination.prev.url || '#'}
                                className={`inline-flex items-center rounded-lg border border-gray-300 px-2 py-1.5 text-xs font-medium transition ${
                                    pagination.prev.url
                                        ? 'bg-white text-gray-700 hover:bg-gray-50'
                                        : 'pointer-events-none opacity-50'
                                }`}
                                preserveScroll
                                preserveState
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Link>

                            {/* Pages */}
                            {pagination.pages.map((link, index) => {
                                const label = link.label;

                                // Render ellipsis labels from Laravel paginator
                                if (!/^\d+$/.test(label)) {
                                    return (
                                        <span
                                            key={`ellipsis-${index}-${label}`}
                                            className="px-2 py-1.5 text-xs text-gray-500"
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                        </span>
                                    );
                                }

                                const pageNum = parseInt(label, 10);
                                const isNear =
                                    Math.abs(pageNum - users.current_page) <=
                                    1 ||
                                    pageNum === 1 ||
                                    pageNum === users.last_page;

                                if (!isNear) return null;

                                return (
                                    <Link
                                        key={`${label}-${index}`}
                                        href={link.url || '#'}
                                        className={`inline-flex items-center rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${
                                            link.active
                                                ? 'border-transparent bg-gradient-to-r from-pink-300 via-violet-300 to-cyan-300 text-white'
                                                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                                        }`}
                                        preserveScroll
                                        preserveState
                                        aria-current={
                                            link.active ? 'page' : undefined
                                        }
                                    >
                                        {label}
                                    </Link>
                                );
                            })}

                            {/* Next */}
                            <Link
                                href={pagination.next.url || '#'}
                                className={`inline-flex items-center rounded-lg border border-gray-300 px-2 py-1.5 text-xs font-medium transition ${
                                    pagination.next.url
                                        ? 'bg-white text-gray-700 hover:bg-gray-50'
                                        : 'pointer-events-none opacity-50'
                                }`}
                                preserveScroll
                                preserveState
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
