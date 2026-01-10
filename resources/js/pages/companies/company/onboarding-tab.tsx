import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import CompanyLayout from '@/pages/companies/company/company-layout';
import { Company } from '@/pages/companies/company/types';
import { useForm } from '@inertiajs/react';
import {
    CheckCircle2,
    Download,
    ExternalLink,
    Eye,
    File,
    FileSpreadsheet,
    FileText,
    Image as ImageIcon,
    Loader2,
    Paperclip,
    Plus,
    X,
} from 'lucide-react';
import React, { useRef, useState } from 'react';

/* =======================
   Types
======================= */

interface OnboardingProps {
    company: Company;
    checklists?: Array<{
        id: number;
        title: string;
        created_at: string | null;
        updated_at: string | null;
        pivot: {
            company_id: number;
            checklist_id: number;
            is_completed: boolean;
            remark: string | null;
            file: string | null;
            file_url: string | null; // Added for S3 URLs
            created_at: string;
            updated_at: string;
        };
    }>;
}

interface ChecklistRemark {
    id: number;
    remark: string;
    file: string | null;
    file_url: string | null; // Added for S3 URLs
    file_name?: string;
    file_size?: number;
    mime_type?: string;
    created_at: string;
}

interface ChecklistWithPivot {
    id: number;
    title: string;
    created_at: string | null;
    updated_at: string | null;
    pivot: {
        company_id: number;
        checklist_id: number;
        is_completed: boolean;
        remark: string | null;
        file: string | null;
        file_url: string | null; // Added for S3 URLs
        created_at: string;
        updated_at: string;
    };
    // For compatibility with existing code
    is_completed?: boolean;
    remarks?: ChecklistRemark[];
}

interface FormData {
    remarks: string;
    checklist_item_id: number;
    attachment: File | null;
}

/* =======================
   Helpers
======================= */

interface FileInfo {
    Icon: React.ComponentType<{ className?: string }>;
    color: string;
    bgColor: string;
    canPreview: boolean;
    previewType: string;
}

const getFileInfo = (fileName?: string, mimeType?: string): FileInfo => {
    if (!fileName && !mimeType)
        return {
            Icon: File,
            color: 'text-gray-500',
            bgColor: 'bg-gray-50',
            canPreview: false,
            previewType: 'file',
        };

    const name = fileName || '';
    const ext = name.substring(name.lastIndexOf('.')).toLowerCase();
    const mime = mimeType || '';

    // Image files
    const imageExt = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
    const imageMimes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/svg+xml',
    ];

    // PDF files
    const pdfExt = ['.pdf'];
    const pdfMimes = ['application/pdf'];

    // Word files
    const wordExt = ['.doc', '.docx'];
    const wordMimes = [
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    // Excel files
    const excelExt = ['.xls', '.xlsx'];
    const excelMimes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];

    if (imageExt.includes(ext) || imageMimes.includes(mime)) {
        return {
            Icon: ImageIcon,
            color: 'text-pink-500',
            bgColor: 'bg-pink-50',
            canPreview: true,
            previewType: 'image',
        };
    }

    if (pdfExt.includes(ext) || pdfMimes.includes(mime)) {
        return {
            Icon: File,
            color: 'text-red-500',
            bgColor: 'bg-red-50',
            canPreview: true,
            previewType: 'pdf',
        };
    }

    if (wordExt.includes(ext) || wordMimes.includes(mime)) {
        return {
            Icon: FileText,
            color: 'text-blue-500',
            bgColor: 'bg-blue-50',
            canPreview: false,
            previewType: 'word',
        };
    }

    if (excelExt.includes(ext) || excelMimes.includes(mime)) {
        return {
            Icon: FileSpreadsheet,
            color: 'text-emerald-500',
            bgColor: 'bg-emerald-50',
            canPreview: false,
            previewType: 'excel',
        };
    }

    return {
        Icon: File,
        color: 'text-gray-500',
        bgColor: 'bg-gray-50',
        canPreview: false,
        previewType: 'file',
    };
};

const formatFileSize = (bytes?: number): string => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
};

const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const getAttachmentUrl = (path: string): string => {
    // If it's already a full URL (S3 or external), return as-is
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }
    // For local storage paths, convert to storage URL
    return `${window.location.origin}/storage/${path.replace(/^\/storage\//, '')}`;
};

/* =======================
   Preview Modal Component
======================= */

interface PreviewModalProps {
    file: string;
    fileName?: string;
    fileType: string;
    onClose: () => void;
}

const PreviewModal = ({
    file,
    fileName,
    fileType,
    onClose,
}: PreviewModalProps) => {
    const url = file; // Already a full URL from S3 or local

    const renderPreview = () => {
        if (fileType === 'image') {
            return (
                <div className="relative h-full">
                    <img
                        src={url}
                        alt={fileName || 'Preview'}
                        className="h-full w-full object-contain"
                    />
                </div>
            );
        }

        if (fileType === 'pdf') {
            return (
                <div className="h-full">
                    <iframe
                        src={url}
                        title={fileName || 'PDF Preview'}
                        className="h-full w-full border-0"
                    />
                </div>
            );
        }

        return (
            <div className="flex h-full flex-col items-center justify-center p-4 sm:p-8">
                <File className="h-12 w-12 text-gray-400 sm:h-16 sm:w-16" />
                <p className="mt-3 text-base font-medium text-gray-900 sm:mt-4 sm:text-lg">
                    Preview not available
                </p>
                <p className="mt-1 text-sm text-gray-500">
                    This file type cannot be previewed directly
                </p>
                <Button
                    onClick={() => window.open(url, '_blank')}
                    className="mt-4 sm:mt-6"
                    size="sm"
                >
                    <Download className="mr-2 h-4 w-4" />
                    Download File
                </Button>
            </div>
        );
    };

    const fileInfo = getFileInfo(fileName);
    const fileSize = 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4">
            <div className="relative flex h-[90vh] w-full max-w-4xl flex-col rounded-lg bg-white shadow-xl">
                {/* Header */}
                <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
                    <div className="flex items-center gap-3">
                        <div
                            className={`flex h-8 w-8 items-center justify-center rounded-lg sm:h-10 sm:w-10 ${fileInfo.bgColor}`}
                        >
                            <fileInfo.Icon
                                className={`h-4 w-4 sm:h-5 sm:w-5 ${fileInfo.color}`}
                            />
                        </div>
                        <div className="min-w-0">
                            <h3 className="truncate text-sm font-medium text-gray-900 sm:text-base">
                                {fileName || 'Preview'}
                            </h3>
                            <p className="text-xs text-gray-500 capitalize sm:text-sm">
                                {fileType} • {formatFileSize(fileSize)}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(url, '_blank')}
                            className="h-8 text-xs sm:h-10 sm:text-sm"
                        >
                            <ExternalLink className="mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4" />
                            <span className="hidden sm:inline">
                                Open in new tab
                            </span>
                            <span className="sm:hidden">Open</span>
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="h-8 w-8 p-0 sm:h-10 sm:w-10"
                        >
                            <X className="h-4 w-4 sm:h-5 sm:w-5" />
                        </Button>
                    </div>
                </div>

                {/* Preview Content */}
                <div className="flex-1 overflow-auto">{renderPreview()}</div>

                {/* Footer */}
                <div className="border-t p-3 sm:px-6 sm:py-3">
                    <div className="flex flex-col items-center justify-between gap-3 sm:flex-row sm:gap-0">
                        <span className="text-xs text-gray-500 sm:text-sm">
                            Click "Open" for full view
                        </span>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = fileName || 'download';
                                    document.body.appendChild(a);
                                    a.click();
                                    document.body.removeChild(a);
                                }}
                                className="h-8 text-xs sm:h-9 sm:text-sm"
                            >
                                <Download className="mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4" />
                                Download
                            </Button>
                            <Button
                                variant="default"
                                size="sm"
                                onClick={onClose}
                                className="h-8 text-xs sm:h-9 sm:text-sm"
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* =======================
   Progress Bar Component
======================= */

interface ProgressBarProps {
    completed: number;
    total: number;
}

const ProgressBar = ({ completed, total }: ProgressBarProps) => {
    const percent = total ? Math.round((completed / total) * 100) : 0;

    return (
        <div className="space-y-2">
            <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                <span className="text-sm font-medium text-gray-700">
                    Onboarding Progress
                </span>
                <span className="text-lg font-semibold text-gray-900">
                    {percent}%
                </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                    style={{ width: `${percent}%` }}
                />
            </div>
            <div className="flex flex-col justify-between gap-1 text-xs text-gray-500 sm:flex-row">
                <span>
                    {completed} of {total} completed
                </span>
                <span>{total - completed} remaining</span>
            </div>
        </div>
    );
};

/* =======================
   File Preview Component
======================= */

interface FilePreviewProps {
    file: string;
    file_url?: string; // S3 URL
    fileName?: string;
    fileSize?: number;
    mimeType?: string;
}

const FilePreview = ({
    file,
    file_url,
    fileName,
    fileSize,
    mimeType,
}: FilePreviewProps) => {
    const [showPreview, setShowPreview] = useState(false);
    const fileInfo = getFileInfo(fileName, mimeType);
    const Icon = fileInfo.Icon;
    const displayName = fileName || file.split('/').pop() || 'File';

    // Use file_url if available (S3), otherwise use local storage URL
    const url = file_url || getAttachmentUrl(file);

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (fileInfo.canPreview) {
            setShowPreview(true);
        } else {
            window.open(url, '_blank');
        }
    };

    const handleDownload = (e: React.MouseEvent) => {
        e.stopPropagation();
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName || 'download';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const handlePreviewClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowPreview(true);
    };

    return (
        <>
            <div
                onClick={(e) => handleClick(e)}
                className="group flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 transition-colors hover:border-blue-200 hover:bg-blue-50/50"
            >
                <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg sm:h-10 sm:w-10 ${fileInfo.bgColor} ${fileInfo.color}`}
                >
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">
                        {displayName}
                    </p>
                    <div className="flex flex-col gap-1 text-xs text-gray-500 sm:flex-row sm:items-center sm:gap-2">
                        <span className="capitalize">
                            {fileInfo.previewType}
                        </span>
                        {fileSize && (
                            <>
                                <span className="hidden sm:inline">•</span>
                                <span>{formatFileSize(fileSize)}</span>
                            </>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    {fileInfo.canPreview && (
                        <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 opacity-100 transition-opacity group-hover:opacity-100 sm:h-8 sm:w-8 sm:opacity-0"
                            onClick={handlePreviewClick}
                        >
                            <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </Button>
                    )}
                    <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 opacity-100 transition-opacity group-hover:opacity-100 sm:h-8 sm:w-8 sm:opacity-0"
                        onClick={handleDownload}
                    >
                        <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Button>
                </div>
            </div>

            {showPreview && fileInfo.canPreview && (
                <PreviewModal
                    file={url} // Use the URL (S3 or local)
                    fileName={fileName}
                    fileType={fileInfo.previewType}
                    onClose={() => setShowPreview(false)}
                />
            )}
        </>
    );
};

/* =======================
   Remark Item Component
======================= */

interface RemarkItemProps {
    remark: ChecklistRemark;
}

const RemarkItem = ({ remark }: RemarkItemProps) => {
    return (
        <div className="space-y-3 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                <p className="text-sm text-gray-800">{remark.remark}</p>
                <span className="text-xs whitespace-nowrap text-gray-400">
                    {formatDate(remark.created_at)}
                </span>
            </div>
            {remark.file && (
                <FilePreview
                    file={remark.file}
                    file_url={remark.file_url} // Pass S3 URL
                    fileName={remark.file_name}
                    fileSize={remark.file_size}
                    mimeType={remark.mime_type}
                />
            )}
        </div>
    );
};

/* =======================
   Main Tab Component
======================= */

export default function OnboardingTab({
    checklists,
    company,
}: OnboardingProps) {
    // Calculate progress
    const total = checklists?.length || 0;
    const completed =
        checklists?.filter((item) => item.pivot.is_completed).length || 0;

    // Convert to the format expected by ChecklistItem component
    const formattedChecklists: ChecklistWithPivot[] = (checklists || []).map(
        (item) => ({
            ...item,
            is_completed: item.pivot.is_completed,
            remarks: item.pivot.remark
                ? [
                      {
                          id: item.id,
                          remark: item.pivot.remark,
                          file: item.pivot.file,
                          file_url: item.pivot.file_url, // Include S3 URL
                          created_at: item.pivot.created_at,
                      },
                  ]
                : [],
        }),
    );

    return (
        <CompanyLayout company={company} title={`${company.name} - Onboarding`}>
            <div className="space-y-4 sm:space-y-6">
                {/* Progress Card */}
                <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
                    <ProgressBar completed={completed} total={total} />
                </div>

                {/* Checklist Section */}
                <div className="space-y-3">
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center sm:gap-0">
                        <div>
                            <h3 className="text-base font-semibold text-gray-900 sm:text-lg">
                                Checklist Items
                            </h3>
                            <p className="text-xs text-gray-500 sm:text-sm">
                                Complete each item to finish onboarding
                            </p>
                        </div>
                        <div className="text-sm font-medium text-gray-500">
                            {completed}/{total} completed
                        </div>
                    </div>

                    <div className="space-y-2">
                        {formattedChecklists.length > 0 ? (
                            formattedChecklists.map((item) => (
                                <ChecklistItem
                                    key={item.id}
                                    item={item}
                                    companyId={company.id}
                                />
                            ))
                        ) : (
                            <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center sm:p-8">
                                <FileText className="mx-auto h-8 w-8 text-gray-400 sm:h-10 sm:w-10" />
                                <p className="mt-2 text-sm text-gray-500">
                                    No checklist items found
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </CompanyLayout>
    );
}

/* =======================
   Checklist Item Component
======================= */

interface ChecklistItemProps {
    item: ChecklistWithPivot;
    companyId: number;
}

function ChecklistItem({ item, companyId }: ChecklistItemProps) {
    const [open, setOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors, reset } =
        useForm<FormData>({
            remarks: '',
            checklist_item_id: item.id,
            attachment: null,
        });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.remarks.trim()) return;

        post(`/companies/${companyId}/onboarding`, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setOpen(false);
                reset();
                setFile(null);
            },
        });
    };

    const handleFileSelect = (selectedFile: File | null) => {
        setFile(selectedFile);
        setData('attachment', selectedFile);
    };

    const handleRemoveFile = () => {
        setFile(null);
        setData('attachment', null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const isCompleted = item.pivot.is_completed;
    const remarks = item.remarks || [];

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-3 transition-colors hover:border-gray-300 sm:p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                    <div className="min-w-0 flex-1">
                        <h4
                            className={`text-sm font-medium sm:text-base ${isCompleted ? 'text-emerald-700' : 'text-gray-900'}`}
                        >
                            Step {item.id}: {item.title}
                        </h4>
                        {item.pivot.remark && !isCompleted && (
                            <p className="mt-1 truncate text-xs text-gray-500">
                                Remark: {item.pivot.remark}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                    <AlertDialog open={open} onOpenChange={setOpen}>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant={isCompleted ? 'outline' : 'default'}
                                size="sm"
                                className={`h-7 text-xs sm:h-8 sm:text-sm ${isCompleted ? 'border-gray-200 text-gray-700 hover:bg-gray-50' : ''}`}
                            >
                                {isCompleted ? (
                                    'View'
                                ) : (
                                    <>
                                        <Plus className="mr-1.5 h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                        <span className="hidden sm:inline">
                                            {item.pivot.remark
                                                ? 'Update Remark'
                                                : 'Add Remark'}
                                        </span>
                                        <span className="sm:hidden">
                                            {item.pivot.remark
                                                ? 'Update'
                                                : 'Add'}
                                        </span>
                                    </>
                                )}
                            </Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent className="max-w-2xl p-0 sm:max-w-3xl">
                            <div className="max-h-[85vh] overflow-hidden rounded-lg">
                                {/* Header */}
                                <AlertDialogHeader className="border-b p-4 sm:p-5">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1 pr-4">
                                            <AlertDialogTitle className="text-base font-semibold sm:text-lg">
                                                {item.title}
                                            </AlertDialogTitle>
                                            <AlertDialogDescription className="text-xs text-gray-500 sm:text-sm">
                                                {isCompleted
                                                    ? 'View remark details'
                                                    : item.pivot.remark
                                                      ? 'Update your remark'
                                                      : 'Add a remark for this item'}
                                            </AlertDialogDescription>
                                        </div>
                                        <AlertDialogCancel className="h-7 w-7 border-0 p-0 hover:bg-gray-100 sm:h-8 sm:w-8">
                                            <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                        </AlertDialogCancel>
                                    </div>
                                </AlertDialogHeader>

                                {/* Content */}
                                <form
                                    onSubmit={submit}
                                    className="flex flex-col"
                                >
                                    <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:space-y-5 sm:p-5">
                                        {/* Status Indicator */}
                                        {isCompleted && (
                                            <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-3">
                                                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                                                <span className="text-sm font-medium text-emerald-700">
                                                    This item is marked as
                                                    completed
                                                </span>
                                            </div>
                                        )}

                                        {/* Existing Remark from Pivot */}
                                        {item.pivot.remark && (
                                            <div className="space-y-2 sm:space-y-3">
                                                <h5 className="text-sm font-medium text-gray-700">
                                                    {isCompleted
                                                        ? 'Submitted Remark'
                                                        : 'Current Remark'}
                                                </h5>
                                                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 sm:p-4">
                                                    <p className="text-sm text-gray-800">
                                                        {item.pivot.remark}
                                                    </p>
                                                    {item.pivot.file && (
                                                        <div className="mt-3">
                                                            <FilePreview
                                                                file={
                                                                    item.pivot
                                                                        .file
                                                                }
                                                                file_url={
                                                                    item.pivot
                                                                        .file_url
                                                                } // Pass S3 URL
                                                            />
                                                        </div>
                                                    )}
                                                    <p className="mt-2 text-xs text-gray-400">
                                                        Added on{' '}
                                                        {formatDate(
                                                            item.pivot
                                                                .created_at,
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Add/Update Remark Form */}
                                        {!isCompleted && (
                                            <div className="space-y-4">
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                                            Remarks{' '}
                                                            <span className="text-red-500">
                                                                *
                                                            </span>
                                                        </label>
                                                        <textarea
                                                            rows={3}
                                                            required
                                                            value={data.remarks}
                                                            onChange={(e) =>
                                                                setData(
                                                                    'remarks',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            placeholder="Enter your remarks..."
                                                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                                                            defaultValue={
                                                                item.pivot
                                                                    .remark ||
                                                                ''
                                                            }
                                                        />
                                                        {errors.remarks && (
                                                            <p className="mt-1 text-xs text-red-600">
                                                                {errors.remarks}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                                            Attachment
                                                            (Optional)
                                                        </label>
                                                        {file ? (
                                                            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center gap-3">
                                                                        <Paperclip className="h-4 w-4 text-blue-600" />
                                                                        <div className="min-w-0">
                                                                            <p className="truncate text-sm font-medium text-gray-900">
                                                                                {
                                                                                    file.name
                                                                                }
                                                                            </p>
                                                                            <p className="text-xs text-gray-500">
                                                                                {formatFileSize(
                                                                                    file.size,
                                                                                )}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <button
                                                                        type="button"
                                                                        onClick={
                                                                            handleRemoveFile
                                                                        }
                                                                        className="text-gray-400 hover:text-gray-600"
                                                                    >
                                                                        <X className="h-4 w-4" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div
                                                                onClick={() =>
                                                                    fileInputRef.current?.click()
                                                                }
                                                                className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4 text-center transition-colors hover:border-blue-300 hover:bg-blue-50"
                                                            >
                                                                <Paperclip className="mx-auto h-5 w-5 text-gray-400 sm:h-6 sm:w-6" />
                                                                <p className="mt-2 text-sm text-gray-600">
                                                                    Click to
                                                                    upload file
                                                                </p>
                                                                <p className="mt-1 text-xs text-gray-400">
                                                                    Images, PDF,
                                                                    Word, Excel
                                                                    (Max 5MB)
                                                                </p>
                                                            </div>
                                                        )}
                                                        <input
                                                            ref={fileInputRef}
                                                            type="file"
                                                            className="hidden"
                                                            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                                                            onChange={(e) => {
                                                                handleFileSelect(
                                                                    e.target
                                                                        .files?.[0] ||
                                                                        null,
                                                                );
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Footer */}
                                    <AlertDialogFooter className="border-t bg-gray-50 p-4">
                                        <div className="flex w-full flex-col-reverse items-center justify-between gap-3 sm:flex-row sm:gap-0">
                                            <AlertDialogCancel className="h-8 w-full text-sm sm:h-9 sm:w-auto sm:px-4">
                                                Close
                                            </AlertDialogCancel>
                                            {!isCompleted && (
                                                <Button
                                                    type="submit"
                                                    disabled={
                                                        processing ||
                                                        !data.remarks.trim()
                                                    }
                                                    className="h-8 w-full text-sm sm:h-9 sm:w-auto sm:px-4"
                                                >
                                                    {processing ? (
                                                        <>
                                                            <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                                                            Saving...
                                                        </>
                                                    ) : item.pivot.remark ? (
                                                        'Update Remark'
                                                    ) : (
                                                        'Save Remark'
                                                    )}
                                                </Button>
                                            )}
                                        </div>
                                    </AlertDialogFooter>
                                </form>
                            </div>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
        </div>
    );
}
