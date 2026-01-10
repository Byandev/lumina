import { dashboard, login } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Shield,
    Lock,
    Sparkles,
    Users,
    CheckCircle,
    FileText,
    BarChart3,
    Workflow,
} from 'lucide-react';

export default function WelcomeHero() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="GENCYS - Onboarding Handbook">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=inter:400,500,600,700"
                    rel="stylesheet"
                />
            </Head>

            {/* Background Design Elements */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Gradient Orbs */}
                <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-r from-pink-400/20 to-blue-400/20 blur-3xl" />
                <div className="absolute -right-40 -bottom-40 h-80 w-80 rounded-full bg-gradient-to-r from-sky-400/20 to-purple-400/20 blur-3xl" />

                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:40px_40px] opacity-10" />

                {/* Floating Icons */}
                <div className="animate-float absolute top-1/4 left-1/4">
                    <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                        <Users className="h-8 w-8 text-blue-500/50" />
                    </div>
                </div>
                <div
                    className="animate-float absolute top-1/3 right-1/4"
                    style={{ animationDelay: '1s' }}
                >
                    <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                        <CheckCircle className="h-8 w-8 text-green-500/50" />
                    </div>
                </div>
                <div
                    className="animate-float absolute bottom-1/4 left-1/3"
                    style={{ animationDelay: '2s' }}
                >
                    <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                        <FileText className="h-8 w-8 text-purple-500/50" />
                    </div>
                </div>

                {/* Decorative Lines */}
                <div className="absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent via-pink-500/20 to-transparent" />
                <div className="absolute right-0 bottom-0 left-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
            </div>

            {/* Hero Section */}
            <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50/30 pt-16">
                <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-5xl text-center">
                        {/* Animated Badge */}
                        <div className="animate-fade-in mb-8 inline-flex items-center gap-2 rounded-full border border-gray-200/50 bg-white/50 px-6 py-3 shadow-lg backdrop-blur-sm">
                            <div className="flex items-center gap-2">
                                <Sparkles className="h-4 w-4 animate-pulse text-pink-500" />
                                <span className="bg-gradient-to-r from-pink-600 via-blue-600 to-sky-600 bg-clip-text text-sm font-semibold text-transparent">
                                    📘 OFFICIAL ONBOARDING HANDBOOK
                                </span>
                                <Sparkles className="h-4 w-4 animate-pulse text-blue-500" />
                            </div>
                        </div>

                        {/* Main Title with Animation */}
                        <h1 className="animate-slide-up mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                            Welcome to the
                            <span className="relative block">
                                <span className="relative z-10 bg-gradient-to-r from-pink-600 via-blue-600 to-sky-600 bg-clip-text text-transparent">
                                    GENCYS Partner Handbook
                                </span>
                                <span className="absolute -bottom-2 left-1/2 h-1 w-24 -translate-x-1/2 animate-pulse bg-gradient-to-r from-pink-500 to-blue-500" />
                            </span>
                        </h1>

                        {/* Description */}
                        <p
                            className="animate-fade-in mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-gray-700"
                            style={{ animationDelay: '0.2s' }}
                        >
                            Your comprehensive guide to seamless partner
                            integration. Follow our
                            <span className="font-semibold text-blue-600">
                                {' '}
                                step-by-step process
                            </span>
                            , track your progress with our
                            <span className="font-semibold text-pink-600">
                                {' '}
                                visual workflow
                            </span>
                            , and access all resources in one place.
                        </p>

                        {/* Stats Cards */}
                        <div
                            className="animate-fade-in mb-12 grid grid-cols-2 gap-4 sm:grid-cols-4"
                            style={{ animationDelay: '0.4s' }}
                        >
                            <div className="rounded-xl border border-gray-200/50 bg-white/50 p-4 backdrop-blur-sm">
                                <div className="text-2xl font-bold text-gray-900">
                                    21
                                </div>
                                <div className="text-sm text-gray-600">
                                    Onboarding Steps
                                </div>
                            </div>
                            <div className="rounded-xl border border-gray-200/50 bg-white/50 p-4 backdrop-blur-sm">
                                <div className="text-2xl font-bold text-gray-900">
                                    100%
                                </div>
                                <div className="text-sm text-gray-600">
                                    Success Rate
                                </div>
                            </div>
                            <div className="rounded-xl border border-gray-200/50 bg-white/50 p-4 backdrop-blur-sm">
                                <div className="text-2xl font-bold text-gray-900">
                                    24/7
                                </div>
                                <div className="text-sm text-gray-600">
                                    Support
                                </div>
                            </div>
                            <div className="rounded-xl border border-gray-200/50 bg-white/50 p-4 backdrop-blur-sm">
                                <div className="text-2xl font-bold text-gray-900">
                                    ✓
                                </div>
                                <div className="text-sm text-gray-600">
                                    Guided Process
                                </div>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div
                            className="animate-fade-in flex flex-col items-center justify-center gap-4 sm:flex-row"
                            style={{ animationDelay: '0.6s' }}
                        >
                            <a
                                href="/partnership-application"
                                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-pink-500 via-blue-500 to-sky-500 px-8 py-4 text-base font-semibold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                            >
                                <span className="relative z-10">
                                    Start Your Journey
                                </span>
                                <ArrowRight className="relative z-10 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-blue-600 to-sky-600 opacity-0 transition-opacity group-hover:opacity-100" />
                            </a>

                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="group relative inline-flex items-center gap-3 rounded-xl border-2 border-gray-300 bg-white px-8 py-4 text-base font-semibold text-gray-700 shadow-lg transition-all duration-200 hover:border-blue-400 hover:shadow-xl"
                                >
                                    <span className="relative z-10">
                                        Continue Dashboard
                                    </span>
                                    <Shield className="relative z-10 h-5 w-5 text-blue-500 transition-transform group-hover:scale-110" />
                                </Link>
                            ) : (
                                <Link
                                    href={login()}
                                    className="group relative inline-flex items-center gap-3 rounded-xl border-2 border-gray-300 bg-white px-8 py-4 text-base font-semibold text-gray-700 shadow-lg transition-all duration-200 hover:border-blue-400 hover:shadow-xl"
                                >
                                    <span className="relative z-10">
                                        Access Handbook
                                    </span>
                                    <Lock className="relative z-10 h-5 w-5 text-gray-500 transition-transform group-hover:scale-110" />
                                </Link>
                            )}
                        </div>

                        {/* Quick Access Links */}
                        <div
                            className="animate-fade-in mt-12"
                            style={{ animationDelay: '0.8s' }}
                        >
                            <p className="mb-4 text-sm font-medium text-gray-600">
                                Quick Access:
                            </p>
                            <div className="flex flex-wrap justify-center gap-3">
                                <a
                                    href="#workflow"
                                    className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100"
                                >
                                    <Workflow className="h-4 w-4" />
                                    View Workflow
                                </a>
                                <a
                                    href="#resources"
                                    className="inline-flex items-center gap-2 rounded-full bg-pink-50 px-4 py-2 text-sm font-medium text-pink-600 transition-colors hover:bg-pink-100"
                                >
                                    <FileText className="h-4 w-4" />
                                    Resources
                                </a>
                                <a
                                    href="#progress"
                                    className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-4 py-2 text-sm font-medium text-sky-600 transition-colors hover:bg-sky-100"
                                >
                                    <BarChart3 className="h-4 w-4" />
                                    Track Progress
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                    <div className="h-8 w-px bg-gradient-to-b from-blue-500 to-transparent" />
                </div>
            </section>

            {/* Add CSS animations */}
            <style jsx>{`
                @keyframes float {
                    0%,
                    100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-20px);
                    }
                }
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes slide-up {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                .animate-fade-in {
                    animation: fade-in 0.8s ease-out forwards;
                }
                .animate-slide-up {
                    animation: slide-up 0.8s ease-out forwards;
                }
            `}</style>
        </>
    );
}
