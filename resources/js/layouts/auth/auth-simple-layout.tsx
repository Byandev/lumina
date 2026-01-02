    import AppLogoIcon from '@/components/app-logo-icon';
    import { home } from '@/routes';
    import { Link } from '@inertiajs/react';
    import { type PropsWithChildren } from 'react';

    interface AuthLayoutProps {
        name?: string;
        title?: string;
        description?: string;
        imageSrc?: string;
        imageAlt?: string;
        imagePosition?: 'left' | 'right';
    }

    export default function AuthSimpleLayout({
                                                 children,
                                                 title,
                                                 description,
                                                 imagePosition = 'left',
                                             }: PropsWithChildren<AuthLayoutProps>) {
        return (
            <div className="flex min-h-svh bg-background">
                <div className="relative hidden overflow-hidden bg-gradient-to-br from-blue-50 to-white lg:flex lg:w-1/2">
                    {/* Background pattern */}
                    <div className="absolute inset-0">
                        {/* Grid pattern */}
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>

                        {/* Floating circles */}
                        <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-gradient-to-br from-blue-200 to-pink-50 opacity-70"></div>
                        <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-gradient-to-br from-blue-100 to-cyan-50 opacity-70"></div>
                    </div>

                    {/* Main content container */}
                    <div className="relative z-10 flex flex-col justify-center p-12 text-gray-800">
                        <div className="max-w-md space-y-8">
                            {/* Logo/Brand */}
                            {/*<div className="flex items-center gap-3">*/}
                            {/*    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">*/}
                            {/*        <div className="text-xl font-bold text-white">L</div>*/}
                            {/*    </div>*/}
                            {/*    <span className="text-xl font-bold text-gray-800">LearningHub</span>*/}
                            {/*</div>*/}

                            {/* Main heading */}
                            <div className="space-y-4">
                                <h1 className="text-5xl font-bold leading-tight text-gray-900">
                                    Onboarding<br />
                                    <span className="bg-gradient-to-r from-pink-600 to-cyan-500 bg-clip-text text-transparent">
                                        Handbook
                                    </span>
                                </h1>

                                <div className="flex items-center gap-2">
                                    <div className="h-0.5 w-12 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                                    <p className="text-xl font-medium text-gray-700">
                                        from the experts
                                    </p>
                                </div>
                            </div>



                            {/* Features list */}

                        </div>
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute inset-0 overflow-hidden">
                        {/* Floating dots */}
                        <div className="absolute top-32 right-32 h-2 w-2 rounded-full bg-blue-300 opacity-60"></div>
                        <div className="absolute bottom-40 left-40 h-3 w-3 rounded-full bg-cyan-300 opacity-40"></div>
                        <div className="absolute top-1/2 left-1/3 h-2 w-2 rounded-full bg-blue-400 opacity-50"></div>

                        {/* Decorative lines */}
                        <div className="absolute top-10 right-20 w-16 h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent"></div>
                        <div className="absolute bottom-16 left-32 w-24 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent"></div>
                    </div>
                </div>

                {/* Right side - Form */}
                <div className="flex flex-1 items-center justify-center p-6 md:p-10">
                    <div className="w-full max-w-md">
                        <div className="flex flex-col gap-8">
                            {/* Logo and Title Section */}
                            <div className="flex flex-col items-center gap-4">
                                <Link
                                    href={home()}
                                    className="group flex flex-col items-center gap-2 font-medium"
                                >
                                    <div className="mb-1 flex h-12 w-12 items-center justify-center rounded-lg transition-all group-hover:shadow-lg">
                                        <img src={'/favicon.png'} alt='logo'/>
                                    </div>
                                    <span className="sr-only">{title}</span>
                                </Link>

                                <div className="space-y-2 text-center">
                                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                                        {title}
                                    </h1>
                                    {description && (
                                        <p className="text-sm text-gray-600">
                                            {description}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Form Content */}
                            <div className="    ">
                                {children}
                            </div>

                            {/* Footer Links */}
                            <div className="text-center text-sm text-gray-600">
                                <p>
                                    By continuing, you agree to our{' '}
                                    <Link
                                        href="#"
                                        className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
                                    >
                                        Terms of Service
                                    </Link>{' '}
                                    and{' '}
                                    <Link
                                        href="#"
                                        className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
                                    >
                                        Privacy Policy
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
