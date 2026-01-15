import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogHeader,
    DialogFooter,
} from '@/components/ui/dialog';
import { useForm } from '@inertiajs/react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { FormEvent } from 'react';
import { User } from '@/types';

interface FormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: User | null
}

const ChangePasswordModal = ({ user, open, onOpenChange }: FormModalProps) => {
    const { data, setData, processing, errors, put, setError, reset } = useForm({
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (user) {
            put(`/users/${user?.id}`, {
                onSuccess: () => {
                    onOpenChange(false);
                    reset();
                },
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-lg">
                        Change User Password
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 py-3">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="password" className="text-sm">
                                New Password
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) => {
                                    setData('password', e.target.value);
                                    setError('password', '');
                                }}
                                placeholder="••••••••"
                            />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label
                                htmlFor="password_confirmation"
                                className="text-sm"
                            >
                                Confirm new Password
                            </Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) => {
                                    setData(
                                        'password_confirmation',
                                        e.target.value,
                                    );
                                    setError('password', '');
                                }}
                                placeholder="••••••••"
                            />
                        </div>

                        {errors.password && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    <DialogFooter className="mt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={processing}
                            size="sm"
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing} size="sm">
                            {processing ? (
                                <>
                                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                'Change Password'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default ChangePasswordModal;
