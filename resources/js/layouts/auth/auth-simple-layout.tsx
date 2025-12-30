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
    imageSrc = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    imageAlt = 'Authentication background',
    imagePosition = 'left',
}: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="flex min-h-svh bg-background">
            {/* Left side - Image */}
            <div className="relative hidden overflow-hidden lg:flex lg:w-1/2">
                {/* Gradient overlay */}
                <div className="absolute inset-0 z-10 bg-gradient-to-r from-pink-400 via-violet-400 to-cyan-400" />

                {/* Shooting stars container */}
                <div className="absolute inset-0 z-[5] overflow-hidden">
                    {/* Multiple shooting stars with Tailwind animations */}
                    <div className="absolute top-0 right-0 w-24 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_6px_rgba(255,255,255,0.7)] animate-shooting-star rotate-45"></div>
                    <div className="absolute top-0 right-0 w-20 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_6px_rgba(255,255,255,0.7)] animate-shooting-star-delayed-1 rotate-30"></div>
                    <div className="absolute top-0 right-0 w-16 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_6px_rgba(255,255,255,0.7)] animate-shooting-star-delayed-2 rotate-60"></div>
                    <div className="absolute top-0 right-0 w-18 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_6px_rgba(255,255,255,0.7)] animate-shooting-star-delayed-3 rotate-50"></div>
                </div>


                {/* Optional overlay content on image */}
                <div className="absolute inset-0 z-20 flex items-end p-10">
                    <div className="text-white">
                        <blockquote className="text-xl font-medium">
                            "This application has transformed our workflow completely."
                        </blockquote>
                        <p className="mt-2 text-sm text-white/80">
                            - Sarah Johnson, CEO
                        </p>
                    </div>
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
                                <div className="mb-1 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                                    <AppLogoIcon className="size-8 fill-current text-primary" />
                                </div>
                                <span className="sr-only">{title}</span>
                            </Link>

                            <div className="space-y-2 text-center">
                                <h1 className="text-2xl font-bold tracking-tight">
                                    {title}
                                </h1>
                                {description && (
                                    <p className="text-sm text-muted-foreground">
                                        {description}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Form Content */}
                        <div className="rounded-lg border bg-card p-6 shadow-sm">
                            {children}
                        </div>

                        {/* Footer Links */}
                        <div className="text-center text-sm text-muted-foreground">
                            <p>
                                By continuing, you agree to our{' '}
                                <Link
                                    href="#"
                                    className="underline underline-offset-4 hover:text-primary"
                                >
                                    Terms of Service
                                </Link>{' '}
                                and{' '}
                                <Link
                                    href="#"
                                    className="underline underline-offset-4 hover:text-primary"
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
