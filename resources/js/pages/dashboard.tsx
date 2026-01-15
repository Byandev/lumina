import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import {
    BarChart3,
    Building2,
    Calendar,
    CheckCircle,
    ChevronRight,
    Clock,
    DollarSign,
    FileCheck,
    Filter,
    Star,
    Target,
    TrendingDown,
    TrendingUp,
    Users,
    Zap,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart,
    Dot,
} from 'recharts';

interface DashboardProps {
    stats: {
        total_companies: number;
        active_companies: number;
        new_companies: number;
        pending_notarization: number;
        total_users: number;
        onboarding_rate: number;
        coach_companies: number;
    };
    growth: {
        current: number;
        previous: number;
        change: number | null; // null means: "New" (previous=0 baseline)
        // Optional from improved controller; safe if missing
        current_range?: { start: string; end: string };
        previous_range?: { start: string; end: string };
    };
    recentCompanies: Array<{
        id: number;
        name: string;
        status: string;
        level: string;
        created_at: string;
        coach?: { id: number; name: string };
    }>;
    recentPerformance: Array<{
        id: number;
        company: { id: number; name: string };
        roas: number | string;
        rts: number | string;
        avg_ads_spent: number | string;
        phase: string;
        created_at: string;
    }>;
    statusDistribution: Record<string, number>;
    levelDistribution: Array<{ level: string; count: number }>;
    salesDistribution: Array<{ sales_activity: string; count: number }>;
    topPerformers: Array<{
        company: { id: number; name: string; level: string };
        avg_roas: number | string;
        max_roas: number | string;
    }>;
    timeSeriesData: Array<{ label: string; date: string; count: number }>;
    timeRange: string;
    userRole: string;
}

const TIME_RANGES = ['week', 'month', 'quarter', 'year'] as const;
const STATUS_ORDER = ['active', 'inactive', 'terminated', 'pending'] as const;

// Updated colors for pink-blue-sky theme
const statusColors: Record<string, string> = {
    active: 'bg-gradient-to-r from-pink-100 to-blue-100 text-pink-800 border border-pink-200',
    inactive: 'bg-gray-100 text-gray-800 border  border-gray-100',
    terminated: 'bg-gradient-to-r from-pink-100 via-red-50 to-blue-50 text-red-800 border border-red-200',
    pending: 'bg-gradient-to-r from-yellow-100 to-pink-50 text-yellow-800 border border-yellow-200',
};

const levelColors: Record<string, string> = {
    educate: 'text-pink-700 bg-gradient-to-r from-pink-50 to-blue-50 border border-pink-200',
    empowerment: 'text-purple-700 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200',
    enterprise: 'text-blue-700 bg-gradient-to-r from-blue-50 to-sky-50 border border-blue-200',
    exponential: 'text-sky-700 bg-gradient-to-r from-sky-50 to-pink-50 border border-sky-200',
};

// Theme colors for consistent styling
const themeColors = {
    primary: {
        gradient: 'bg-gradient-to-r from-pink-500 via-blue-500 to-sky-500',
        text: 'text-pink-600',
        bg: 'bg-pink-50',
        border: 'border-pink-200',
    },
    secondary: {
        gradient: 'bg-gradient-to-r from-blue-500 to-sky-500',
        text: 'text-blue-600',
        bg: 'bg-blue-50',
        border: 'border-blue-200',
    },
    accent: {
        gradient: 'bg-gradient-to-r from-sky-500 to-pink-400',
        text: 'text-sky-600',
        bg: 'bg-sky-50',
        border: 'border-sky-200',
    }
};

const toNumber = (v: number | string | null | undefined) => {
    const n = typeof v === 'string' ? Number(v) : v ?? 0;
    return Number.isFinite(n) ? n : 0;
};

const formatCompact = (n: number) => n.toLocaleString();
const formatMoney = (n: number) =>
    n.toLocaleString('en-PH', { maximumFractionDigits: 0 });

const titleCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-lg border  border-gray-100 bg-white/95 p-3 shadow-lg backdrop-blur-sm">
                <p className="text-xs font-medium text-gray-900">{label}</p>
                <p className="mt-1 text-sm font-bold text-pink-600">
                    {payload[0].value} companies
                </p>
            </div>
        );
    }
    return null;
};

// Custom Dot Component
const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    return (
        <g>
            <circle
                cx={cx}
                cy={cy}
                r={4}
                fill="white"
                stroke="url(#lineGradient)"
                strokeWidth={2}
                className="transition-all hover:r-5"
            />
            <circle
                cx={cx}
                cy={cy}
                r={6}
                fill="url(#lineGradient)"
                fillOpacity={0.2}
                className="transition-all"
            />
        </g>
    );
};

// Custom Active Dot Component
const CustomActiveDot = (props: any) => {
    const { cx, cy } = props;
    return (
        <g>
            <circle
                cx={cx}
                cy={cy}
                r={5}
                fill="white"
                stroke="url(#lineGradient)"
                strokeWidth={3}
            />
            <circle
                cx={cx}
                cy={cy}
                r={8}
                fill="url(#lineGradient)"
                fillOpacity={0.3}
            />
        </g>
    );
};

// Line Chart Component using recharts
const GrowthLineChart = ({
                             data
                         }: {
    data: Array<{ label: string; date: string; count: number }>;
}) => {
    // Transform data for recharts
    const chartData = data.map(item => ({
        name: item.label,
        companies: item.count,
        date: item.date,
    }));

    return (
        <div className="h-40 w-full sm:h-44">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#EC4899" stopOpacity={0.2} />
                            <stop offset="50%" stopColor="#3B82F6" stopOpacity={0.15} />
                            <stop offset="100%" stopColor="#0EA5E9" stopOpacity={0.1} />
                        </linearGradient>
                        <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#EC4899" />
                            <stop offset="50%" stopColor="#3B82F6" />
                            <stop offset="100%" stopColor="#0EA5E9" />
                        </linearGradient>
                    </defs>

                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#F1F5F9"
                        vertical={false}
                        strokeWidth={0.5}
                    />

                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: '#6B7280' }}
                        padding={{ left: 10, right: 10 }}
                    />

                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: '#6B7280' }}
                        width={30}
                        tickFormatter={(value) => formatCompact(value)}
                    />

                    <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ stroke: '#CBD5E1', strokeWidth: 1, strokeDasharray: '3 3' }}
                    />

                    <Area
                        type="monotone"
                        dataKey="companies"
                        stroke="url(#lineGradient)"
                        strokeWidth={2}
                        fill="url(#areaGradient)"
                        fillOpacity={1}
                        dot={<CustomDot />}
                        activeDot={<CustomActiveDot />}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default function Dashboard({
                                      stats,
                                      growth,
                                      recentCompanies,
                                      recentPerformance,
                                      statusDistribution,
                                      levelDistribution,
                                      salesDistribution,
                                      topPerformers,
                                      timeSeriesData,
                                      timeRange,
                                      userRole,
                                  }: DashboardProps) {
    const [selectedRange, setSelectedRange] = useState(timeRange);

    const handleTimeRangeChange = (range: string) => {
        setSelectedRange(range);
        router.get(
            '/dashboard',
            { time_range: range },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const formatDate = (dateString: string) => {
        // Handles "YYYY-MM-DD HH:mm:ss" and ISO formats more safely
        const normalized = dateString.includes(' ')
            ? dateString.replace(' ', 'T')
            : dateString;
        const d = new Date(normalized);
        return Number.isNaN(d.getTime())
            ? dateString
            : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const getStatusBadge = (status: string) => (
        <span
            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${
                statusColors[status] ?? 'bg-gray-100 text-gray-800  border-gray-100'
            }`}
        >
            {titleCase(status)}
        </span>
    );

    const getLevelBadge = (level: string) => (
        <span
            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${
                levelColors[level] ?? 'bg-gray-100 text-gray-800  border-gray-100'
            }`}
        >
            {titleCase(level)}
        </span>
    );

    const maxCount = useMemo(
        () => Math.max(...timeSeriesData.map((d) => d.count), 1),
        [timeSeriesData],
    );

    const growthUI = useMemo(() => {
        if (growth.change === null) {
            return {
                label: 'New',
                className: 'text-sky-600',
                Icon: TrendingUp,
                tooltip: 'No companies in previous period (no baseline).',
            };
        }

        const isUp = growth.change >= 0;
        return {
            label: `${Math.abs(growth.change)}%`,
            className: isUp ? 'text-blue-600' : 'text-pink-600',
            Icon: isUp ? TrendingUp : TrendingDown,
            tooltip: `Current: ${growth.current}, Previous: ${growth.previous}`,
        };
    }, [growth.change, growth.current, growth.previous]);

    const orderedStatus = useMemo(() => {
        // stable ordering; include unknown statuses at the end
        const known = STATUS_ORDER.map((s) => [s, statusDistribution[s] ?? 0] as const);
        const unknown = Object.entries(statusDistribution).filter(
            ([k]) => !STATUS_ORDER.includes(k as any),
        );
        return [...known, ...unknown].filter(([, count]) => (count ?? 0) > 0);
    }, [statusDistribution]);

    const generatingSalesCount = useMemo(() => {
        return salesDistribution.find((s) => s.sales_activity === 'generating')?.count ?? 0;
    }, [salesDistribution]);

    const selectedRangeLabel = useMemo(() => titleCase(selectedRange), [selectedRange]);

    // Small UI components
    const StatCard = ({
                          title,
                          value,
                          subtitle,
                          icon,
                          rightSlot,
                      }: {
        title: string;
        value: React.ReactNode;
        subtitle?: React.ReactNode;
        icon: React.ReactNode;
        rightSlot?: React.ReactNode;
    }) => (
        <div className="rounded-xl border border-gray-100 bg-white p-3 sm:p-4">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-600 sm:text-sm">{title}</p>
                    <p className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">{value}</p>
                    {subtitle ? <div className="mt-1">{subtitle}</div> : null}
                </div>

                <div className="flex items-center gap-2">
                    {rightSlot}
                    <div className="rounded-lg bg-gradient-to-br from-pink-50 to-blue-50 p-2">{icon}</div>
                </div>
            </div>
        </div>
    );

    return (
        <AppLayout>
            <Head title="Dashboard" />

            <div className="min-h-screen     p-4 md:py-6">
                {/* Header */}
                <div className="mb-4 sm:mb-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-large md:text-xl font-bold text-gray-900">
                                Dashboard
                            </h1>
                            <p className="text-xs text-gray-600 sm:text-sm">
                                Company performance overview
                            </p>
                        </div>

                        {/* Time Range Filter */}
                        <div className="flex items-center gap-2">
                            <div className="flex rounded-lg border  border-gray-100 bg-white p-0.5  sm:p-1">
                                {TIME_RANGES.map((range) => (
                                    <button
                                        key={range}
                                        onClick={() => handleTimeRangeChange(range)}
                                        className={`rounded-md px-2 py-1 text-[10px] font-medium transition-all sm:px-3 sm:py-1.5 sm:text-xs ${
                                            selectedRange === range
                                                ? `${themeColors.primary.gradient} text-white  `
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        {titleCase(range)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="mb-4 grid grid-cols-2 gap-3 sm:mb-6 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
                    <StatCard
                        title="Total Companies"
                        value={formatCompact(stats.total_companies)}
                        subtitle={
                            <div className="flex items-center gap-1 text-[10px] sm:text-xs">
                                <span className="text-gray-500">Growth:</span>
                                <div
                                    className={`flex items-center ${growthUI.className}`}
                                    title={growthUI.tooltip}
                                >
                                    <growthUI.Icon className="h-3 w-3" />
                                    <span>{growthUI.label}</span>
                                </div>
                            </div>
                        }
                        icon={<Building2 className="h-4 w-4 text-pink-600 sm:h-5 sm:w-5" />}
                    />

                    <StatCard
                        title="Active Companies"
                        value={formatCompact(stats.active_companies)}
                        subtitle={
                            <div className="mt-1 text-[10px] text-gray-500 sm:text-xs">
                                {stats.total_companies > 0
                                    ? `${(
                                        (stats.active_companies / stats.total_companies) *
                                        100
                                    ).toFixed(1)}% of total`
                                    : '0.0% of total'}
                            </div>
                        }
                        icon={<CheckCircle className="h-4 w-4 text-blue-600 sm:h-5 sm:w-5" />}
                    />

                    <StatCard
                        title={`New This ${selectedRangeLabel}`}
                        value={formatCompact(stats.new_companies)}
                        subtitle={
                            <div className="mt-1 flex items-center gap-1 text-[10px] text-gray-500 sm:text-xs">
                                <Calendar className="h-3 w-3" />
                                <span>
                                    {timeSeriesData[timeSeriesData.length - 1]?.date ?? 'Current'}
                                </span>
                            </div>
                        }
                        icon={<TrendingUp className="h-4 w-4 text-sky-600 sm:h-5 sm:w-5" />}
                    />

                    <StatCard
                        title="Onboarding Rate"
                        value={`${stats.onboarding_rate}%`}
                        subtitle={<div className="mt-1 text-[10px] text-gray-500 sm:text-xs">Checklist completion</div>}
                        icon={<FileCheck className="h-4 w-4 text-purple-600 sm:h-5 sm:w-5" />}
                    />
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
                    {/* Left */}
                    <div className="space-y-4 sm:space-y-6 lg:col-span-2">
                        {/* Growth Chart - Using shadcn/recharts Line Chart */}
                        <div className="rounded-xl border  border-gray-100 bg-white p-3   sm:p-4">
                            <div className="mb-3 flex items-center justify-between sm:mb-4">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900">
                                        Company Growth
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        New registrations over time
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="hidden items-center gap-1 text-xs text-gray-500 sm:flex">
                                        <div className="h-2 w-2 rounded-full bg-gradient-to-r from-pink-500 to-blue-500"></div>
                                        <span>Registrations</span>
                                    </div>
                                    <BarChart3 className="h-4 w-4 text-gray-500" />
                                </div>
                            </div>

                            {/* Recharts Line Chart */}
                            <GrowthLineChart data={timeSeriesData} />

                            <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-gradient-to-r from-pink-500 to-blue-500 sm:hidden"></div>
                                    <span>Total in range: <span className="font-medium text-gray-800">{growth.current}</span></span>
                                </div>
                                <div className="text-right">
                                    <span className="hidden sm:inline">Hover over chart for details</span>
                                    <span className="sm:hidden">Tap points for details</span>
                                </div>
                            </div>
                        </div>

                        {/* Recent Companies */}
                        <div className="rounded-xl border  border-gray-100 bg-white p-3   sm:p-4">
                            <div className="mb-3 flex items-center justify-between sm:mb-4">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900">
                                        Recent Companies
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        Latest registrations
                                    </p>
                                </div>
                                <Link
                                    href="/companies"
                                    className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800"
                                >
                                    <span className="hidden sm:inline">View all</span>
                                    <span className="sm:hidden">All</span>
                                    <ChevronRight className="h-3 w-3" />
                                </Link>
                            </div>

                            <div className="space-y-2 sm:space-y-3">
                                {recentCompanies.length === 0 ? (
                                    <div className="rounded-lg border border-dashed  border-gray-100 p-3 text-sm text-gray-600 sm:p-4">
                                        No recent companies found for this range.
                                    </div>
                                ) : (
                                    recentCompanies.map((company) => (
                                        <div
                                            key={company.id}
                                            className="flex items-center justify-between rounded-lg border border-gray-100 p-2 transition hover:bg-gray-50 sm:p-3"
                                        >
                                            <div className="flex items-center gap-2 sm:gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-pink-100 to-blue-100 sm:h-9 sm:w-9">
                                                    <Building2 className="h-3 w-3 text-pink-700 sm:h-4 sm:w-4" />
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                                                        <p className="max-w-[120px] truncate text-sm font-medium text-gray-900 sm:max-w-none">
                                                            {company.name}
                                                        </p>
                                                        <div className="hidden sm:block">{getStatusBadge(company.status)}</div>
                                                    </div>
                                                    <div className="mt-0.5 flex flex-wrap items-center gap-1 sm:mt-1 sm:gap-2">
                                                        <div className="hidden sm:block">{getLevelBadge(company.level)}</div>
                                                        <div className="sm:hidden">
                                                            <span className="text-xs text-gray-500">{titleCase(company.level)}</span>
                                                        </div>
                                                        <span className="text-[10px] text-gray-500 sm:text-xs">
                                                            {formatDate(company.created_at)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {company.coach && (
                                                <div className="hidden text-right sm:block">
                                                    <div className="text-xs text-gray-500">Coach</div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {company.coach.name}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right */}
                    <div className="space-y-4 sm:space-y-6">
                        {/* Status Distribution */}
                        <div className="rounded-xl border  border-gray-100 bg-white p-3   sm:p-4">
                            <h3 className="mb-2 text-sm font-semibold text-gray-900 sm:mb-3">
                                Status Distribution
                            </h3>

                            {orderedStatus.length === 0 ? (
                                <div className="rounded-lg border border-dashed  border-gray-100 p-3 text-sm text-gray-600 sm:p-4">
                                    No status data available.
                                </div>
                            ) : (
                                <div className="space-y-1.5 sm:space-y-2">
                                    {orderedStatus.map(([status, count]) => (
                                        <div
                                            key={status}
                                            className="flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className={`h-2 w-2 rounded-full ${
                                                        status === 'active'
                                                            ? 'bg-gradient-to-r from-pink-500 to-blue-500'
                                                            : status === 'inactive'
                                                                ? 'bg-gray-500'
                                                                : status === 'terminated'
                                                                    ? 'bg-gradient-to-r from-pink-400 via-red-400 to-blue-400'
                                                                    : 'bg-gradient-to-r from-yellow-500 to-pink-400'
                                                    }`}
                                                />
                                                <span className="text-xs text-gray-700 capitalize">
                                                    {status}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-1 sm:gap-2">
                                                <span className="text-sm font-medium text-gray-900">
                                                    {count}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    (
                                                    {stats.total_companies > 0
                                                        ? `${((count / stats.total_companies) * 100).toFixed(1)}%`
                                                        : '0.0%'}
                                                    )
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Top Performers */}
                        <div className="rounded-xl border  border-gray-100 bg-white p-3   sm:p-4">
                            <div className="mb-2 flex items-center justify-between sm:mb-3">
                                <h3 className="text-sm font-semibold text-gray-900">
                                    Top Performers
                                </h3>
                                <Star className="h-4 w-4 text-yellow-500" />
                            </div>

                            {topPerformers.length === 0 ? (
                                <div className="rounded-lg border border-dashed  border-gray-100 p-3 text-sm text-gray-600 sm:p-4">
                                    No performance data available.
                                </div>
                            ) : (
                                <div className="space-y-2 sm:space-y-3">
                                    {topPerformers.map((performer, index) => {
                                        const avg = toNumber(performer.avg_roas);
                                        const max = toNumber(performer.max_roas);
                                        const progress = Math.min(avg * 10, 100);

                                        return (
                                            <div
                                                key={performer.company.id}
                                                className="space-y-1.5 sm:space-y-2"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-1.5 sm:gap-2">
                                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-pink-50 to-blue-50 sm:h-7 sm:w-7">
                                                            <span className="text-[10px] font-bold text-pink-700 sm:text-xs">
                                                                #{index + 1}
                                                            </span>
                                                        </div>
                                                        <div className="min-w-0 max-w-[100px] sm:max-w-none">
                                                            <p className="truncate text-sm font-medium text-gray-900">
                                                                {performer.company.name}
                                                            </p>
                                                            <div className="text-[10px] text-gray-500 sm:text-xs">
                                                                {titleCase(performer.company.level)}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="text-right">
                                                        <div className="text-sm font-bold text-blue-700">
                                                            {avg.toFixed(1)}x
                                                        </div>
                                                        <div className="text-[10px] text-gray-500 sm:text-xs">
                                                            Avg ROAS
                                                            {max > 0 ? ` • Max ${max.toFixed(1)}x` : ''}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                                                    <div
                                                        className="h-full rounded-full bg-gradient-to-r from-pink-400 via-blue-400 to-sky-400"
                                                        style={{ width: `${progress}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Quick Stats */}
                        <div className="rounded-xl border  border-gray-100 bg-white p-3   sm:p-4">
                            <h3 className="mb-2 text-sm font-semibold text-gray-900 sm:mb-3">
                                Quick Stats
                            </h3>
                            <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                <div className="rounded-lg border border-gray-100 p-2 sm:p-3">
                                    <div className="flex items-center gap-1.5 sm:gap-2">
                                        <Clock className="h-3 w-3 text-yellow-500" />
                                        <span className="text-[10px] text-gray-600 sm:text-xs">
                                            Pending Notarization
                                        </span>
                                    </div>
                                    <div className="mt-1 text-base font-bold text-gray-900 sm:text-lg">
                                        {formatCompact(stats.pending_notarization)}
                                    </div>
                                </div>

                                <div className="rounded-lg border border-gray-100 p-2 sm:p-3">
                                    <div className="flex items-center gap-1.5 sm:gap-2">
                                        <Users className="h-3 w-3 text-purple-500" />
                                        <span className="text-[10px] text-gray-600 sm:text-xs">
                                            Total Users
                                        </span>
                                    </div>
                                    <div className="mt-1 text-base font-bold text-gray-900 sm:text-lg">
                                        {formatCompact(stats.total_users)}
                                    </div>
                                </div>

                                <div className="rounded-lg border border-gray-100 p-2 sm:p-3">
                                    <div className="flex items-center gap-1.5 sm:gap-2">
                                        <Target className="h-3 w-3 text-blue-500" />
                                        <span className="text-[10px] text-gray-600 sm:text-xs">
                                            ERP Active
                                        </span>
                                    </div>
                                    <div className="mt-1 text-base font-bold text-gray-900 sm:text-lg">
                                        {formatCompact(stats.active_companies)}
                                    </div>
                                </div>

                                <div className="rounded-lg border border-gray-100 p-2 sm:p-3">
                                    <div className="flex items-center gap-1.5 sm:gap-2">
                                        <Zap className="h-3 w-3 text-sky-500" />
                                        <span className="text-[10px] text-gray-600 sm:text-xs">
                                            Generating Sales
                                        </span>
                                    </div>
                                    <div className="mt-1 text-base font-bold text-gray-900 sm:text-lg">
                                        {formatCompact(generatingSalesCount)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Row */}
                <div className="mt-4 grid grid-cols-1 gap-4 sm:mt-6 sm:gap-6 lg:grid-cols-2">
                    {/* Recent Index */}
                    <div className="rounded-xl border  border-gray-100 bg-white p-3   sm:p-4">
                        <div className="mb-3 flex items-center justify-between sm:mb-4">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900">
                                    Recent Performance
                                </h3>
                                <p className="text-xs text-gray-500">
                                    Latest performance records
                                </p>
                            </div>
                            <DollarSign className="h-4 w-4 text-gray-500" />
                        </div>

                        {recentPerformance.length === 0 ? (
                            <div className="rounded-lg border border-dashed  border-gray-100 p-3 text-sm text-gray-600 sm:p-4">
                                No recent performance records found.
                            </div>
                        ) : (
                            <div className="space-y-2 sm:space-y-3">
                                {recentPerformance.map((perf) => {
                                    const roas = toNumber(perf.roas);
                                    const rts = toNumber(perf.rts);
                                    const spent = toNumber(perf.avg_ads_spent);

                                    return (
                                        <div
                                            key={perf.id}
                                            className="rounded-lg border border-gray-100 p-2 sm:p-3"
                                        >
                                            <div className="mb-1 flex items-center justify-between sm:mb-2">
                                                <span className="max-w-[150px] truncate text-sm font-medium text-gray-900 sm:max-w-none">
                                                    {perf.company.name}
                                                </span>
                                                <span className="text-[10px] text-gray-500 sm:text-xs">
                                                    {perf.phase}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-3 gap-1 sm:gap-2">
                                                <div className="text-center">
                                                    <div className="text-sm font-bold text-blue-700">
                                                        {roas > 0 ? `${roas.toFixed(1)}x` : '—'}
                                                    </div>
                                                    <div className="text-[10px] text-gray-500 sm:text-xs">
                                                        ROAS
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-sm font-bold text-sky-700">
                                                        {rts > 0 ? `${rts.toFixed(1)}%` : '—'}
                                                    </div>
                                                    <div className="text-[10px] text-gray-500 sm:text-xs">
                                                        RTS
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-sm font-bold text-pink-700">
                                                        ₱{formatMoney(spent)}
                                                    </div>
                                                    <div className="text-[10px] text-gray-500 sm:text-xs">
                                                        Ads Spent
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Level Distribution */}
                    <div className="rounded-xl border  border-gray-100 bg-white p-3   sm:p-4">
                        <h3 className="mb-2 text-sm font-semibold text-gray-900 sm:mb-3">
                            Level Distribution
                        </h3>

                        {levelDistribution.length === 0 ? (
                            <div className="rounded-lg border border-dashed  border-gray-100 p-3 text-sm text-gray-600 sm:p-4">
                                No level distribution data available.
                            </div>
                        ) : (
                            <div className="space-y-2 sm:space-y-3">
                                {levelDistribution.map((level) => {
                                    const percentage = stats.total_companies
                                        ? ((level.count / stats.total_companies) * 100).toFixed(1)
                                        : '0.0';

                                    const barClass =
                                        level.level === 'educate'
                                            ? 'bg-gradient-to-r from-pink-500 to-blue-500'
                                            : level.level === 'empowerment'
                                                ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                                                : level.level === 'enterprise'
                                                    ? 'bg-gradient-to-r from-blue-500 to-sky-500'
                                                    : 'bg-gradient-to-r from-sky-500 to-pink-400';

                                    return (
                                        <div key={level.level} className="space-y-1">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-1.5 sm:gap-2">
                                                    <div className={`h-2 w-2 rounded-full ${barClass}`} />
                                                    <span className="text-xs font-medium text-gray-700 capitalize">
                                                        {level.level}
                                                    </span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {level.count}
                                                    </span>
                                                    <span className="ml-1 text-xs text-gray-500">
                                                        ({percentage}%)
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                                                <div
                                                    className={`h-full rounded-full ${barClass}`}
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Coach Summary */}
                {userRole === 'coach' && stats.coach_companies > 0 && (
                    <div className="mt-4 rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-sky-50 p-3   sm:mt-6 sm:p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-semibold text-blue-900">
                                    Your Coaching Summary
                                </h3>
                                <p className="text-xs text-blue-700">
                                    Companies under your guidance
                                </p>
                            </div>
                            <div className="rounded-lg bg-white p-2  ">
                                <Users className="h-4 w-4 text-blue-600" />
                            </div>
                        </div>

                        <div className="mt-2 grid grid-cols-2 gap-2 sm:mt-3 sm:grid-cols-4 sm:gap-3">
                            <div className="rounded-lg border border-blue-100 bg-white p-2 sm:p-3">
                                <div className="text-[10px] text-blue-600 sm:text-xs">Total Companies</div>
                                <div className="mt-1 text-base font-bold text-blue-900 sm:text-lg">
                                    {formatCompact(stats.coach_companies)}
                                </div>
                            </div>

                            <div className="rounded-lg border border-blue-100 bg-white p-2 sm:p-3">
                                <div className="text-[10px] text-blue-600 sm:text-xs">Avg ROAS (Top)</div>
                                <div className="mt-1 text-base font-bold text-blue-900 sm:text-lg">
                                    {topPerformers.length > 0
                                        ? (
                                            topPerformers.reduce(
                                                (sum, p) => sum + toNumber(p.avg_roas),
                                                0,
                                            ) / topPerformers.length
                                        ).toFixed(1)
                                        : '0.0'}
                                    x
                                </div>
                            </div>

                            <div className="rounded-lg border border-blue-100 bg-white p-2 sm:p-3">
                                <div className="text-[10px] text-blue-600 sm:text-xs">Onboarding Rate</div>
                                <div className="mt-1 text-base font-bold text-blue-900 sm:text-lg">
                                    {stats.onboarding_rate}%
                                </div>
                            </div>

                            <div className="rounded-lg border border-blue-100 bg-white p-2 sm:p-3">
                                <div className="text-[10px] text-blue-600 sm:text-xs">New This {selectedRangeLabel}</div>
                                <div className="mt-1 text-base font-bold text-blue-900 sm:text-lg">
                                    {formatCompact(stats.new_companies)}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
