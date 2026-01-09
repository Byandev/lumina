import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { Form, Head } from '@inertiajs/react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
}

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: LoginProps) {
    return (
        <AuthLayout
            title="Welcome back"
            description="Sign in to your account to continue"
        >
            <Head title="Log in" />

            <Form
                {...store.form()}
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="space-y-6">
                            {status && (
                                <div className="rounded-lg border border-green-500/20 bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-4 text-center text-sm font-medium text-green-600 backdrop-blur-sm">
                                    {status}
                                </div>
                            )}

                            <div className="space-y-4">
                                <div className="space-y-3">
                                    <Label
                                        htmlFor="email"
                                        className="text-sm font-medium text-foreground/90"
                                    >
                                        Email address
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="email"
                                        placeholder="you@example.com"
                                        className="bg-white/5 backdrop-blur-lg"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <Label
                                            htmlFor="password"
                                            className="text-sm font-medium text-foreground/90"
                                        >
                                            Password
                                        </Label>
                                        {canResetPassword && (
                                            <TextLink
                                                href={request()}
                                                className="ml-auto bg-gradient-to-r from-pink-500 via-blue-500 to-sky-500 bg-clip-text text-sm text-transparent transition-all duration-300 hover:from-cyan-400 hover:to-pink-400"
                                                tabIndex={5}
                                            >
                                                Forgot password?
                                            </TextLink>
                                        )}
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        placeholder="••••••••"
                                        className="bg-white/5 backdrop-blur-lg"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div className="flex items-center space-x-3">
                                    <Checkbox
                                        id="remember"
                                        name="remember"
                                        tabIndex={3}
                                        className="data-[state=checked]:border-transparent data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-pink-500 data-[state=checked]:to-cyan-500"
                                    />
                                    <Label
                                        htmlFor="remember"
                                        className="text-sm text-foreground/80"
                                    >
                                        Remember me
                                    </Label>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                    size="lg"
                                className="group relative w-full overflow-hidden"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                                animation={processing ? 'pulse' : 'none'}
                            >
                                <div className="relative flex items-center justify-center gap-2">
                                    {processing ? (
                                        <>
                                            <Spinner className="text-white" />
                                            <span className="relative">
                                                Signing in...
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <svg
                                                className="size-4 transition-transform group-hover:translate-x-0.5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                                                />
                                            </svg>
                                            <span className="relative">
                                                Sign In
                                            </span>
                                        </>
                                    )}
                                </div>

                                {/* Shimmer effect */}
                                {!processing && (
                                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                                )}
                            </Button>
                        </div>

                        {canRegister && (
                            <div className="text-center text-sm">
                                <span className="text-muted-foreground">
                                    Don't have an account?{' '}
                                </span>
                                <TextLink
                                    href={register()}
                                    tabIndex={5}
                                    className="bg-gradient-to-r from-cyan-500 to-pink-500 bg-clip-text font-semibold text-transparent transition-all duration-300 hover:from-cyan-400 hover:to-pink-400"
                                >
                                    Create an account
                                </TextLink>
                            </div>
                        )}
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
