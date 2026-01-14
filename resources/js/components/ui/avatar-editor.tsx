import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useMemo } from 'react';

export type AvatarEditorValue = {
    url?: string | null;
};

export type AvatarEditorResult = {
    file: File;
    previewUrl: string;
};

export type AvatarEditorProps = {
    value?: AvatarEditorValue;
    onChange?: (result: AvatarEditorResult | null) => void;

    fallbackText?: string;
    accept?: string;
    maxFileMB?: number;
    disabled?: boolean;
    className?: string;
};

export function AvatarEditor({
                                 value,
                                 onChange,
                                 fallbackText = "U",
                                 accept = "image/*",
                                 maxFileMB = 5,
                                 disabled,
                                 className,
                             }: AvatarEditorProps) {
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    const [localPreview, setLocalPreview] = React.useState<string | null>(null);
    const [cleared, setCleared] = React.useState(false);

    React.useEffect(() => {
        if (value?.url) {
            setCleared(false);
        }
    }, [value?.url]);

    React.useEffect(() => {
        return () => {
            if (localPreview?.startsWith("blob:")) {
                URL.revokeObjectURL(localPreview);
            }
        };
    }, [localPreview]);

    const displayUrl = useMemo(() => cleared ? null : localPreview ?? value?.url ?? null, [cleared, localPreview, value?.url]);

    const openPicker = () => {
        if (!disabled) inputRef.current?.click();
    };

    const validate = (file: File) => {
        const maxBytes = maxFileMB * 1024 * 1024;
        if (!file.type.startsWith("image/")) throw new Error("Image files only.");
        if (file.size > maxBytes) throw new Error(`Max file size is ${maxFileMB}MB.`);
    };

    const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            validate(file);
            setCleared(false);

            if (localPreview?.startsWith("blob:")) {
                URL.revokeObjectURL(localPreview);
            }

            const previewUrl = URL.createObjectURL(file);
            setLocalPreview(previewUrl);

            onChange?.({ file, previewUrl });
        } catch (err: any) {
            alert(err?.message ?? "Invalid file.");
        } finally {
            e.target.value = "";
        }
    };

    const handleRemove = () => {
        if (disabled) return;

        setCleared(true);

        if (localPreview?.startsWith("blob:")) {
            URL.revokeObjectURL(localPreview);
        }

        setLocalPreview(null);
        onChange?.(null);

        if (inputRef.current) inputRef.current.value = "";
    };

    return (
        <div className={cn("flex items-center gap-4", className)}>
            <Avatar className="h-16 w-16 border border-gray-300">
                {displayUrl ? (
                    <AvatarImage key={displayUrl} src={displayUrl} alt="Avatar" />
                ) : null}
                <AvatarFallback>{fallbackText}</AvatarFallback>
            </Avatar>

            <div className="flex gap-2">
                <Button type="button" variant="default" onClick={openPicker} disabled={disabled}>
                    Choose image
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    onClick={handleRemove}
                    disabled={disabled || !displayUrl}
                >
                    Remove
                </Button>

                <Input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    onChange={handleFileChange}
                    disabled={disabled}
                    className="hidden"
                />
            </div>
        </div>
    );
}
