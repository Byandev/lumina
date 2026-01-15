// app/pages/users/performance.tsx
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
    Loader2, Mail,
    MoreHorizontal,
    Plus,
    Search,
    User, X,
} from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BreadcrumbItem, PaginatedData } from '@/types';
import { toFrontendSort } from '@/lib/sort';
import { ColumnDef } from '@tanstack/react-table';
import { Company } from '@/types/models/Company';
import { DataTable, SortableHeader } from '@/components/ui/data-table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import CompanyOwnersAvatar from '@/components/companies/company-owners-avatar';
import CircularProgress from '@/components/ui/circular-progress';
import { percentageFormatter } from '@/lib/formatter';
import StatusBadge from '@/components/companies/status-badge';
import { omit } from 'lodash';
import ComponentCard from '@/components/component-card';
import { Media } from '@/types/models/Media';

interface User {
    id: number;
    name: string;
    email: string;
    photo?: string | null;
    phone?: string | null;
    photo_url?: string | null;
    created_at?: string;
    updated_at?: string;
    email_verified_at?: string;
    role?: string;
    facebook?: string;
    birthdate?: string;
    address?: string;
    profile_picture?: Media | null
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
    users: PaginatedData<User>;
    search?: string;
    query?: {
        sort?: string | null;
        perPage?: number | string;
        page?: number | string;
        filter?: {
            search?: string;
        };
    };
}

type CreateUserFormData = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role: string;
};

export default function Index({
                                  users, query
                              }: UsersPageProps) {
    const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState((query?.filter?.search ?? ''));

    useEffect(() => {
        const currentSearchParam = query?.filter?.search ?? '';

        if (searchValue === currentSearchParam) {
            return;
        }

        const timer = setTimeout(() => {
            router.get(
                '/users',
                {
                    sort: query?.sort,
                    'filter[search]': searchValue || undefined,
                    page: 1,
                },
                {
                    preserveState: true,
                    replace: true,
                    preserveScroll: true,
                },
            );
        }, 500);

        return () => clearTimeout(timer);
    }, [searchValue, query?.filter?.search, query?.sort]);

    const initialSorting = useMemo(() => {
        return toFrontendSort(query?.sort ?? null);
    }, [query?.sort]);

    // Create Form
    const {
        data: createData,
        setData: setCreateData,
        post: createUser,
        processing: creating,
        reset: resetCreate,
        errors: createErrors,
    } = useForm<CreateUserFormData>({
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

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-PH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .filter(Boolean)
            .map((word) => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const columns: ColumnDef<User>[] = [
        {
            accessorKey: 'name',
            header: ({ column }) => (
                <SortableHeader column={column} title={'Name'} />
            ),
            cell: ({ row }) => {
                const user = row.original;

                return (
                    <div className="flex items-center gap-2 sm:gap-3">
                        <Avatar>
                            <AvatarImage
                                src={`/${user?.photo}`}
                                alt={user.name}
                            />
                            <AvatarFallback>
                                {' '}
                                {getInitials(user.name)}
                            </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0">
                            <div className="max-w-[140px] truncate text-sm font-semibold text-gray-900 sm:max-w-[240px]">
                                {user.name}
                            </div>
                            {user.email && (
                                <div className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                                    <Mail className="h-3 w-3 flex-shrink-0 text-gray-400 sm:h-3.5 sm:w-3.5" />
                                    <span className="max-w-[120px] truncate sm:max-w-[260px]">
                                        {user.email}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: 'email',
            header: ({ column }) => (
                <SortableHeader column={column} title={'Email'} />
            ),
            cell: ({ row }) => {
                const user = row.original;

                return (
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="min-w-0">
                            <div className="max-w-[140px] truncate text-sm text-gray-900 sm:max-w-[240px]">
                                {user.email}
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: 'role',
            header: ({ column }) => (
                <SortableHeader column={column} title={'Role'} />
            ),
            cell: ({ row }) => {
                const user = row.original;

                return (
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="min-w-0">
                            <div className="max-w-[140px] truncate text-sm text-gray-900 sm:max-w-[240px]">
                                {user?.role}
                            </div>
                        </div>
                    </div>
                );
            },
        },
    ];

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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="min-h-screen p-4 md:py-6">
                {/* Header */}
                <div className="mb-4 flex flex-col gap-3 sm:flex-row items-center sm:justify-between">
                    <div className="min-w-0">
                        <h1 className="text-lg md:text-xl font-semibold text-foreground">
                            Users
                        </h1>
                    </div>
                    <div className="flex items-end space-x-2">
                        <div className="relative max-w-md">
                            <Search className="pointer-events-none absolute top-4.5 left-3 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search users..."
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                className="h-9 pr-9 pl-9"
                            />
                        </div>
                        <Dialog
                            open={isCreateOpen}
                            onOpenChange={setIsCreateOpen}
                        >
                            <DialogTrigger asChild>
                                <Button className="gap-2">
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
                                                onChange={(e) =>
                                                    setCreateData(
                                                        'name',
                                                        e.target.value,
                                                    )
                                                }
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
                                                onChange={(e) =>
                                                    setCreateData(
                                                        'email',
                                                        e.target.value,
                                                    )
                                                }
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
                                            onClick={() =>
                                                setIsCreateOpen(false)
                                            }
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
                </div>

                <div className="mb-2">
                    {searchValue ? (
                        <p className="mt-2 text-xs text-muted-foreground">
                            Results for{' '}
                            <span className="font-medium text-foreground">
								"{searchValue}"
							</span>
                        </p>
                    ) : null}
                </div>

                <ComponentCard desc="Manage all users in your system">
                    <DataTable
                        columns={columns}
                        enableInternalPagination={false}
                        data={users.data || []}
                        initialSorting={initialSorting}
                        meta={{ ...omit(users, ['data']) }}
                        onFetch={(params) => {
                            router.get(
                                '/users',
                                {
                                    sort: params?.sort,
                                    'filter[search]': searchValue || undefined,
                                    page: params?.page ?? 1,
                                },
                                {
                                    preserveState: false,
                                    replace: true,
                                    preserveScroll: true,
                                },
                            );
                        }}
                    />
                </ComponentCard>
            </div>
        </AppLayout>
    );
}
