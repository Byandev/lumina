import React from 'react';
import { FileText, Upload, X } from 'lucide-react';

import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';

type FileInputProps = {
    label: string;
    accept?: string;
    value: File | Media | null;
    onChange: (file: File | null) => void;
    error?: string;
    required?: boolean;
    description?: string;
};

function RequiredMark() {
    return <span className="ml-1 text-rose-600">*</span>;
}

export default function FileInput({
                                      label,
                                      accept = '*',
                                      value,
                                      onChange,
                                      error,
                                      required = false,
                                      description,
                                  }: FileInputProps) {
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = React.useState(false);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        onChange(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0] ?? null;
        if (file) onChange(file);
    };

    const handleRemove = () => {
        onChange(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    function truncateFileName(name: string, maxLength = 100) {
        if (name.length <= maxLength) return name;

        const extIndex = name.lastIndexOf('.');
        if (extIndex === -1) {
            return name.slice(0, maxLength) + '…';
        }

        const ext = name.slice(extIndex);
        const base = name.slice(0, maxLength - ext.length - 1);

        return `${base}…${ext}`;
    }

    return (
        <div className="space-y-2">
            <Label className="text-sm font-medium text-zinc-800">
                {label} {required && <RequiredMark />}
            </Label>

            <div
                className={[
                    'group relative rounded-xl border bg-white transition',
                    isDragging
                        ? 'border-zinc-900 ring-2 ring-zinc-900/10'
                        : 'border-zinc-200 hover:border-zinc-300',
                ].join(' ')}
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                }}
                onDragLeave={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                }}
                onDrop={handleDrop}
            >
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="block w-full rounded-xl p-5 text-left"
                >
                    {value ? (
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50">
                                    <FileText className="h-5 w-5 text-zinc-700" />
                                </div>

                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-zinc-900">
                                        {truncateFileName(value.name, 30)}
                                    </p>
                                    <p className="text-xs text-zinc-500">
                                        {(value.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50">
                                <Upload className="h-5 w-5 text-zinc-700" />
                            </div>

                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-zinc-900">
                                    Upload a file{' '}
                                    <span className="font-normal text-zinc-500">
                    (or drag and drop)
                  </span>
                                </p>
                                <p className="mt-0.5 text-xs text-zinc-500">
                                    {description || 'Supported formats based on the field.'}
                                </p>
                            </div>
                        </div>
                    )}
                </button>

                {value && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleRemove();
                        }}
                        className="absolute right-3 top-3 inline-flex items-center justify-center rounded-lg border border-zinc-200 bg-white p-2 text-zinc-500 hover:text-zinc-900"
                        aria-label="Remove file"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept={accept}
                    onChange={handleFileSelect}
                />
            </div>

            <InputError message={error} />
        </div>
    );
}
