import React, { ChangeEvent, FormEvent, useState } from 'react';
import { router, useForm } from '@inertiajs/react';

import CompanyLayout from '@/pages/companies/company/company-layout';
import type { Company, Owner, OwnerFormData, Sponsor } from './types';
import type { CompanyFormData } from '@/pages/companies/company/types';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

import {
    BarChart,
    Building,
    Edit,
    Info,
    Mail,
    MapPin,
    Percent,
    Phone,
    Plus,
    Target,
    TrendingUp,
    Trash2,
    Users,
} from 'lucide-react';

interface ShowProps {
    company: Company;
    sponsors: Sponsor[];
}

const statusOptions = ['active', 'inactive', 'terminated'] as const;
const notarizationOptions = ['pending', 'done', 'rejected'] as const;
const levelOptions = [
    'educate',
    'empowerment',
    'enterprise',
    'exponential',
] as const;
const salesActivityOptions = ['generating', 'testing', 'inactive'] as const;

export default function DetailTab({ company, sponsors }: ShowProps) {
    const [isEditingCompany, setIsEditingCompany] = useState(false);
    const [isOwnerDialogOpen, setIsOwnerDialogOpen] = useState(false);
    const [editingOwner, setEditingOwner] = useState<Owner | null>(null);
    const [ownerErrors, setOwnerErrors] = useState<Record<string, string>>({});
    const [isSubmittingOwner, setIsSubmittingOwner] = useState(false);

    // -----------------------------
    // Company form (Inertia useForm)
    // -----------------------------
    const {
        data: companyFormData,
        setData: setCompanyFormData,
        put: updateCompany,
        processing: companyProcessing,
        errors: companyErrors,
        reset: resetCompanyToInitial,
    } = useForm<CompanyFormData>({
        name: company.name || '',
        email: company.email || '',
        phone: company.phone || '',
        address: company.address || '',
        status: company.status || '',
        sponsor_id:
            company.sponsor?.id?.toString() ||
            company.sponsor_id?.toString() ||
            '',
        notarization_status: company.notarization_status || '',
        erp_status: company.erp_status || '',
        sales_activity: company.sales_activity || '',
        level: company.level || '',
    });

    const onCompanyInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCompanyFormData(name as keyof CompanyFormData, value);
    };

    const onCompanySelectChange = (
        name: keyof CompanyFormData,
        value: string,
    ) => {
        setCompanyFormData(name, value);
    };

    const handleCompanySubmit = (e: FormEvent) => {
        e.preventDefault();
        updateCompany(`/companies/${company.id}/details`, {
            preserveScroll: true,
            onSuccess: () => setIsEditingCompany(false),
        });
    };

    const resetCompanyForm = () => {
        resetCompanyToInitial();
        setIsEditingCompany(false);
    };

    // -----------------------------
    // Owner form (local state)
    // -----------------------------
    const [ownerFormData, setOwnerFormData] = useState<OwnerFormData>({
        name: '',
        email: '',
        phone: '',
        facebook: '',
        address: '',
        birthdate: '',
    });

    const handleOwnerInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setOwnerFormData((prev) => ({ ...prev, [name]: value }));
    };

    const resetOwnerForm = () => {
        setOwnerFormData({
            name: '',
            email: '',
            phone: '',
            facebook: '',
            address: '',
            birthdate: '',
        });
        setEditingOwner(null);
        setOwnerErrors({});
    };

    const openAddOwnerDialog = () => {
        resetOwnerForm();
        setIsOwnerDialogOpen(true);
    };

    const startEditingOwner = (owner: Owner) => {
        setEditingOwner(owner);
        setOwnerFormData({
            name: owner.name || '',
            email: owner.email || '',
            phone: owner.phone || '',
            facebook: owner.facebook || '',
            address: owner.address || '',
            birthdate: owner.birthdate || '',
        });
        setOwnerErrors({});
        setIsOwnerDialogOpen(true);
    };

    const handleOwnerSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmittingOwner(true);
        setOwnerErrors({});

        const ownerData = {
            name: ownerFormData.name.trim(),
            email: ownerFormData.email.trim(),
            phone: ownerFormData.phone?.trim() || null,
            facebook: ownerFormData.facebook?.trim() || null,
            address: ownerFormData.address?.trim() || null,
            birthdate: ownerFormData.birthdate || null,
        };

        console.log('Submitting owner data:', ownerData);
        console.log(
            'URL:',
            editingOwner
                ? `/owners/${editingOwner.id}`
                : `/companies/${company.id}/owners`,
        );

        try {
            if (editingOwner) {
                await router.put(`/owners/${editingOwner.id}`, ownerData, {
                    preserveScroll: true,
                    onError: (errors) => {
                        console.error('Update errors:', errors);
                        setOwnerErrors(errors);
                    },
                });
            } else {
                await router.post(
                    `/companies/${company.id}/owners`,
                    ownerData,
                    {
                        preserveScroll: true,
                        onError: (errors) => {
                            console.error('Create errors:', errors);
                            setOwnerErrors(errors);
                        },
                    },
                );
            }

            // Only close if no errors
            if (Object.keys(ownerErrors).length === 0) {
                setIsOwnerDialogOpen(false);
                resetOwnerForm();
            }
        } catch (error: any) {
            console.error('Owner operation failed:', error);
            if (error.response?.data?.errors) {
                setOwnerErrors(error.response.data.errors);
            } else {
                alert(
                    editingOwner
                        ? 'Failed to update owner'
                        : 'Failed to add owner',
                );
            }
        } finally {
            setIsSubmittingOwner(false);
        }
    };

    const handleDeleteOwner = (ownerId: number) => {
        if (!confirm('Are you sure you want to delete this owner?')) return;
        router.delete(`/owners/${ownerId}`, { preserveScroll: true });
    };

    // -----------------------------
    // Helpers
    // -----------------------------
    const getInitials = (name: string) =>
        name
            .split(' ')
            .filter(Boolean)
            .map((w) => w[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);

    const getStatusColor = (status?: string | null) => {
        if (!status) return 'bg-gray-100 text-gray-800';
        const s = status.toLowerCase();

        if (['active', 'completed', 'done', 'approved'].includes(s)) {
            return 'bg-green-100 text-green-800';
        }
        if (['pending', 'in_progress', 'processing'].includes(s)) {
            return 'bg-yellow-100 text-yellow-800';
        }
        if (['inactive', 'failed', 'terminated', 'rejected'].includes(s)) {
            return 'bg-red-100 text-red-800';
        }
        return 'bg-gray-100 text-gray-800';
    };

    const formatStatus = (status?: string | null) => {
        if (!status) return 'N/A';
        return (
            status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')
        );
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        try {
            const d = new Date(dateString);
            const month = d.toLocaleString('default', { month: 'short' });
            return `${month} ${d.getDate()}, ${d.getFullYear()}`;
        } catch {
            return 'N/A';
        }
    };

    const checklistPercentage = company?.checklist_percentage ?? 0;

    return (
        <CompanyLayout company={company} title={`${company.name} - Details`}>
            <form onSubmit={handleCompanySubmit}>
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Company Overview
                        </h3>

                        <div className="flex gap-2">
                            {!isEditingCompany ? (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsEditingCompany(true)}
                                >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Company
                                </Button>
                            ) : (
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={resetCompanyForm}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        size="sm"
                                        disabled={companyProcessing}
                                    >
                                        {companyProcessing
                                            ? 'Saving...'
                                            : 'Save Changes'}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Logo + Name */}
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 flex-shrink-0">
                            {company.logo_url || company.logo ? (
                                <img
                                    src={
                                        company.logo_url ||
                                        `/storage/${company.logo}`
                                    }
                                    alt={company.name}
                                    className="h-16 w-16 rounded-lg border object-cover"
                                />
                            ) : (
                                <div className="flex h-16 w-16 items-center justify-center rounded-lg border bg-gradient-to-br from-blue-50 to-indigo-50">
                                    <span className="text-xl font-bold text-blue-600">
                                        {getInitials(company.name)}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="flex-1">
                            {isEditingCompany ? (
                                <div className="space-y-2">
                                    <Input
                                        name="name"
                                        value={companyFormData.name}
                                        onChange={onCompanyInputChange}
                                        className="text-xl font-semibold"
                                        placeholder="Company Name"
                                    />
                                    {companyErrors.name && (
                                        <p className="text-sm text-red-500">
                                            {companyErrors.name}
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {company.name}
                                </h2>
                            )}
                        </div>
                    </div>

                    {/* Contact grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <CompanyContactField
                            icon={
                                <Mail className="h-3.5 w-3.5 text-gray-400" />
                            }
                            label="Email"
                            isEditing={isEditingCompany}
                            name="email"
                            value={companyFormData.email}
                            error={companyErrors.email}
                            onChange={onCompanyInputChange}
                            displayValue={company.email || 'N/A'}
                        />

                        <CompanyContactField
                            icon={
                                <Phone className="h-3.5 w-3.5 text-gray-400" />
                            }
                            label="Phone"
                            isEditing={isEditingCompany}
                            name="phone"
                            value={companyFormData.phone}
                            error={companyErrors.phone}
                            onChange={onCompanyInputChange}
                            displayValue={company.phone || 'N/A'}
                        />

                        <CompanyContactField
                            icon={
                                <MapPin className="h-3.5 w-3.5 text-gray-400" />
                            }
                            label="Address"
                            isEditing={isEditingCompany}
                            name="address"
                            value={companyFormData.address}
                            error={companyErrors.address}
                            onChange={onCompanyInputChange}
                            displayValue={company.address || 'N/A'}
                        />

                        {/* Sponsor */}
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <Users className="h-3.5 w-3.5 text-gray-400" />
                                <span className="text-xs font-medium text-gray-600">
                                    Sponsor
                                </span>
                            </div>

                            {isEditingCompany ? (
                                <div className="space-y-1">
                                    <Select
                                        value={
                                            companyFormData.sponsor_id?.toString() ||
                                            'none'
                                        }
                                        onValueChange={(value) =>
                                            onCompanySelectChange(
                                                'sponsor_id',
                                                value === 'none' ? '' : value,
                                            )
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select sponsor" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">
                                                No Sponsor
                                            </SelectItem>
                                            {sponsors.map((sponsor) => (
                                                <SelectItem
                                                    key={sponsor.id}
                                                    value={sponsor.id.toString()}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span>
                                                            {sponsor.name}
                                                        </span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    {companyErrors.sponsor_id && (
                                        <p className="text-xs text-red-500">
                                            {companyErrors.sponsor_id}
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <p className="text-sm text-gray-900">
                                        {company.sponsor?.name || 'No Sponsor'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Status grid */}
                    <div className="rounded-lg border border-gray-200 bg-white p-4">
                        <h3 className="mb-3 text-xs font-semibold text-gray-900">
                            Status Overview
                        </h3>

                        <div className="grid grid-cols-3 gap-4">
                            <StatusField
                                icon={
                                    <Info className="h-3.5 w-3.5 text-gray-400" />
                                }
                                label="Status"
                                isEditing={isEditingCompany}
                                value={companyFormData.status}
                                options={[...statusOptions]}
                                onSelectChange={(value) =>
                                    onCompanySelectChange('status', value)
                                }
                                displayValue={company.status}
                                getStatusColor={getStatusColor}
                                formatStatus={formatStatus}
                            />

                            <StatusField
                                icon={
                                    <Target className="h-3.5 w-3.5 text-gray-400" />
                                }
                                label="Notarization"
                                isEditing={isEditingCompany}
                                value={companyFormData.notarization_status}
                                options={[...notarizationOptions]}
                                onSelectChange={(value) =>
                                    onCompanySelectChange(
                                        'notarization_status',
                                        value,
                                    )
                                }
                                displayValue={company.notarization_status}
                                getStatusColor={getStatusColor}
                                formatStatus={formatStatus}
                            />

                            <StatusField
                                icon={
                                    <BarChart className="h-3.5 w-3.5 text-gray-400" />
                                }
                                label="ERP Status"
                                isEditing={isEditingCompany}
                                value={companyFormData.erp_status}
                                options={[...statusOptions]}
                                onSelectChange={(value) =>
                                    onCompanySelectChange('erp_status', value)
                                }
                                displayValue={company.erp_status}
                                getStatusColor={getStatusColor}
                                formatStatus={formatStatus}
                            />

                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <Percent className="h-3.5 w-3.5 text-gray-400" />
                                    <span className="text-xs font-medium text-gray-600">
                                        Onboarding Progress
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold text-blue-600">
                                        {checklistPercentage}%
                                    </span>
                                </div>
                            </div>

                            <StatusField
                                icon={
                                    <TrendingUp className="h-3.5 w-3.5 text-gray-400" />
                                }
                                label="Sales Activity"
                                isEditing={isEditingCompany}
                                value={companyFormData.sales_activity}
                                options={[...salesActivityOptions]}
                                onSelectChange={(value) =>
                                    onCompanySelectChange(
                                        'sales_activity',
                                        value,
                                    )
                                }
                                displayValue={company.sales_activity}
                                getStatusColor={getStatusColor}
                                formatStatus={formatStatus}
                            />

                            <StatusField
                                icon={
                                    <Building className="h-3.5 w-3.5 text-gray-400" />
                                }
                                label="Company Level"
                                isEditing={isEditingCompany}
                                value={companyFormData.level}
                                options={[...levelOptions]}
                                onSelectChange={(value) =>
                                    onCompanySelectChange('level', value)
                                }
                                displayValue={company.level}
                                getStatusColor={getStatusColor}
                                formatStatus={formatStatus}
                            />
                        </div>
                    </div>

                    {/* Owners */}
                    <div className="rounded-lg border border-gray-200 bg-white p-4">
                        <div className="mb-3 flex items-center justify-between">
                            <h3 className="text-xs font-semibold text-gray-900">
                                Owners
                            </h3>
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={openAddOwnerDialog}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Add Owner
                            </Button>
                        </div>

                        <OwnerDialog
                            isOpen={isOwnerDialogOpen}
                            onOpenChange={setIsOwnerDialogOpen}
                            editingOwner={editingOwner}
                            ownerFormData={ownerFormData}
                            onOwnerInputChange={handleOwnerInputChange}
                            onSubmit={handleOwnerSubmit}
                            onCancel={() => {
                                setIsOwnerDialogOpen(false);
                                resetOwnerForm();
                            }}
                            errors={ownerErrors}
                            isSubmitting={isSubmittingOwner}
                        />

                        {company.owners && company.owners.length > 0 ? (
                            <div className="space-y-2">
                                {company.owners.map((owner) => (
                                    <OwnerCard
                                        key={owner.id}
                                        owner={owner}
                                        formatDate={formatDate}
                                        onEdit={() => startEditingOwner(owner)}
                                        onDelete={() =>
                                            handleDeleteOwner(owner.id)
                                        }
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="py-4 text-center text-sm text-gray-500">
                                No owners assigned to this company
                            </div>
                        )}
                    </div>
                </div>
            </form>
        </CompanyLayout>
    );
}

// ---------------------- Subcomponents ----------------------

interface CompanyContactFieldProps {
    icon: React.ReactNode;
    label: string;
    isEditing: boolean;
    name: string;
    value: string;
    error?: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    displayValue: string;
}

function CompanyContactField({
    icon,
    label,
    isEditing,
    name,
    value,
    error,
    onChange,
    displayValue,
}: CompanyContactFieldProps) {
    return (
        <div className="space-y-1">
            <div className="flex items-center gap-2">
                {icon}
                <span className="text-sm font-medium text-gray-600">
                    {label}
                </span>
            </div>
            {isEditing ? (
                <div className="space-y-1">
                    <Input
                        name={name}
                        value={value}
                        onChange={onChange}
                        className="text-sm"
                    />
                    {error && <p className="text-xs text-red-500">{error}</p>}
                </div>
            ) : (
                <p className="text-sm text-gray-900">{displayValue}</p>
            )}
        </div>
    );
}

interface StatusFieldProps {
    icon: React.ReactNode;
    label: string;
    isEditing: boolean;
    value: string;
    options: string[];
    onSelectChange: (value: string) => void;
    displayValue?: string | null;
    getStatusColor: (status?: string | null) => string;
    formatStatus: (status?: string | null) => string;
}

function StatusField({
    icon,
    label,
    isEditing,
    value,
    options,
    onSelectChange,
    displayValue,
    getStatusColor,
    formatStatus,
}: StatusFieldProps) {
    return (
        <div className="space-y-1">
            <div className="flex items-center gap-2">
                {icon}
                <span className="text-sm font-medium text-gray-600">
                    {label}
                </span>
            </div>

            {isEditing ? (
                <Select value={value} onValueChange={onSelectChange}>
                    <SelectTrigger className="text-sm">
                        <SelectValue
                            placeholder={`Select ${label.toLowerCase()}`}
                        />
                    </SelectTrigger>
                    <SelectContent>
                        {options.map((option) => (
                            <SelectItem
                                key={option}
                                value={option}
                                className="text-sm"
                            >
                                {formatStatus(option)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            ) : (
                <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                        displayValue,
                    )}`}
                >
                    {formatStatus(displayValue)}
                </span>
            )}
        </div>
    );
}

interface OwnerDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    editingOwner: Owner | null;
    ownerFormData: OwnerFormData;
    onOwnerInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
    errors?: Record<string, string>;
    isSubmitting?: boolean;
}

function OwnerDialog({
    isOpen,
    onOpenChange,
    editingOwner,
    ownerFormData,
    onOwnerInputChange,
    onSubmit,
    onCancel,
    errors = {},
    isSubmitting = false,
}: OwnerDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {editingOwner ? 'Edit Owner' : 'Add New Owner'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="ownerName">Name *</Label>
                        <Input
                            id="ownerName"
                            name="name"
                            value={ownerFormData.name}
                            onChange={onOwnerInputChange}
                            required
                            disabled={isSubmitting}
                            className={errors.name ? 'border-red-500' : ''}
                        />
                        {errors.name && (
                            <p className="text-xs text-red-500">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="ownerEmail">Email *</Label>
                        <Input
                            id="ownerEmail"
                            name="email"
                            type="email"
                            value={ownerFormData.email}
                            onChange={onOwnerInputChange}
                            required
                            disabled={isSubmitting}
                            className={errors.email ? 'border-red-500' : ''}
                        />
                        {errors.email && (
                            <p className="text-xs text-red-500">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="ownerPhone">Phone</Label>
                        <Input
                            id="ownerPhone"
                            name="phone"
                            value={ownerFormData.phone || ''}
                            onChange={onOwnerInputChange}
                            disabled={isSubmitting}
                            className={errors.phone ? 'border-red-500' : ''}
                        />
                        {errors.phone && (
                            <p className="text-xs text-red-500">
                                {errors.phone}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="ownerFacebook">Facebook</Label>
                        <Input
                            id="ownerFacebook"
                            name="facebook"
                            value={ownerFormData.facebook || ''}
                            onChange={onOwnerInputChange}
                            disabled={isSubmitting}
                            className={errors.facebook ? 'border-red-500' : ''}
                        />
                        {errors.facebook && (
                            <p className="text-xs text-red-500">
                                {errors.facebook}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="ownerAddress">Address</Label>
                        <Input
                            id="ownerAddress"
                            name="address"
                            value={ownerFormData.address || ''}
                            onChange={onOwnerInputChange}
                            disabled={isSubmitting}
                            className={errors.address ? 'border-red-500' : ''}
                        />
                        {errors.address && (
                            <p className="text-xs text-red-500">
                                {errors.address}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="ownerBirthdate">Birthdate</Label>
                        <Input
                            id="ownerBirthdate"
                            name="birthdate"
                            type="date"
                            value={ownerFormData.birthdate || ''}
                            onChange={onOwnerInputChange}
                            disabled={isSubmitting}
                            className={errors.birthdate ? 'border-red-500' : ''}
                        />
                        {errors.birthdate && (
                            <p className="text-xs text-red-500">
                                {errors.birthdate}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting
                                ? editingOwner
                                    ? 'Updating...'
                                    : 'Adding...'
                                : editingOwner
                                  ? 'Update Owner'
                                  : 'Add Owner'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

interface OwnerCardProps {
    owner: Owner;
    formatDate: (date?: string) => string;
    onEdit: () => void;
    onDelete: () => void;
}

function OwnerCard({ owner, formatDate, onEdit, onDelete }: OwnerCardProps) {
    return (
        <div className="rounded-lg border border-gray-200 p-3 hover:bg-gray-50">
            <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col">
                    <span className="text-xs font-medium text-gray-600">
                        Name
                    </span>
                    <p className="truncate text-sm font-medium text-gray-900">
                        {owner.name}
                    </p>
                </div>

                <div className="flex flex-col">
                    <span className="text-xs font-medium text-gray-600">
                        Facebook
                    </span>
                    <p className="truncate text-sm text-gray-900">
                        {owner.facebook || 'N/A'}
                    </p>
                </div>

                <div className="flex flex-col">
                    <span className="text-xs font-medium text-gray-600">
                        Email
                    </span>
                    <p className="truncate text-sm text-gray-900">
                        {owner.email}
                    </p>
                </div>

                <div className="flex flex-col">
                    <span className="text-xs font-medium text-gray-600">
                        Phone
                    </span>
                    <p className="truncate text-sm text-gray-900">
                        {owner.phone || 'N/A'}
                    </p>
                </div>

                <div className="flex flex-col">
                    <span className="text-xs font-medium text-gray-600">
                        Address
                    </span>
                    <p className="truncate text-sm text-gray-900">
                        {owner.address || 'N/A'}
                    </p>
                </div>

                <div className="flex flex-col">
                    <span className="text-xs font-medium text-gray-600">
                        Birthdate
                    </span>
                    <p className="truncate text-sm text-gray-900">
                        {formatDate(owner.birthdate)}
                    </p>
                </div>
            </div>

            <div className="mt-3 flex justify-end gap-2 border-t pt-3">
                <Button size="sm" variant="outline" onClick={onEdit}>
                    <Edit className="mr-2 h-3 w-3" />
                    Edit
                </Button>
                <Button size="sm" variant="destructive" onClick={onDelete}>
                    <Trash2 className="mr-2 h-3 w-3" />
                    Delete
                </Button>
            </div>
        </div>
    );
}
