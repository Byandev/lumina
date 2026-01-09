import React, { ChangeEvent, FormEvent, useMemo, useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import Select, { type SingleValue, type StylesConfig } from 'react-select';

import CompanyLayout from '@/pages/companies/company/company-layout';
import type { CompanyFormData as BaseCompanyFormData } from '@/pages/companies/company/types';
import type { Company, Owner, OwnerFormData, Sponsor, Coach } from './types';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';

import {
    BarChart,
    Building,
    Calendar,
    Camera,
    Check,
    CheckCircle,
    ChevronRight,
    Edit,
    Facebook,
    FileImage,
    FileText,
    IdCard,
    Info,
    Loader2,
    Mail,
    MapPin,
    Percent,
    Phone,
    Plus,
    Target,
    Trash2,
    TrendingUp,
    Upload,
    User,
    Users,
    X,
} from 'lucide-react';

import InputError from '@/components/input-error';

interface ShowProps {
    company: Company;
    sponsors: Sponsor[];
    coaches: Coach[];
}

const statusOptions = ['active', 'inactive', 'terminated'] as const;
const notarizationOptions = ['pending', 'done', 'rejected'] as const;
const levelOptions = ['educate', 'empowerment', 'enterprise', 'exponential'] as const;
const salesActivityOptions = ['generating', 'testing', 'inactive'] as const;

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_FILE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'application/pdf',
] as const;

type AllowedFileType = (typeof ALLOWED_FILE_TYPES)[number];

interface SelectOption {
    value: string;
    label: string;
    photo?: string | null;
    photo_url?: string | null;
    specialization?: string | null;
}

const flatSelectStyles: StylesConfig<SelectOption, false> = {
    control: (base, state) => ({
        ...base,
        backgroundColor: '#ffffff',
        borderColor: state.isFocused ? '#8b5cf6' : '#e5e7eb',
        borderWidth: 1,
        boxShadow: 'none',
        minHeight: 36,
        borderRadius: 6,
        ':hover': { borderColor: state.isFocused ? '#8b5cf6' : '#9ca3af' },
    }),
    option: (base, state) => ({
        ...base,
        backgroundColor: state.isSelected ? '#8b5cf6' : state.isFocused ? '#f8fafc' : '#ffffff',
        color: state.isSelected ? '#ffffff' : '#374151',
        ':active': { backgroundColor: '#7c3aed', color: '#ffffff' },
    }),
    singleValue: (base) => ({ ...base, color: '#374151' }),
};

type CompanyFormData = BaseCompanyFormData & {
    sponsor_id: string;
    coach_id: string;
    logo: File | null;
    _method: 'PUT';
};

type OwnerFormDataLocal = OwnerFormData & {
    photo: File | null;
    proof_id: File | null;
    _method: 'POST' | 'PUT';
};

const errorClass = (hasError?: boolean) =>
    hasError ? 'border-rose-300 focus-visible:ring-rose-200' : '';

export default function DetailTab({ company, sponsors, coaches }: ShowProps) {
    const [isEditingCompany, setIsEditingCompany] = useState(false);

    const [isOwnerDialogOpen, setIsOwnerDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const [ownerToDelete, setOwnerToDelete] = useState<Owner | null>(null);
    const [editingOwner, setEditingOwner] = useState<Owner | null>(null);

    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [ownerPhotoFile, setOwnerPhotoFile] = useState<File | null>(null);
    const [ownerProofIdFile, setOwnerProofIdFile] = useState<File | null>(null);

    const coachOptions: SelectOption[] = useMemo(
        () =>
            coaches.map((coach) => ({
                value: String(coach.id),
                label: coach.name,
                photo: (coach as any).photo_url ?? (coach as any).photo ?? null,
                specialization: (coach as any).specialization ?? null,
            })),
        [coaches],
    );

    const sponsorOptions: SelectOption[] = useMemo(
        () =>
            sponsors.map((sponsor) => ({
                value: String(sponsor.id),
                label: sponsor.name,
            })),
        [sponsors],
    );

    const sponsorOptionsWithNone: SelectOption[] = useMemo(
        () => [{ value: '', label: 'No Sponsor' }, ...sponsorOptions],
        [sponsorOptions],
    );

    const getSelectedCoach = (): SelectOption | null => {
        if (!company?.coach) return null;
        return {
            value: String(company.coach.id),
            label: company.coach.name,
            photo: (company.coach as any).photo_url ?? (company.coach as any).photo ?? null,
            specialization: (company.coach as any).specialization ?? null,
        };
    };

    const getSelectedSponsor = (): SelectOption => {
        const sponsorId =
            (company?.sponsor?.id != null ? String(company.sponsor.id) : null) ??
            (company as any)?.sponsor_id?.toString?.() ??
            '';

        if (!sponsorId) return { value: '', label: 'No Sponsor' };

        const sponsor = sponsors.find((s) => String(s.id) === sponsorId);
        return sponsor
            ? { value: String(sponsor.id), label: sponsor.name }
            : { value: '', label: 'No Sponsor' };
    };

    const [selectedCoach, setSelectedCoach] = useState<SelectOption | null>(getSelectedCoach());
    const [selectedSponsor, setSelectedSponsor] = useState<SelectOption>(getSelectedSponsor());

    const {
        data: companyFormData,
        setData: setCompanyFormData,
        post: submitCompanyForm,
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
            (company?.sponsor?.id != null ? String(company.sponsor.id) : '') ||
            ((company as any)?.sponsor_id?.toString?.() ?? ''),
        coach_id: company?.coach?.id != null ? String(company.coach.id) : '',
        notarization_status: company.notarization_status || '',
        erp_status: company.erp_status || '',
        sales_activity: company.sales_activity || '',
        level: company.level || '',
        logo: null,
        _method: 'PUT',
    });

    const onCompanyInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCompanyFormData(name as keyof CompanyFormData, value as any);
    };

    const handleCoachChange = (selectedOption: SingleValue<SelectOption>) => {
        setSelectedCoach(selectedOption ?? null);
        setCompanyFormData('coach_id', selectedOption?.value ?? '');
    };

    const handleSponsorChange = (selectedOption: SingleValue<SelectOption>) => {
        const opt = selectedOption ?? { value: '', label: 'No Sponsor' };
        setSelectedSponsor(opt);
        setCompanyFormData('sponsor_id', opt.value);
    };

    const validateFile = (file: File) => {
        if (!ALLOWED_FILE_TYPES.includes(file.type as AllowedFileType)) {
            return 'Please upload a valid image (JPEG, PNG, GIF) or PDF.';
        }
        if (file.size > MAX_FILE_SIZE) {
            return 'File size must be less than 5MB.';
        }
        return null;
    };

    const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const err = validateFile(file);
        if (err) return alert(err);

        setLogoFile(file);
        setCompanyFormData('logo', file);
    };

    const removeLogo = () => {
        setLogoFile(null);
        setCompanyFormData('logo', null);
    };

    const handleCompanySubmit = (e?: FormEvent | React.MouseEvent) => {
        e?.preventDefault?.();

        submitCompanyForm(`/companies/${company.id}/details`, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                setIsEditingCompany(false);
                setLogoFile(null);
            },
        });
    };

    const resetCompanyForm = () => {
        resetCompanyToInitial();
        setIsEditingCompany(false);
        setLogoFile(null);
        setSelectedCoach(getSelectedCoach());
        setSelectedSponsor(getSelectedSponsor());
    };

    const {
        data: ownerFormData,
        setData: setOwnerFormData,
        post: submitOwnerForm,
        processing: ownerProcessing,
        errors: ownerErrors,
        reset: resetOwnerForm,
        clearErrors: clearOwnerErrors,
        setError: setOwnerError,
    } = useForm<OwnerFormDataLocal>({
        name: '',
        email: '',
        phone: '',
        facebook: '',
        address: '',
        birthdate: '',
        photo: null,
        proof_id: null,
        _method: 'POST',
    });

    const handleOwnerInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setOwnerFormData(name as keyof OwnerFormDataLocal, value as any);
    };

    const handleOwnerPhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
        clearOwnerErrors('photo');

        const file = e.target.files?.[0];
        if (!file) return;

        const err = validateFile(file);
        if (err) {
            setOwnerError('photo', err);
            return;
        }

        setOwnerPhotoFile(file);
        setOwnerFormData('photo', file);
    };

    const handleOwnerProofIdChange = (e: ChangeEvent<HTMLInputElement>) => {
        clearOwnerErrors('proof_id');

        const file = e.target.files?.[0];
        if (!file) return;

        const err = validateFile(file);
        if (err) {
            setOwnerError('proof_id', err);
            return;
        }

        setOwnerProofIdFile(file);
        setOwnerFormData('proof_id', file);
    };

    const removeOwnerPhoto = () => {
        setOwnerPhotoFile(null);
        setOwnerFormData('photo', null);
        clearOwnerErrors('photo');
    };

    const removeOwnerProofId = () => {
        setOwnerProofIdFile(null);
        setOwnerFormData('proof_id', null);
        clearOwnerErrors('proof_id');
    };

    const openAddOwnerDialog = () => {
        resetOwnerForm();
        clearOwnerErrors();
        setOwnerPhotoFile(null);
        setOwnerProofIdFile(null);
        setEditingOwner(null);
        setOwnerFormData('_method', 'POST');
        setIsOwnerDialogOpen(true);
    };

    const startEditingOwner = (owner: Owner) => {
        clearOwnerErrors();
        setEditingOwner(owner);
        setOwnerFormData({
            name: owner.name || '',
            email: owner.email || '',
            phone: owner.phone || '',
            facebook: (owner as any).facebook || '',
            address: owner.address || '',
            birthdate: owner.birthdate || '',
            photo: null,
            proof_id: null,
            _method: 'PUT',
        });
        setOwnerPhotoFile(null);
        setOwnerProofIdFile(null);
        setIsOwnerDialogOpen(true);
    };

    const handleOwnerSubmit = (e: FormEvent) => {
        e.preventDefault();

        const url = editingOwner
            ? `/companies/${company.id}/owners/${editingOwner.id}`
            : `/companies/${company.id}/owners`;

        submitOwnerForm(url, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                setIsOwnerDialogOpen(false);
                resetOwnerForm();
                clearOwnerErrors();
                setOwnerPhotoFile(null);
                setOwnerProofIdFile(null);
                setEditingOwner(null);
            },
        });
    };

    const handleDeleteOwner = (owner: Owner) => {
        setOwnerToDelete(owner);
        setIsDeleteDialogOpen(true);
    };

    const confirmDeleteOwner = () => {
        if (!ownerToDelete) return;

        router.delete(`/companies/${company.id}/owners/${ownerToDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setIsDeleteDialogOpen(false);
                setOwnerToDelete(null);
            },
        });
    };

    const handleCancelOwner = () => {
        setIsOwnerDialogOpen(false);
        resetOwnerForm();
        clearOwnerErrors();
        setOwnerPhotoFile(null);
        setOwnerProofIdFile(null);
        setEditingOwner(null);
    };

    const getInitials = (name: string) =>
        name
            .split(' ')
            .filter(Boolean)
            .map((w) => w[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        const d = new Date(dateString);
        if (Number.isNaN(d.getTime())) return 'N/A';
        const month = d.toLocaleString('default', { month: 'short' });
        return `${month} ${d.getDate()}, ${d.getFullYear()}`;
    };

    const formatFileSize = (bytes: number) => {
        if (!bytes) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'] as const;
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
    };

    const getFileUrl = (path?: string | null) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return `/storage/${path}`;
    };

    const checklistPercentage = company?.checklist_percentage ?? 0;

    return (
        <CompanyLayout company={company} title={`${company.name} - Details`}>
            <div className="space-y-2 md:space-y-4 lg:space-y-6">
                <div className="rounded-xl border border-gray-200 bg-white p-2 md:p-4 lg:p-6">
                    <div className="mb-4 flex flex-row items-center justify-between border-b border-gray-200 pb-2">
                        <p className="text-sm font-semibold text-gray-900">Company Information</p>

                        <div className="flex items-center gap-2">
                            {!isEditingCompany ? (
                                <button
                                    type="button"
                                    onClick={() => setIsEditingCompany(true)}
                                    className="inline-flex items-center gap-1.5 rounded-lg "
                                >
                                    <Edit className="h-4 w-4" />
                                    Edit
                                </button>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={resetCompanyForm}
                                        className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="button"
                                        onClick={(e) => handleCompanySubmit(e)}
                                        disabled={companyProcessing}
                                        className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {companyProcessing ? 'Saving…' : 'Save Changes'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="flex items-start gap-4">
                            <div className="relative">
                                {company.logo ? (
                                    <div className="relative">
                                        <img
                                            src={company.logo_url}
                                            alt={company.name}
                                            className="h-16 w-16 rounded-xl object-cover ring-2 ring-white"
                                        />
                                        {isEditingCompany && (
                                            <button
                                                type="button"
                                                onClick={removeLogo}
                                                className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-white"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 via-violet-500 to-cyan-500">
                                        <span className="text-xl font-bold text-white">{getInitials(company.name)}</span>
                                    </div>
                                )}
                            </div>

                            <div className="min-w-0">
                                {isEditingCompany ? (
                                    <div className="space-y-2">
                                        <Input
                                            name="name"
                                            value={companyFormData.name}
                                            onChange={onCompanyInputChange}
                                            className={`border-none bg-transparent px-0 text-xl font-semibold ${errorClass(
                                                !!companyErrors.name,
                                            )}`}
                                            placeholder="Company Name"
                                        />
                                        <InputError message={companyErrors.name as any} />

                                        <div className="pt-2">
                                            <Label className="mb-2 block text-sm text-gray-500">Logo</Label>
                                            <div className="flex items-center gap-3">
                                                <Input
                                                    type="file"
                                                    accept="image/*,.pdf"
                                                    onChange={handleLogoUpload}
                                                    className="text-sm"
                                                />
                                                {logoFile && <span className="text-xs text-gray-500">{logoFile.name}</span>}
                                            </div>
                                            <InputError message={companyErrors.logo as any} />
                                        </div>
                                    </div>
                                ) : (
                                    <h2 className="truncate text-xl font-semibold text-gray-900">{company.name}</h2>
                                )}
                            </div>
                        </div>

                        <div className="rounded-xl bg-white p-6">
                            <div className="flex items-center gap-6">
                                <div className="min-w-0 flex-1">
                                    {isEditingCompany ? (
                                        <div className="space-y-2">
                                            <Select
                                                value={selectedCoach}
                                                onChange={handleCoachChange}
                                                options={coachOptions}
                                                styles={flatSelectStyles}
                                                classNamePrefix="react-select"
                                                placeholder="Search coaches..."
                                                isClearable
                                                formatOptionLabel={(option) => (
                                                    <div className="flex items-center gap-3 py-1">
                                                        {option.photo ? (
                                                            <img
                                                                src={option?.photo_url}
                                                                alt={option.label}
                                                                className="h-8 w-8 rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-pink-100 to-violet-100">
                                                                <User className="h-4 w-4 text-violet-600" />
                                                            </div>
                                                        )}

                                                    </div>
                                                )}
                                            />
                                            <InputError message={companyErrors.coach_id as any} />
                                        </div>
                                    ) : company.coach ? (
                                        <div className="flex items-center gap-4">
                                            {(company.coach as any).photo_url || (company.coach as any).photo ? (
                                                <img
                                                    src={company.coach.photo_url}
                                                    alt={company.coach.name}
                                                    className="h-12 w-12 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-pink-100 to-violet-100">
                                                    <User className="h-6 w-6 text-violet-600" />
                                                </div>
                                            )}
                                            <div className="min-w-0">
                                                <div className="truncate font-semibold text-gray-900">{company.coach.name}</div>
                                                {(company.coach as any).specialization && (
                                                    <div className="truncate text-sm text-gray-500">
                                                        {(company.coach as any).specialization}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className=" flex text-center">
                                            <p className="text-sm text-gray-500">No coach assigned</p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex min-w-[180px] flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                        <p className="text-gray-400">Assigned Coach</p>
                                    </div>
                                    {isEditingCompany && <span className="text-xs text-gray-500">Select a coach</span>}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-6 grid grid-cols-2 gap-4">
                        <DetailItem
                            icon={<Mail className="h-4 w-4 text-pink-500" />}
                            label="Email"
                            value={company.email || 'N/A'}
                            isEditing={isEditingCompany}
                            editingValue={companyFormData.email}
                            name="email"
                            onChange={onCompanyInputChange}
                            error={companyErrors.email as any}
                        />

                        <DetailItem
                            icon={<Phone className="h-4 w-4 text-violet-500" />}
                            label="Phone"
                            value={company.phone || 'N/A'}
                            isEditing={isEditingCompany}
                            editingValue={companyFormData.phone}
                            name="phone"
                            onChange={onCompanyInputChange}
                            error={companyErrors.phone as any}
                        />

                        <DetailItem
                            icon={<MapPin className="h-4 w-4 text-cyan-500" />}
                            label="Address"
                            value={company.address || 'N/A'}
                            isEditing={isEditingCompany}
                            editingValue={companyFormData.address}
                            name="address"
                            onChange={onCompanyInputChange}
                            error={companyErrors.address as any}
                        />

                        <DetailItem
                            icon={<Users className="h-4 w-4 text-purple-500" />}
                            label="Sponsor"
                            value={company.sponsor?.name || 'No Sponsor'}
                            isEditing={isEditingCompany}
                            isSelect
                            selectValue={selectedSponsor}
                            selectOptions={sponsorOptionsWithNone}
                            onSelectChange={handleSponsorChange}
                            error={companyErrors.sponsor_id as any}
                        />
                    </div>

                    <div className="border-b" />

                    <div className="rounded-xl p-4">
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                            <StatusBadge
                                icon={<Info className="h-4 w-4" />}
                                label="Status"
                                value={company.status}
                                color="pink"
                                isEditing={isEditingCompany}
                                editingValue={companyFormData.status}
                                options={statusOptions}
                                onSelectChange={(value) => setCompanyFormData('status', value)}
                            />

                            <StatusBadge
                                icon={<Target className="h-4 w-4" />}
                                label="Notarization"
                                value={company.notarization_status}
                                color="violet"
                                isEditing={isEditingCompany}
                                editingValue={companyFormData.notarization_status}
                                options={notarizationOptions}
                                onSelectChange={(value) => setCompanyFormData('notarization_status', value)}
                            />

                            <StatusBadge
                                icon={<BarChart className="h-4 w-4" />}
                                label="ERP Status"
                                value={company.erp_status}
                                color="cyan"
                                isEditing={isEditingCompany}
                                editingValue={companyFormData.erp_status}
                                options={statusOptions}
                                onSelectChange={(value) => setCompanyFormData('erp_status', value)}
                            />

                            <div className="flex items-center gap-3 bg-blue-50">
                                <div className="flex h-10 w-10 items-center justify-center">
                                    <Percent className="h-5 w-5 text-blue-500" />
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500">Progress</div>
                                    <div className="bg-gradient-to-r from-pink-600 to-violet-600 bg-clip-text text-lg font-semibold text-transparent">
                                        {checklistPercentage}%
                                    </div>
                                </div>
                            </div>

                            <StatusBadge
                                icon={<TrendingUp className="h-4 w-4" />}
                                label="Sales Activity"
                                value={company.sales_activity}
                                color="emerald"
                                isEditing={isEditingCompany}
                                editingValue={companyFormData.sales_activity}
                                options={salesActivityOptions}
                                onSelectChange={(value) => setCompanyFormData('sales_activity', value)}
                            />

                            <StatusBadge
                                icon={<Building className="h-4 w-4" />}
                                label="Level"
                                value={company.level}
                                color="orange"
                                isEditing={isEditingCompany}
                                editingValue={companyFormData.level}
                                options={levelOptions}
                                onSelectChange={(value) => setCompanyFormData('level', value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-6">
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-pink-500" />
                            <h3 className="font-semibold text-gray-900">Company Owners</h3>
                            <span className="ml-2 rounded-full bg-pink-100 px-2 py-1 text-xs font-medium text-pink-700">
                                {company.owners?.length || 0}
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={openAddOwnerDialog}
                            className="flex cursor-pointer items-center gap-2 rounded-lg"
                        >
                            <Plus className="h-4 w-4" />
                            Add Owner
                        </button>
                    </div>

                    {company.owners && company.owners.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {company.owners.map((owner) => (
                                <OwnerCardCompact
                                    key={owner.id}
                                    owner={owner}
                                    formatDate={formatDate}
                                    getFileUrl={getFileUrl}
                                    onEdit={() => startEditingOwner(owner)}
                                    onDelete={() => handleDeleteOwner(owner)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-xl border border-dashed border-gray-200 py-12 text-center">
                            <Users className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                            <p className="mb-2 text-gray-500">No owners added yet</p>
                            <p className="mb-4 text-sm text-gray-400">Add the first owner to this company</p>
                            <button
                                type="button"
                                onClick={openAddOwnerDialog}
                                className="mx-auto flex items-center gap-2 rounded-lg bg-gradient-to-r from-pink-500 to-violet-500 px-4 py-2 text-white transition-all hover:from-pink-600 hover:to-violet-600"
                            >
                                <Plus className="h-4 w-4" />
                                Add First Owner
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Owner Dialog */}
            <Dialog open={isOwnerDialogOpen} onOpenChange={setIsOwnerDialogOpen}>
                <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                    <DialogHeader className="z-10 bg-white pb-4">
                        <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
                            {editingOwner ? (
                                <>
                                    <Edit className="h-5 w-5 text-pink-500" />
                                    Edit Owner
                                </>
                            ) : (
                                <>
                                    <Plus className="h-5 w-5 text-violet-500" />
                                    Add New Owner
                                </>
                            )}
                        </DialogTitle>
                        <DialogDescription className="text-gray-500">
                            {editingOwner ? 'Update owner information' : 'Add a new property owner to the system'}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleOwnerSubmit} className="space-y-6 pb-4">
                        <div className="space-y-6">
                            {/* Profile Photo Section */}
                            <div className="space-y-3">
                                <Label className="flex items-center gap-2 text-sm font-medium">
                                    <Camera className="h-4 w-4 text-pink-500" />
                                    Profile Photo
                                </Label>

                                <div className="flex flex-col items-start gap-4 sm:flex-row">
                                    <div className="flex-shrink-0">
                                        {ownerPhotoFile ? (
                                            <div className="relative">
                                                <img
                                                    src={URL.createObjectURL(ownerPhotoFile)}
                                                    alt="Profile preview"
                                                    className="h-28 w-28 rounded-xl border-2 border-pink-100 object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={removeOwnerPhoto}
                                                    className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-white shadow-sm transition-colors hover:bg-rose-600"
                                                    aria-label="Remove photo"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ) : (editingOwner as any)?.photo_url ? (
                                            <div className="relative">
                                                <img
                                                    src={editingOwner.photo_url}
                                                    alt={editingOwner?.name ?? 'Owner'}
                                                    className="h-28 w-28 rounded-xl border-2 border-violet-100 object-cover"
                                                />
                                                <div className="absolute right-0 bottom-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-green-500">
                                                    <Check className="h-3 w-3 text-white" />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex h-28 w-28 items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gradient-to-br from-pink-50 to-violet-50">
                                                <Upload className="h-10 w-10 text-gray-400" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <div className="mb-2">
                                            <Label htmlFor="ownerPhoto" className="mb-1 block text-sm font-medium">
                                                Upload photo
                                            </Label>
                                            <Input
                                                id="ownerPhoto"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleOwnerPhotoChange}
                                                className="w-full cursor-pointer text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-violet-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-violet-700 hover:file:bg-violet-100"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            Recommended: Square image, max 5MB. JPG, PNG.
                                        </p>
                                        <InputError message={ownerErrors.photo as any} />
                                    </div>
                                </div>
                            </div>

                            {/* Required Fields */}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="ownerName" className="flex items-center gap-1">
                                        Full Name <span className="text-rose-500">*</span>
                                    </Label>
                                    <Input
                                        id="ownerName"
                                        name="name"
                                        value={ownerFormData.name}
                                        onChange={handleOwnerInputChange}
                                        required
                                        placeholder="John Doe"
                                        className={errorClass(!!ownerErrors.name)}
                                    />
                                    <InputError message={ownerErrors.name as any} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="ownerEmail" className="flex items-center gap-1">
                                        Email Address <span className="text-rose-500">*</span>
                                    </Label>
                                    <Input
                                        id="ownerEmail"
                                        name="email"
                                        type="email"
                                        value={ownerFormData.email}
                                        onChange={handleOwnerInputChange}
                                        required
                                        placeholder="owner@example.com"
                                        className={errorClass(!!ownerErrors.email)}
                                    />
                                    <InputError message={ownerErrors.email as any} />
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="ownerPhone">Phone Number</Label>
                                    <Input
                                        id="ownerPhone"
                                        name="phone"
                                        value={ownerFormData.phone || ''}
                                        onChange={handleOwnerInputChange}
                                        placeholder="+63 9xx xxx xxxx"
                                        className={errorClass(!!ownerErrors.phone)}
                                    />
                                    <InputError message={ownerErrors.phone as any} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="ownerBirthdate">Birthdate</Label>
                                    <Input
                                        id="ownerBirthdate"
                                        name="birthdate"
                                        type="date"
                                        value={ownerFormData.birthdate || ''}
                                        onChange={handleOwnerInputChange}
                                        className={errorClass(!!ownerErrors.birthdate)}
                                    />
                                    <InputError message={ownerErrors.birthdate as any} />
                                </div>
                            </div>

                            {/* Social Media & Address */}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="ownerFacebook" className="flex items-center gap-2">
                                        <Facebook className="h-4 w-4 text-blue-600" />
                                        Facebook Profile
                                    </Label>
                                    <Input
                                        id="ownerFacebook"
                                        name="facebook"
                                        value={ownerFormData.facebook || ''}
                                        onChange={handleOwnerInputChange}
                                        placeholder="https://facebook.com/username"
                                        className={errorClass(!!ownerErrors.facebook)}
                                    />
                                    <InputError message={ownerErrors.facebook as any} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="ownerAddress">Address</Label>
                                    <Input
                                        id="ownerAddress"
                                        name="address"
                                        value={ownerFormData.address || ''}
                                        onChange={handleOwnerInputChange}
                                        placeholder="123 Main St, City, State"
                                        className={errorClass(!!ownerErrors.address)}
                                    />
                                    <InputError message={ownerErrors.address as any} />
                                </div>
                            </div>

                            {/* Identity Verification Section */}
                            <div className="space-y-3">
                                <Label className="flex items-center gap-2 text-sm font-medium">
                                    <IdCard className="h-4 w-4 text-violet-500" />
                                    Identity Verification
                                </Label>

                                <div className="space-y-3">
                                    {ownerProofIdFile ? (
                                        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start gap-3">
                                                    <FileImage className="mt-0.5 h-5 w-5 text-green-600" />
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">{ownerProofIdFile.name}</p>
                                                        <p className="mt-1 text-xs text-gray-500">
                                                            {formatFileSize(ownerProofIdFile.size)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={removeOwnerProofId}
                                                    className="text-gray-400 transition-colors hover:text-gray-600"
                                                    aria-label="Remove file"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (editingOwner as any)?.proof_id_url ? (
                                        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                                            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                                                <div className="flex items-center gap-3">
                                                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">ID Verified</p>
                                                        <p className="text-xs text-emerald-600">Document uploaded</p>
                                                    </div>
                                                </div>
                                                <a
                                                    href={getFileUrl((editingOwner as any).proof_id_url)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-blue-600 transition-colors hover:text-blue-800 hover:underline"
                                                >
                                                    View Document
                                                </a>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center transition-colors hover:border-gray-400">
                                            <FileText className="mx-auto h-10 w-10 text-gray-400" />
                                            <p className="mt-2 text-sm font-medium text-gray-700">Upload ID Proof</p>
                                            <p className="mt-1 text-xs text-gray-500">
                                                Passport, Driver&apos;s License, or National ID
                                            </p>
                                        </div>
                                    )}

                                    <div>
                                        <Label htmlFor="ownerProofId" className="mb-2 block text-sm font-medium">
                                            Upload document
                                        </Label>
                                        <Input
                                            id="ownerProofId"
                                            type="file"
                                            accept="image/*,.pdf"
                                            onChange={handleOwnerProofIdChange}
                                            className="w-full cursor-pointer text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-violet-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-violet-700 hover:file:bg-violet-100"
                                        />
                                        <p className="mt-2 text-xs text-gray-500">Accepts images and PDF files, max 5MB</p>
                                        <InputError message={ownerErrors.proof_id as any} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="bottom-0 border-t bg-white pt-4">
                            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                                <div className="text-sm text-gray-500">
                                    <span className="text-rose-500">*</span> Required fields
                                </div>

                                <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                                    <button
                                        type="button"
                                        onClick={handleCancelOwner}
                                        className="w-full rounded-lg border border-gray-300 px-5 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 sm:w-auto"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={ownerProcessing}
                                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-pink-500 to-violet-500 px-5 py-2.5 font-medium text-white shadow-sm transition-all hover:from-pink-600 hover:to-violet-600 focus:outline-none focus:ring-2 focus:ring-pink-200 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                                    >
                                        {ownerProcessing ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Processing...
                                            </>
                                        ) : editingOwner ? (
                                            <>
                                                <Edit className="h-4 w-4" />
                                                Update Owner
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="h-4 w-4" />
                                                Add Owner
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete dialog left as-is in your original file */}
            {/* ... */}
        </CompanyLayout>
    );
}

// ---------------------- Subcomponents ----------------------

interface DetailItemProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    isEditing: boolean;
    editingValue?: string;
    name?: string;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    isSelect?: boolean;
    selectValue?: SelectOption;
    selectOptions?: SelectOption[];
    onSelectChange?: (option: SingleValue<SelectOption>) => void;
}

function DetailItem({
                        icon,
                        label,
                        value,
                        isEditing,
                        editingValue,
                        name,
                        onChange,
                        error,
                        isSelect,
                        selectValue,
                        selectOptions,
                        onSelectChange,
                    }: DetailItemProps) {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                {icon}
                <span className="text-sm font-medium text-gray-500">{label}</span>
            </div>

            {isEditing ? (
                <div className="space-y-1">
                    {isSelect ? (
                        <>
                            <Select
                                value={selectValue ?? null}
                                onChange={onSelectChange}
                                options={selectOptions ?? []}
                                styles={flatSelectStyles}
                                classNamePrefix="react-select"
                            />
                            <InputError message={error as any} />
                        </>
                    ) : (
                        <>
                            <Input
                                name={name}
                                value={editingValue || ''}
                                onChange={onChange}
                                className={`bg-transparent border-gray-200 ${errorClass(!!error)}`}
                            />
                            <InputError message={error as any} />
                        </>
                    )}
                </div>
            ) : (
                <p className="text-sm font-medium text-gray-900">{value}</p>
            )}
        </div>
    );
}

interface StatusBadgeProps {
    icon: React.ReactNode;
    label: string;
    value?: string | null;
    color: 'pink' | 'violet' | 'cyan' | 'emerald' | 'orange' | 'blue';
    isEditing: boolean;
    editingValue: string;
    options: readonly string[];
    onSelectChange: (value: string) => void;
}

function StatusBadge({ icon, label, value, color, isEditing, editingValue, options, onSelectChange }: StatusBadgeProps) {
    const colorClasses: Record<StatusBadgeProps['color'], string> = {
        pink: 'text-pink-600 bg-pink-50',
        violet: 'text-violet-600 bg-violet-50',
        cyan: 'text-cyan-600 bg-cyan-50',
        emerald: 'text-emerald-600 bg-emerald-50',
        orange: 'text-orange-600 bg-orange-50',
        blue: 'text-blue-600 bg-blue-50',
    };

    const formatStatus = (status?: string | null) => {
        if (!status) return 'N/A';
        return status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
    };

    return (
        <div className={`${colorClasses[color]} flex items-center gap-3 p-2`}>
            <div className={`h-10 w-10 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>{icon}</div>

            <div className="flex-1">
                <div className="text-xs text-gray-500">{label}</div>

                {isEditing ? (
                    <select
                        value={editingValue}
                        onChange={(e) => onSelectChange(e.target.value)}
                        className="w-full bg-transparent text-sm font-medium focus:outline-none"
                    >
                        <option value="">Select...</option>
                        {options.map((option) => (
                            <option key={option} value={option}>
                                {formatStatus(option)}
                            </option>
                        ))}
                    </select>
                ) : (
                    <div className="text-sm font-medium text-gray-900">{formatStatus(value)}</div>
                )}
            </div>
        </div>
    );
}

interface OwnerCardCompactProps {
    owner: Owner;
    formatDate: (date?: string) => string;
    getFileUrl: (path?: string | null) => string;
    onEdit: () => void;
    onDelete: () => void;
}

function OwnerCardCompact({ owner, formatDate, getFileUrl, onEdit, onDelete }: OwnerCardCompactProps) {
    const initials =
        owner.name
            ?.split(' ')
            .filter(Boolean)
            .map((n) => n[0])
            .join('')
            .slice(0, 2)
            .toUpperCase() ?? 'NA';

    const proofUrl = (owner as any).proof_id_url ?? (owner as any).ids ?? null;

    return (
        <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 hover:from-pink-50 hover:to-violet-50 transition-all">
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                    {owner.photo ? (
                        <img src={owner.photo_url} alt={owner.name} className="h-12 w-12 rounded-lg object-cover" />
                    ) : (
                        <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-pink-500 to-violet-500 flex items-center justify-center">
                            <span className="text-sm font-bold text-white">{initials}</span>
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                        <h4 className="font-semibold text-gray-900 truncate">{owner.name}</h4>
                        <div className="flex gap-1">
                            <button
                                type="button"
                                onClick={onEdit}
                                className="h-6 w-6 rounded hover:bg-gray-100 flex items-center justify-center"
                                title="Edit"
                            >
                                <Edit className="h-3 w-3 text-gray-500" />
                            </button>
                            <button
                                type="button"
                                onClick={onDelete}
                                className="h-6 w-6 rounded hover:bg-rose-50 flex items-center justify-center"
                                title="Delete"
                            >
                                <Trash2 className="h-3 w-3 text-rose-500" />
                            </button>
                        </div>
                    </div>

                    <div className="mt-2 space-y-1">
                        <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3 text-pink-500" />
                            <span className="text-xs text-gray-600 truncate">{owner.email || 'No email'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone className="h-3 w-3 text-violet-500" />
                            <span className="text-xs text-gray-600">{owner.phone || 'No phone'}</span>
                        </div>
                        {owner.birthdate && (
                            <div className="flex items-center gap-2">
                                <Calendar className="h-3 w-3 text-cyan-500" />
                                <span className="text-xs text-gray-600">{formatDate(owner.birthdate)}</span>
                            </div>
                        )}
                    </div>

                    {proofUrl && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                            <a
                                href={getFileUrl(proofUrl)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                            >
                                <IdCard className="h-3 w-3" />
                                View ID Proof
                                <ChevronRight className="h-3 w-3" />
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
