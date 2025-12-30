import {
    AlertDialog,
    AlertDialogAction,
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
    Eye,
    File,
    FileText,
    Image as ImageIcon,
    Upload,
    X,
} from 'lucide-react';
import { useState } from 'react';

interface OnboardingProps {
    company: Company;
}

interface ChecklistRemark {
    id: number;
    company_id: number;
    checklist_id: number;
    remark: string;
    file: string | null;
    created_at: string;
    updated_at: string;
}

interface Checklist {
    id: number;
    company_id: number;
    title: string;
    is_completed: boolean;
    created_at: string;
    updated_at: string;
    remarks: ChecklistRemark[];
}

interface CompanyWithChecklists extends Company {
    checklists?: Checklist[];
}

interface FormData {
    remarks: string;
    checklist_item_id: number;
    attachment: File | null;
}

// Helper function to determine file type and icon
const getFileInfo = (fileName: string | null) => {
    if (!fileName) return { isImage: false, icon: File };

    const imageExtensions = [
        '.jpg',
        '.jpeg',
        '.png',
        '.gif',
        '.bmp',
        '.webp',
        '.svg',
    ];
    const fileExtension = fileName
        .substring(fileName.lastIndexOf('.'))
        .toLowerCase();
    const isImage = imageExtensions.includes(fileExtension);

    return {
        isImage,
        icon: isImage ? ImageIcon : File,
        extension: fileExtension,
    };
};

export default function OnboardingTab({ company }: OnboardingProps) {
    // Cast company to include checklists
    const companyWithChecklists = company as CompanyWithChecklists;

    // Calculate checklist stats
    const totalChecklists = companyWithChecklists.checklists?.length || 0;
    const completedChecklists =
        companyWithChecklists.checklists?.filter(
            (item: Checklist) => item.is_completed,
        ).length || 0;
    const checklistPercentage =
        totalChecklists > 0
            ? Math.round((completedChecklists / totalChecklists) * 100)
            : 0;

    return (
        <CompanyLayout company={company} title={`${company.name} - Onboarding`}>
            <div className="space-y-6">
                {/* Progress Section */}
                <div className="rounded-lg border border-gray-200 bg-white p-6">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900">
                        Onboarding Progress
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <span className="font-medium text-gray-700">
                                    Documentation & Checklist
                                </span>
                                <span className="font-semibold text-blue-600">
                                    {checklistPercentage}%
                                </span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                                <div
                                    className="h-full rounded-full bg-blue-500 transition-all duration-300"
                                    style={{ width: `${checklistPercentage}%` }}
                                />
                            </div>
                            <p className="mt-2 text-sm text-gray-500">
                                {completedChecklists} of {totalChecklists} items
                                completed
                            </p>
                        </div>
                    </div>
                </div>

                {/* Checklist Items */}
                {companyWithChecklists.checklists &&
                    companyWithChecklists.checklists.length > 0 && (
                        <div className="rounded-lg border border-gray-200 bg-white p-6">
                            <h4 className="mb-4 text-lg font-semibold text-gray-900">
                                Checklist Items
                            </h4>
                            <div className="space-y-3">
                                {companyWithChecklists.checklists.map(
                                    (item: Checklist) => (
                                        <ChecklistItem
                                            key={item.id}
                                            item={item}
                                            companyId={company.id}
                                        />
                                    ),
                                )}
                            </div>
                        </div>
                    )}
            </div>
        </CompanyLayout>
    );
}

interface ChecklistItemProps {
    item: Checklist;
    companyId: number;
}

function ChecklistItem({ item, companyId }: ChecklistItemProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } =
        useForm<FormData>({
            remarks: '',
            checklist_item_id: item.id,
            attachment: null,
        });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setSelectedFile(file);
        setData('attachment', file);
    };

    const removeFile = () => {
        setSelectedFile(null);
        setData('attachment', null);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('remarks', data.remarks);
        formData.append('checklist_item_id', data.checklist_item_id.toString());
        if (data.attachment) {
            formData.append('attachment', data.attachment);
        }

        post(`/companies/${companyId}/onboarding`, {
            forceFormData: true,
            onSuccess: () => {
                setIsDialogOpen(false);
                reset();
                setSelectedFile(null);
            },
        });
    };

    // Function to open attachment in new tab
    const openAttachment = (filePath: string) => {
        // Assuming file paths are stored relative to public directory
        // Adjust the base URL as needed for your application
        const baseUrl = window.location.origin;
        const fullUrl = `${baseUrl}/${filePath}`;
        window.open(fullUrl, '_blank');
    };

    return (
        <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:bg-gray-50">
            <div className="flex items-center gap-3">
                <div
                    className={`flex h-8 w-8 items-center justify-center rounded ${item.is_completed ? 'bg-green-100' : 'bg-gray-100'}`}
                >
                    {item.is_completed ? (
                        <span className="font-medium text-green-600">✓</span>
                    ) : (
                        <span className="font-medium text-gray-600">
                            {item.id}
                        </span>
                    )}
                </div>
                <span
                    className={`${item.is_completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}
                >
                    {item.title}
                </span>
            </div>

            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm">
                        <FileText className="mr-2 h-4 w-4" />
                        {item.is_completed ? 'View Remarks' : 'Add Remarks'}
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="max-w-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {item.is_completed ? 'View Remarks' : 'Add Remarks'}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {item.is_completed ? 'View' : 'Add'} remarks and
                            documents for: {item.title}
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4 py-4">
                            {/* Existing Remarks Display */}
                            {item.is_completed &&
                                item.remarks &&
                                item.remarks.length > 0 && (
                                    <div className="space-y-3">
                                        <label className="text-sm font-medium">
                                            Previous Remarks
                                        </label>
                                        {item.remarks.map((remark) => {
                                            const { isImage, icon: FileIcon } =
                                                getFileInfo(remark.file);
                                            const hasAttachment =
                                                remark.file !== null;

                                            return (
                                                <div
                                                    key={remark.id}
                                                    className="rounded-lg border border-gray-200 p-4"
                                                >
                                                    <div className="mb-2">
                                                        <p className="text-sm text-gray-800">
                                                            {remark.remark}
                                                        </p>
                                                    </div>

                                                    {hasAttachment && (
                                                        <div className="mt-3 flex items-center justify-between rounded-md bg-gray-50 p-3">
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white">
                                                                    <FileIcon className="h-5 w-5 text-gray-600" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-medium text-gray-900">
                                                                        {remark.file
                                                                            ?.split(
                                                                                '/',
                                                                            )
                                                                            .pop()}
                                                                    </p>
                                                                    <p className="text-xs text-gray-500">
                                                                        {isImage
                                                                            ? 'Image File'
                                                                            : 'Document'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() =>
                                                                    openAttachment(
                                                                        remark.file!,
                                                                    )
                                                                }
                                                                className="gap-2"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                                View
                                                            </Button>
                                                        </div>
                                                    )}

                                                    {/* Preview for image files */}
                                                    {hasAttachment &&
                                                        isImage && (
                                                            <div className="mt-3">
                                                                <div className="mb-2 flex items-center justify-between">
                                                                    <span className="text-xs font-medium text-gray-600">
                                                                        Preview
                                                                    </span>
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() =>
                                                                            openAttachment(
                                                                                remark.file!,
                                                                            )
                                                                        }
                                                                        className="h-6 px-2 text-xs"
                                                                    >
                                                                        Open in
                                                                        new tab
                                                                    </Button>
                                                                </div>
                                                                <div
                                                                    className="cursor-pointer overflow-hidden rounded-md border border-gray-200"
                                                                    onClick={() =>
                                                                        openAttachment(
                                                                            remark.file!,
                                                                        )
                                                                    }
                                                                >
                                                                    <img
                                                                        src={`/${remark.file}`}
                                                                        alt="Attachment preview"
                                                                        className="h-32 w-full object-cover hover:opacity-90"
                                                                        onError={(
                                                                            e,
                                                                        ) => {
                                                                            const target =
                                                                                e.target as HTMLImageElement;
                                                                            target.style.display =
                                                                                'none';
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}

                                                    <p className="mt-3 text-xs text-gray-400">
                                                        Added on{' '}
                                                        {new Date(
                                                            remark.created_at,
                                                        ).toLocaleString()}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                            {/* Remarks Field (only show if not completed) */}
                            {!item.is_completed && (
                                <>
                                    <div>
                                        <label className="text-sm font-medium">
                                            Remarks *
                                        </label>
                                        <textarea
                                            value={data.remarks}
                                            onChange={(e) =>
                                                setData(
                                                    'remarks',
                                                    e.target.value,
                                                )
                                            }
                                            required={!item.is_completed}
                                            rows={4}
                                            className={`mt-1 w-full rounded-md border px-3 py-2 text-sm ${errors.remarks ? 'border-red-300' : 'border-gray-300'}`}
                                            placeholder="Enter remarks..."
                                            disabled={item.is_completed}
                                        />
                                        {errors.remarks && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.remarks}
                                            </p>
                                        )}
                                    </div>

                                    {/* File Upload */}
                                    <div>
                                        <label className="text-sm font-medium">
                                            Attachment (Optional)
                                        </label>
                                        {selectedFile ? (
                                            <div className="space-y-3">
                                                <div className="mt-1 flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-3">
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="h-5 w-5 text-green-600" />
                                                        <span className="text-sm">
                                                            {selectedFile.name}
                                                        </span>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={removeFile}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>

                                                {/* Preview for newly selected image files */}
                                                {selectedFile.type.startsWith(
                                                    'image/',
                                                ) && (
                                                    <div className="rounded-md border border-gray-200 p-2">
                                                        <div className="mb-2 flex items-center justify-between">
                                                            <span className="text-xs font-medium text-gray-600">
                                                                Preview
                                                            </span>
                                                            <span className="text-xs text-gray-500">
                                                                This image will
                                                                be uploaded
                                                            </span>
                                                        </div>
                                                        <div className="overflow-hidden rounded">
                                                            <img
                                                                src={URL.createObjectURL(
                                                                    selectedFile,
                                                                )}
                                                                alt="Selected file preview"
                                                                className="h-32 w-full object-cover"
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="mt-1">
                                                <input
                                                    type="file"
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                    id={`file-${item.id}`}
                                                    disabled={item.is_completed}
                                                    accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                                                />
                                                <label
                                                    htmlFor={`file-${item.id}`}
                                                    className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 ${item.is_completed ? 'cursor-not-allowed border-gray-200 bg-gray-50' : 'cursor-pointer border-gray-300 hover:border-blue-500'}`}
                                                >
                                                    <Upload className="h-8 w-8 text-gray-400" />
                                                    <span className="mt-2 text-sm">
                                                        {item.is_completed
                                                            ? 'No file attached'
                                                            : 'Click to upload'}
                                                    </span>
                                                    <span className="mt-1 text-xs text-gray-500">
                                                        Images, PDF, DOC, XLS,
                                                        TXT
                                                    </span>
                                                </label>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>

                        {!item.is_completed && (
                            <AlertDialogFooter>
                                <AlertDialogCancel
                                    onClick={() => setIsDialogOpen(false)}
                                >
                                    Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    type="submit"
                                    disabled={processing}
                                >
                                    {processing ? 'Saving...' : 'Save Remarks'}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        )}

                        {item.is_completed && (
                            <AlertDialogFooter>
                                <AlertDialogCancel
                                    onClick={() => setIsDialogOpen(false)}
                                >
                                    Close
                                </AlertDialogCancel>
                            </AlertDialogFooter>
                        )}
                    </form>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
