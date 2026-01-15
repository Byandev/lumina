import { omit } from 'lodash';
import { router, useForm, usePage } from '@inertiajs/react';
import { Key, Mail, Search, Trash2 } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import React, { useEffect, useMemo, useState } from 'react';

import AppLayout from '@/layouts/app-layout';
import { Input } from '@/components/ui/input';
import ComponentCard from '@/components/component-card';
import { DataTable, SortableHeader } from '@/components/ui/data-table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { toFrontendSort } from '@/lib/sort';
import { useInitials } from '@/hooks/use-initials';
import { BreadcrumbItem, PaginatedData, type SharedData, User } from '@/types';
import FormModal from '@/components/users/form-modal';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import ConfirmationDialog from '@/components/confirmation-dialog';
import ChangePasswordModal from '@/components/users/change-password-modal';

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

export default function Index({ users, query }: UsersPageProps) {
    const page = usePage<SharedData>();
    const getInitials = useInitials();
    const { auth } = page.props;

    const [searchValue, setSearchValue] = useState((query?.filter?.search ?? ''));
    const [openFormModal, setOpenFormModal] = useState(false);
    const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [openChangePasswordModal, setOpenChangePasswordModal] =
        useState(false);

    const { delete: destroy } = useForm()

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


    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => [
            {
                title: 'Users',
                href: '/users',
            },
        ],
        [],
    );

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
            accessorKey: 'id',
            header: ({ column }) => (
                <SortableHeader
                    column={column}
                    title={'Actions'}
                    sortable={false}
                />
            ),
            cell: ({ row }) => {
                return (
                    <div>
                        <TooltipProvider>
                            <div className="flex items-center justify-center gap-1.5">
                                {/* Edit */}
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => {
                                                setSelectedUser(row.original);
                                                setOpenChangePasswordModal(true)
                                            }}
                                            className="h-8 w-8"
                                        >
                                            <Key className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Change Password</p>
                                    </TooltipContent>
                                </Tooltip>

                                {/* Delete */}
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            disabled={auth.user.id === row.original.id}
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => {
                                                setSelectedUser(row.original);
                                                setOpenConfirmationModal(true);
                                            }}
                                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Delete user</p>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        </TooltipProvider>
                    </div>
                );
            },
        },
    ];


    const handleDeleteConfirm = () => {
        if (selectedUser) {
            destroy(`/users/${selectedUser.id}`, {
                onSuccess: () => {
                    setOpenConfirmationModal(false);
                    setSelectedUser(null);
                },
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <FormModal open={openFormModal} onOpenChange={setOpenFormModal} />

            <ChangePasswordModal
                open={openChangePasswordModal}
                onOpenChange={setOpenChangePasswordModal}
                user={selectedUser}
            />

            <ConfirmationDialog
                isOpen={openConfirmationModal}
                onOpenChange={setOpenConfirmationModal}
                onCancel={() => {
                    setOpenConfirmationModal(false);
                    setSelectedUser(null);
                }}
                description={`This action cannot be undone. This will permanently delete the user "${selectedUser?.name}" and remove it from our servers.`}
                onConfirm={() => handleDeleteConfirm()}
            />

            <div className="min-h-screen p-4 sm:p-8">
                <p className="my-0 pb-6 text-3xl font-semibold text-foreground">
                    Users
                </p>

                <ComponentCard desc="Manage all users in your system">
                    <div className="mb-6 flex justify-between">
                        <div className="flex items-end space-x-2">
                            <div className="relative max-w-md">
                                <Search className="pointer-events-none absolute top-4.5 left-3 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Search users..."
                                    value={searchValue}
                                    onChange={(e) =>
                                        setSearchValue(e.target.value)
                                    }
                                    className="h-9 pr-9 pl-9"
                                />
                            </div>
                        </div>

                        <Button
                            variant={'default'}
                            onClick={() => setOpenFormModal(true)}
                        >
                            Add new User
                        </Button>
                    </div>
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
