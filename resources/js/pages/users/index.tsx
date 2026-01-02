// app/pages/users/index.tsx
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Link, router, useForm } from '@inertiajs/react';
import {
    ChevronLeft,
    ChevronRight,
    Edit,
    MoreVertical,
    Plus,
    Search,
    Trash2,
    X,
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';

interface User {
    id: number;
    name: string;
    email: string;
    created_at?: string;
    updated_at?: string;
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
}

export default function Index({ users, search: initialSearch }: UsersPageProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [searchTerm, setSearchTerm] = useState(initialSearch || '');
    const [isSearching, setIsSearching] = useState(false);

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
    });

    // Edit Form
    const {
        data: editData,
        setData: setEditData,
        put: updateUser,
        processing: updating,
        errors: editErrors,
    } = useForm({
        name: '',
        email: '',
    });

    // Delete Form
    const { delete: deleteUser, processing: deleting } = useForm({});

    // Debounced search function
    const performSearch = useCallback(
        debounce((term: string) => {
            if (term.trim() === '' && initialSearch === '') {
                return; // Don't search if empty and no initial search
            }

            setIsSearching(true);
            router.get(
                '/users',
                { search: term },
                {
                    preserveState: true,
                    replace: true,
                    preserveScroll: true,
                    onFinish: () => setIsSearching(false),
                },
            );
        }, 500), // 500ms debounce delay
        [initialSearch],
    );

    // Handle search input change with debounce
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        performSearch(value);
    };

    // Clear search
    const handleClearSearch = () => {
        setSearchTerm('');
        if (initialSearch) {
            setIsSearching(true);
            router.get(
                '/users',
                {},
                {
                    preserveState: true,
                    replace: true,
                    preserveScroll: true,
                    onFinish: () => setIsSearching(false),
                },
            );
        }
    };

    // Handle Create
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

    // Handle Edit
    const handleEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return;

        updateUser(`/users/${selectedUser.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setIsEditOpen(false);
                setSelectedUser(null);
            },
        });
    };

    // Handle Delete
    const handleDelete = () => {
        if (!selectedUser) return;

        deleteUser(`/users/${selectedUser.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setIsDeleteOpen(false);
                setSelectedUser(null);
            },
        });
    };

    // Open Edit Dialog
    const openEditDialog = (user: User) => {
        setSelectedUser(user);
        setEditData({
            name: user.name,
            email: user.email,
        });
        setIsEditOpen(true);
    };

    // Open Delete Dialog
    const openDeleteDialog = (user: User) => {
        setSelectedUser(user);
        setIsDeleteOpen(true);
    };

    // Format Date
    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-PH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    // Cleanup debounce on unmount
    useEffect(() => {
        return () => {
            performSearch.cancel();
        };
    }, [performSearch]);

    return (
        <AppLayout>
            <div className="p-6">
                {/* Header */}
                <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Users Management
                        </h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Manage user accounts and permissions
                        </p>
                    </div>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Add User
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New User</DialogTitle>
                                <DialogDescription>
                                    Create a new user account with email and
                                    password.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreate}>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
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
                                            required
                                        />
                                        {createErrors.name && (
                                            <p className="text-sm text-red-500">
                                                {createErrors.name}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">
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
                                            required
                                        />
                                        {createErrors.email && (
                                            <p className="text-sm text-red-500">
                                                {createErrors.email}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password">
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
                                            required
                                        />
                                        {createErrors.password && (
                                            <p className="text-sm text-red-500">
                                                {createErrors.password}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password_confirmation">
                                            Confirm Password
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
                                            required
                                        />
                                    </div>
                                </div>
                                <DialogFooter className="mt-6">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsCreateOpen(false)}
                                        disabled={creating}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={creating}>
                                        {creating
                                            ? 'Creating...'
                                            : 'Create User'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Search and Stats */}
                <div className="mb-6">
                    <div className="relative">
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                <Input
                                    type="search"
                                    placeholder="Search users by name or email..."
                                    className="pl-10 pr-10"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    disabled={isSearching}
                                />
                                {searchTerm && (
                                    <button
                                        type="button"
                                        onClick={handleClearSearch}
                                        className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
                                        disabled={isSearching}
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                                {isSearching && (
                                    <div className="absolute top-1/2 right-3 -translate-y-1/2 transform">
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                Showing {users.from} to {users.to} of {users.total}{' '}
                                users
                                {searchTerm && (
                                    <span className="ml-2 text-blue-600">
                                        (filtered)
                                    </span>
                                )}
                            </div>
                            {isSearching && (
                                <div className="text-sm text-gray-500">
                                    Searching...
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Created At
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Updated At
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                            {users.data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-6 py-12 text-center text-gray-500"
                                    >
                                        {isSearching ? (
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 mb-2" />
                                                <p>Searching users...</p>
                                            </div>
                                        ) : searchTerm ? (
                                            <div className="flex flex-col items-center justify-center">
                                                <Search className="mb-2 h-8 w-8 text-gray-400" />
                                                <p>No users found for "{searchTerm}"</p>
                                                <p className="mt-1 text-sm text-gray-400">
                                                    Try a different search term
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center">
                                                <Plus className="mb-2 h-8 w-8 text-gray-400" />
                                                <p>No users found</p>
                                                <p className="mt-1 text-sm text-gray-400">
                                                    Get started by adding your first user
                                                </p>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ) : (
                                users.data.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {user.id}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {user.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">
                                                {user.email}
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="text-sm text-gray-900">
                                                {formatDate(
                                                    user.created_at,
                                                )}
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="text-sm text-gray-900">
                                                {formatDate(
                                                    user.updated_at,
                                                )}
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger
                                                    asChild
                                                >
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0"
                                                    >
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            openEditDialog(
                                                                user,
                                                            )
                                                        }
                                                    >
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-red-600"
                                                        onClick={() =>
                                                            openDeleteDialog(
                                                                user,
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                {users.last_page > 1 && (
                    <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
                        <div className="text-sm text-gray-700">
                            Page {users.current_page} of {users.last_page}
                        </div>
                        <div className="flex items-center gap-1">
                            {/* Previous Page */}
                            {users.prev_page_url && (
                                <Link
                                    href={users.prev_page_url}
                                    className="inline-flex items-center rounded-l-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    preserveScroll
                                >
                                    <ChevronLeft className="mr-1 h-4 w-4" />
                                    Previous
                                </Link>
                            )}

                            {/* Page Numbers */}
                            <div className="flex items-center">
                                {users.links.slice(1, -1).map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        preserveScroll
                                        className={`border border-gray-300 px-3 py-2 text-sm font-medium ${
                                            index === 0 ? 'rounded-l-md' : ''
                                        } ${
                                            index ===
                                            users.links.slice(1, -1).length - 1
                                                ? 'rounded-r-md'
                                                : ''
                                        } ${
                                            link.active
                                                ? 'relative z-10 border-blue-500 bg-blue-50 text-blue-600'
                                                : 'bg-white text-gray-500 hover:bg-gray-50'
                                        }`}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>

                            {/* Next Page */}
                            {users.next_page_url && (
                                <Link
                                    href={users.next_page_url}
                                    className="inline-flex items-center rounded-r-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    preserveScroll
                                >
                                    Next
                                    <ChevronRight className="ml-1 h-4 w-4" />
                                </Link>
                            )}
                        </div>
                    </div>
                )}

                {/* Edit Dialog */}
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit User</DialogTitle>
                            <DialogDescription>
                                Update user information.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleEdit}>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-name">Full Name</Label>
                                    <Input
                                        id="edit-name"
                                        value={editData.name}
                                        onChange={(e) =>
                                            setEditData('name', e.target.value)
                                        }
                                        required
                                    />
                                    {editErrors.name && (
                                        <p className="text-sm text-red-500">
                                            {editErrors.name}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-email">
                                        Email Address
                                    </Label>
                                    <Input
                                        id="edit-email"
                                        type="email"
                                        value={editData.email}
                                        onChange={(e) =>
                                            setEditData('email', e.target.value)
                                        }
                                        required
                                    />
                                    {editErrors.email && (
                                        <p className="text-sm text-red-500">
                                            {editErrors.email}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <DialogFooter className="mt-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsEditOpen(false)}
                                    disabled={updating}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={updating}>
                                    {updating ? 'Updating...' : 'Update User'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="text-red-600">
                                Delete User
                            </DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete this user? This
                                action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        {selectedUser && (
                            <div className="space-y-3">
                                <div className="rounded-lg bg-red-50 p-4">
                                    <div className="font-medium text-gray-900">
                                        {selectedUser.name}
                                    </div>
                                    <div className="mt-1 text-sm text-gray-600">
                                        {selectedUser.email}
                                    </div>
                                    <div className="mt-2 text-xs text-gray-500">
                                        ID: {selectedUser.id} • Created:{' '}
                                        {formatDate(selectedUser.created_at)}
                                    </div>
                                </div>
                            </div>
                        )}
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsDeleteOpen(false)}
                                disabled={deleting}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={handleDelete}
                                disabled={deleting}
                            >
                                {deleting ? 'Deleting...' : 'Delete User'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
