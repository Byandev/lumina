import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useForm } from '@inertiajs/react';
import React, { FormEvent, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface FormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    id: number | string | null;
}

export default function FormModal({
                                      open,
                                      onOpenChange,
                                      id,
                                  }: FormModalProps) {
    const { data, setData, put, processing, reset, errors, clearErrors } = useForm({
        password: '',
        confirmPassword: '',
    });

    // Clear errors when modal opens or ID changes
    useEffect(() => {
        if (open) {
            clearErrors();
        }
    }, [open, id, clearErrors]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (!id) {
            console.error('No user ID provided');
            return;
        }

        put(`/users/${id}/change-password`, {
            onSuccess: () => {
                reset();
                onOpenChange(false);
            },
            onError: () => {

            },
            preserveState: true,
            preserveScroll: true,
        });
    }

    const handleCancel = () => {
        reset();
        clearErrors();
        onOpenChange(false);
    };

    const handleOpenChange = (open: boolean) => {
        if (!open && !processing) {
            reset();
            clearErrors();
        }
        onOpenChange(open);
    };

    return (
        <Dialog
            open={open}
            onOpenChange={handleOpenChange}
        >
            <DialogContent
                className="p-0 sm:max-w-[600px]"
                onPointerDownOutside={(e) => {
                    if (processing) {
                        e.preventDefault();
                    }
                }}
                onEscapeKeyDown={(e) => {
                    if (processing) {
                        e.preventDefault();
                    }
                }}
            >
                <DialogHeader className="border-b p-6"> 
                    <DialogTitle>Change Password</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 p-6">
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm">
                            New Password *
                        </Label>
                        <Input
                            type="password"
                            id="password"
                            name="password"
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            required
                            minLength={8}
                            placeholder="Enter new password (min. 8 characters)"
                            disabled={processing}
                            className={errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}
                        />
                        {errors.password && (
                            <p id="password-error" className="text-sm text-red-500 mt-1">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-sm">
                            Confirm Password *
                        </Label>
                        <Input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={data.confirmPassword}
                            onChange={(e) =>
                                setData('confirmPassword', e.target.value)
                            }
                            required
                            minLength={8}
                            placeholder="Confirm new password"
                            disabled={processing}
                            className={errors.confirmPassword ? 'border-red-500 focus-visible:ring-red-500' : ''}
                        />
                        {errors.confirmPassword && (
                            <p id="confirm-error" className="text-sm text-red-500 mt-1">
                                {errors.confirmPassword}
                            </p>
                        )}
                    </div>

                    {/* Display general errors */}
                    {Object.keys(errors).filter(key => !['password', 'confirmPassword'].includes(key)).length > 0 && (
                        <div className="rounded-md bg-red-50 p-3">
                            {Object.entries(errors)
                                .filter(([key]) => !['password', 'confirmPassword'].includes(key))
                                .map(([key, error]) => (
                                    <p key={key} className="text-sm text-red-600">
                                        {error}
                                    </p>
                                ))}
                        </div>
                    )}

                    <DialogFooter className="gap-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing || !data.password || !data.confirmPassword}
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                'Update Password'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
