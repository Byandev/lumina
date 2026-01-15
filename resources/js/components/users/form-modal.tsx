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

interface FormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const FormModal = ({ open, onOpenChange }: FormModalProps) => {
    const { data, setData, processing, errors, post, setError, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        post('/users', {
            onSuccess: () => {
                onOpenChange(false);
                reset()
            }
        })
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-lg">
                        Create New User
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 py-3">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="name" className="text-sm">
                                Full Name
                            </Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => {
                                    setData('name', e.target.value);
                                    setError('name', '')
                                }}
                                placeholder="John Doe"
                            />
                            {errors.name && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="email" className="text-sm">
                                Email Address
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => {
                                    setData('email', e.target.value)
                                    setError('email', '');
                                }}
                                placeholder="john@example.com"
                            />
                            {errors.email && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="password" className="text-sm">
                                    Password
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
                                    Confirm Password
                                </Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) =>
                                        {
                                            setData(
                                                'password_confirmation',
                                                e.target.value,
                                            );
                                            setError('password', '');
                                        }
                                    }
                                    placeholder="••••••••"
                                />
                            </div>
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
                                    Creating...
                                </>
                            ) : (
                                'Create User'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default FormModal
