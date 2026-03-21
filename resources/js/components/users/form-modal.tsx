import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { Key, Loader2, Lock, Mail, User, X } from 'lucide-react';
import { FormEvent } from 'react';

interface FormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const FormModal = ({ open, onOpenChange }: FormModalProps) => {
    const { data, setData, processing, errors, post, setError, reset } =
        useForm({
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
                reset();
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="border border-gray-200 bg-white p-0 sm:max-w-lg">
                {/* Header */}
                <div className="border-b border-gray-200  px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <User className="h-5 w-5 text-pink-500" />
                            <DialogTitle className="text-lg font-semibold text-gray-900">
                                Create New User
                            </DialogTitle>
                        </div>

                    </div>
                    <DialogDescription className="mt-1 text-sm text-gray-500">
                        Add a new user to the system with access credentials
                    </DialogDescription>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="px-6 py-4">
                    <div className="space-y-4">
                        {/* Full Name Field */}
                        <div className="space-y-1.5">
                            <Label
                                htmlFor="name"
                                className="text-sm font-medium text-gray-700"
                            >
                                <div className="flex items-center space-x-1">
                                    <User className="h-3.5 w-3.5" />
                                    <span>Full Name</span>
                                    <span className="text-red-500">*</span>
                                </div>
                            </Label>
                            <div className="relative">
                                <User className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => {
                                        setData('name', e.target.value);
                                        setError('name', '');
                                    }}
                                    placeholder="John Doe"
                                />
                            </div>
                            {errors.name && (
                                <p className="text-xs text-red-500">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Email Field */}
                        <div className="space-y-1.5">
                            <Label
                                htmlFor="email"
                                className="text-sm font-medium text-gray-700"
                            >
                                <div className="flex items-center space-x-1">
                                    <Mail className="h-3.5 w-3.5" />
                                    <span>Email Address</span>
                                    <span className="text-red-500">*</span>
                                </div>
                            </Label>
                            <div className="relative">
                                <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => {
                                        setData('email', e.target.value);
                                        setError('email', '');
                                    }}
                                    placeholder="john@example.com"
                                />
                            </div>
                            {errors.email && (
                                <p className="text-xs text-red-500">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password Fields */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label
                                    htmlFor="password"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    <div className="flex items-center space-x-1">
                                        <Lock className="h-3.5 w-3.5" />
                                        <span>Password</span>
                                    </div>
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
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
                            </div>
                            <div className="space-y-1.5">
                                <Label
                                    htmlFor="password_confirmation"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    <div className="flex items-center space-x-1">
                                        <Key className="h-3.5 w-3.5" />
                                        <span>Confirm</span>
                                    </div>
                                </Label>
                                <div className="relative">
                                    <Key className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
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
                                        className=""
                                    />
                                </div>
                            </div>
                        </div>
                        {errors.password && (
                            <p className="-mt-2 text-xs text-red-500">
                                {errors.password}
                            </p>
                        )}

                        {/* Password Hint */}
                        <div className="border border-gray-200 bg-gray-50 p-3">
                            <p className="text-xs text-gray-500">
                                Password must be at least 8 characters long
                            </p>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <DialogFooter className="mt-6 border-t border-gray-200 pt-4">
                        <div className="flex justify-end space-x-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={processing}
                                className="border border-gray-300 text-gray-700  "
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="flex items-center space-x-2  text-white transition-colors hover:bg-pink-700"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span>Creating...</span>
                                    </>
                                ) : (
                                    <>
                                        <User className="h-4 w-4" />
                                        <span>Create User</span>
                                    </>
                                )}
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default FormModal;
