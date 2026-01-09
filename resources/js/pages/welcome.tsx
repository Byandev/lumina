import { dashboard, login } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    BarChart3,
    Building2,
    CreditCard,
    FileText,
    Globe,
    Lock,
    Mail,
    Phone,
    Workflow,
    Shield,
    Sparkles,
    Users,
    LayoutDashboard,
    CalendarCheck,
    CalendarDays,
} from 'lucide-react';
import { useState } from 'react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


    const features = [
        {
            icon: Workflow,
            title: 'Onboarding Workflow',
            description:
                '21-step visual onboarding tracker including ERP setup requests, Discord access, and Exponential University grants.',
            color: 'from-pink-500 to-rose-500',
        },
        {
            icon: LayoutDashboard,
            title: 'Company Dashboard',
            description:
                'Centralized company profile with onboarding statistics, status tags (Active, Inactive, Terminated), and sponsor & sales activity tracking.',
            color: 'from-blue-500 to-cyan-500',
        },
        {
            icon: CalendarCheck,
            title: 'Attendance & Performance',
            description:
                'Track Partner Summit and Learning Session attendance with Present, Late, and Absent records, plus ongoing performance logs.',
            color: 'from-indigo-500 to-blue-500',
        },
        {
            icon: CalendarDays,
            title: 'Event Management',
            description:
                'Create, edit, and delete events, assign them to multiple companies, and view company-specific attendance records.',
            color: 'from-sky-500 to-blue-500',
        },
        {
            icon: BarChart3,
            title: 'Performance Analytics',
            description:
                'Insightful dashboards for monitoring partner engagement, attendance trends, and overall performance metrics.',
            color: 'from-purple-500 to-pink-500',
        },
        {
            icon: Shield,
            title: 'Security & Compliance',
            description:
                'Enterprise-grade security with audit trails, role-based access control, and compliance-ready reporting.',
            color: 'from-violet-500 to-purple-500',
        },
    ];


    return (
        <>
            <Head title="LUMINA - Partner Management System">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=inter:400,500,600,700"
                    rel="stylesheet"
                />
            </Head>

            <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/50 to-blue-50/30">
                {/* Professional Header */}
                <header className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-sm">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            {/* Logo */}
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-pink-100 via-blue-100 to-sky-100">
                                    <img
                                        src={'/favicon.png'}
                                        alt="logo"
                                        className="h-8"
                                    />
                                </div>
                                <div>
                                    <h1 className="bg-gradient-to-r from-pink-600 via-blue-600 to-sky-600 bg-clip-text text-lg font-bold text-transparent">
                                        GENCYS
                                    </h1>
                                    <p className="text-[10px] font-medium tracking-wider text-gray-500">
                                        ONBOARDING HANDBOOK
                                    </p>
                                </div>
                            </div>

                            {/* Desktop Navigation */}
                            <nav className="hidden items-center gap-6 md:flex">
                                <a
                                    href="#features"
                                    className="text-sm font-medium text-gray-700 hover:text-gray-900"
                                >
                                    Features
                                </a>
                                <a
                                    href="#contact"
                                    className="text-sm font-medium text-gray-700 hover:text-gray-900"
                                >
                                    Contact
                                </a>
                                {auth.user ? (
                                    <Link
                                        href={dashboard()}
                                        className="ml-4 rounded-lg bg-gradient-to-r from-pink-500 via-blue-500 to-sky-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <Link
                                        href={login()}
                                        className="ml-4 rounded-lg bg-gradient-to-r from-pink-500 via-blue-500 to-sky-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md"
                                    >
                                        Admin Login
                                    </Link>
                                )}
                            </nav>

                            {/* Mobile menu button */}
                            <button
                                onClick={() =>
                                    setMobileMenuOpen(!mobileMenuOpen)
                                }
                                className="rounded-lg p-2 hover:bg-gray-100 md:hidden"
                            >
                                <svg
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    {mobileMenuOpen ? (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    ) : (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    {mobileMenuOpen && (
                        <div className="border-t border-gray-200 bg-white md:hidden">
                            <div className="space-y-1 px-4 py-3">
                                <a
                                    href="#features"
                                    className="block rounded-lg px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Features
                                </a>
                                <a
                                    href="#contact"
                                    className="block rounded-lg px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Contact
                                </a>
                                {auth.user ? (
                                    <Link
                                        href={dashboard()}
                                        className="mt-2 block rounded-lg bg-gradient-to-r from-pink-500 via-blue-500 to-sky-500 px-3 py-2.5 text-center text-base font-semibold text-white"
                                    >
                                        Go to Dashboard
                                    </Link>
                                ) : (
                                    <Link
                                        href={login()}
                                        className="mt-2 block rounded-lg bg-gradient-to-r from-pink-500 via-blue-500 to-sky-500 px-3 py-2.5 text-center text-base font-semibold text-white"
                                    >
                                        Admin Login
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}
                </header>

                {/* Hero Section */}
                <section className="flex h-screen items-center justify-center">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-5xl">
                            <div className="text-center">
                                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gradient-to-r from-pink-50 via-blue-50 to-sky-50 px-4 py-2">
                                    <div className="h-2 w-2 rounded-full bg-gradient-to-r from-pink-500 to-blue-500"></div>
                                    <span className="bg-gradient-to-r from-pink-600 via-blue-600 to-sky-600 bg-clip-text text-sm font-medium text-transparent">
                                        Enterprise Partner Management Platform
                                    </span>
                                </div>

                                <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                                    Streamline Your
                                    <span className="block bg-gradient-to-r from-pink-600 via-blue-600 to-sky-600 bg-clip-text text-transparent">
                                        Onboarding Process
                                    </span>
                                </h1>

                                <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-600">
                                    A comprehensive platform for managing
                                    partner onboarding, tracking performance,
                                    and automating administrative workflows for
                                    enterprise partnerships.
                                </p>

                                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                                    <a
                                        href="/partnership-application"
                                        className="inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-pink-500 via-blue-500 to-sky-500 px-8 py-4 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
                                    >
                                        Apply for Partnership
                                        <ArrowRight className="h-5 w-5" />
                                    </a>

                                    {auth.user ? (
                                        <Link
                                            href={dashboard()}
                                            className="inline-flex items-center gap-3 rounded-xl border-2 border-gray-300 bg-white px-8 py-4 text-base font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:border-gray-400"
                                        >
                                            Go to Admin Dashboard
                                            <Shield className="h-5 w-5" />
                                        </Link>
                                    ) : (
                                        <Link
                                            href={login()}
                                            className="inline-flex items-center gap-3 rounded-xl border-2 border-gray-300 bg-white px-8 py-4 text-base font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:border-gray-400"
                                        >
                                            Admin Login
                                            <Lock className="h-5 w-5" />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="bg-white py-16">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto mb-12 max-w-4xl text-center">
                            <h2 className="mb-4 text-3xl font-bold text-gray-900">
                                Comprehensive Partner
                                <span className="block bg-gradient-to-r from-pink-600 via-blue-600 to-sky-600 bg-clip-text text-transparent">
                                    Management Features
                                </span>
                            </h2>
                            <p className="text-lg text-gray-600">
                                Everything you need to efficiently manage your
                                partner network
                            </p>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                                >
                                    <div
                                        className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r ${feature.color}`}
                                    >
                                        <feature.icon className="h-6 w-6 text-white" />
                                    </div>

                                    <h3 className="mb-3 text-xl font-semibold text-gray-900">
                                        {feature.title}
                                    </h3>

                                    <p className="mb-4 text-gray-600">
                                        {feature.description}
                                    </p>

                                    <div className="text-xs font-medium text-gray-500">
                                        <span className="transition-colors group-hover:text-blue-600">
                                            Learn more →
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Simple Partnership CTA */}
                <section className="bg-gradient-to-br from-pink-50 via-blue-50 to-sky-50 py-20">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-3xl text-center">

                            <h2 className="mb-4 text-3xl font-bold text-gray-900">
                                Ready to Become a Partner?
                            </h2>

                            <p className="mb-8 text-lg text-gray-600">
                                Complete our partnership application form to
                                start your journey with GENCYS. Our streamlined
                                process makes it easy to apply.
                            </p>

                            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                                <a
                                    href="/partnership-application"
                                    className="inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-pink-500 via-blue-500 to-sky-500 px-8 py-4 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
                                >
                                    Start Partnership Application
                                    <ArrowRight className="h-5 w-5" />
                                </a>
                            </div>

                            <p className="mt-6 text-sm text-gray-500">
                                Average approval time: 3-5 business days
                            </p>
                        </div>
                    </div>
                </section>

                {/* Contact & Support */}
                <section
                    id="contact"
                    className="border-t border-gray-200 bg-white py-16"
                >
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-4xl">
                            <div className="mb-12 text-center">
                                <h3 className="mb-4 text-2xl font-bold text-gray-900">
                                    Need Assistance?
                                </h3>
                                <p className="text-gray-600">
                                    Our support team is here to help you with
                                    any questions
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                <div className="rounded-xl border border-gray-200 p-6 text-center">
                                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-pink-100">
                                        <Mail className="h-6 w-6 text-pink-600" />
                                    </div>
                                    <h4 className="mb-2 font-semibold text-gray-900">
                                        Email Support
                                    </h4>
                                    <p className="mb-3 text-sm text-gray-600">
                                        For general inquiries
                                    </p>
                                    <a
                                        href="mailto:support@luminapartners.com"
                                        className="text-sm font-medium text-blue-600 hover:text-blue-700"
                                    >
                                        support@luminapartners.com
                                    </a>
                                </div>

                                <div className="rounded-xl border border-gray-200 p-6 text-center">
                                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                                        <Phone className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <h4 className="mb-2 font-semibold text-gray-900">
                                        Phone Support
                                    </h4>
                                    <p className="mb-3 text-sm text-gray-600">
                                        Mon-Fri, 9AM-6PM EST
                                    </p>
                                    <a
                                        href="tel:+18005551234"
                                        className="text-sm font-medium text-blue-600 hover:text-blue-700"
                                    >
                                        +1 (800) 555-1234
                                    </a>
                                </div>

                                <div className="rounded-xl border border-gray-200 p-6 text-center">
                                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-sky-100">
                                        <Globe className="h-6 w-6 text-sky-600" />
                                    </div>
                                    <h4 className="mb-2 font-semibold text-gray-900">
                                        Admin Support
                                    </h4>
                                    <p className="mb-3 text-sm text-gray-600">
                                        For existing partners
                                    </p>
                                    <Link
                                        href={login()}
                                        className="text-sm font-medium text-blue-600 hover:text-blue-700"
                                    >
                                        Login to Admin Portal
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-gray-200 bg-gray-50 py-12">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                            <div>
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 via-blue-500 to-sky-500">
                                        <Sparkles className="h-4 w-4 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="bg-gradient-to-r from-pink-600 via-blue-600 to-sky-600 bg-clip-text font-bold text-transparent">
                                            GENSYS
                                        </h3>
                                        <p className="text-[10px] font-medium text-gray-500">
                                            Onboarding Handbook
                                        </p>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600">
                                    Enterprise partner management platform for
                                    modern businesses.
                                </p>
                            </div>

                            <div>
                                <h4 className="mb-4 font-semibold text-gray-900">
                                    Platform
                                </h4>
                                <ul className="space-y-2">
                                    <li>
                                        <a
                                            href="#features"
                                            className="text-sm text-gray-600 hover:text-gray-900"
                                        >
                                            Features
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="/partnership-application"
                                            className="text-sm text-gray-600 hover:text-gray-900"
                                        >
                                            Partnership Application
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="text-sm text-gray-600 hover:text-gray-900"
                                        >
                                            Pricing
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="text-sm text-gray-600 hover:text-gray-900"
                                        >
                                            Security
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="mb-4 font-semibold text-gray-900">
                                    Company
                                </h4>
                                <ul className="space-y-2">
                                    <li>
                                        <a
                                            href="#"
                                            className="text-sm text-gray-600 hover:text-gray-900"
                                        >
                                            About Us
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="text-sm text-gray-600 hover:text-gray-900"
                                        >
                                            Careers
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="text-sm text-gray-600 hover:text-gray-900"
                                        >
                                            Blog
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="text-sm text-gray-600 hover:text-gray-900"
                                        >
                                            Press
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="mb-4 font-semibold text-gray-900">
                                    Legal
                                </h4>
                                <ul className="space-y-2">
                                    <li>
                                        <a
                                            href="#"
                                            className="text-sm text-gray-600 hover:text-gray-900"
                                        >
                                            Privacy Policy
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="text-sm text-gray-600 hover:text-gray-900"
                                        >
                                            Terms of Service
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="text-sm text-gray-600 hover:text-gray-900"
                                        >
                                            Cookie Policy
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#contact"
                                            className="text-sm text-gray-600 hover:text-gray-900"
                                        >
                                            Contact
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-8 border-t border-gray-300/50 pt-8 text-center">
                            <p className="text-sm text-gray-500">
                                © {new Date().getFullYear()} LUMINA Partner
                                Management System. All rights reserved.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
