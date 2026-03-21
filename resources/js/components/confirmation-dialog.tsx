import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import React from 'react';

interface Props {
    isOpen: boolean;
    onOpenChange: (bool: boolean) => void;
    title?: string;
    description?: string;
    cancelText?: React.ReactNode;
    confirmText?: React.ReactNode;
    onCancel: () => void;
    onConfirm: () => void;
}

const ConfirmationDialog = ({
    isOpen,
    onOpenChange,
    description,
    title = 'Are you sure?',
    cancelText = 'Cancel',
    confirmText = 'Confirm',
    onCancel,
    onConfirm
}: Props) => {
    return (
        <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    {description && (
                        <AlertDialogDescription>
                            {description}
                        </AlertDialogDescription>
                    )}
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onCancel}>
                        {cancelText}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 h-9"
                    >
                        {confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default ConfirmationDialog;
