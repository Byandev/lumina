<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\CompanyChecklist;
use App\Models\PerformanceRecord;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        $timeRange = $request->input('time_range', 'month');

        // Determine date range
        [$startDate, $endDate] = $this->getDateRange($timeRange);

        // Base company query (role-scoped list usage)
        $companyQuery = Company::query();
        if ($user->role === 'coach') {
            $companyQuery->where('coach_id', $user->id);
        }

        // Core Stats
        // Note: Keep these global if that's intended. If you want coach-scoped stats, tell me.
        $stats = [
            'total_companies' => Company::count(),
            'active_companies' => Company::where('status', 'active')->count(),
            'new_companies' => Company::whereBetween('created_at', [$startDate, $endDate])->count(),
            'pending_notarization' => Company::where('notarization_status', 'pending')->count(),
            'total_users' => User::count(),
            'onboarding_rate' => $this->getOnboardingRate(),
            'coach_companies' => $user->role === 'coach' ? Company::where('coach_id', $user->id)->count() : 0,
        ];

        // Growth metrics (fixed: uses correct previous period + coach scoping + zero-baseline handling)
        $growth = $this->getGrowthMetrics($startDate, $endDate, $timeRange, $user);

        // Recent activity (scoped for coach)
        $recentCompanies = (clone $companyQuery)
            ->latest()
            ->take(6)
            ->with('coach:id,name')
            ->get(['id', 'name', 'status', 'level', 'created_at', 'coach_id']);

        // Recent performance (optionally scope for coach via company relation)
        $recentPerformanceQuery = PerformanceRecord::with('company:id,name,coach_id')
            ->latest()
            ->take(4);

        if ($user->role === 'coach') {
            $recentPerformanceQuery->whereHas('company', function ($q) use ($user) {
                $q->where('coach_id', $user->id);
            });
        }

        $recentPerformance = $recentPerformanceQuery->get();

        // Distribution data (OPTIONAL: keep global; if you want coach-only, I can adjust)
        $statusDistribution = Company::select('status', DB::raw('COUNT(*) as count'))
            ->groupBy('status')
            ->get()
            ->pluck('count', 'status');

        $levelDistribution = Company::select('level', DB::raw('COUNT(*) as count'))
            ->groupBy('level')
            ->get();

        $salesDistribution = Company::select('sales_activity', DB::raw('COUNT(*) as count'))
            ->groupBy('sales_activity')
            ->get();

        // Top performers (optionally scope for coach via company relation)
        $topPerformersQuery = PerformanceRecord::select(
            'company_id',
            DB::raw('AVG(roas) as avg_roas'),
            DB::raw('MAX(roas) as max_roas')
        )
            ->groupBy('company_id')
            ->orderBy('avg_roas', 'desc')
            ->take(4)
            ->with('company:id,name,level,coach_id');

        if ($user->role === 'coach') {
            $topPerformersQuery->whereHas('company', function ($q) use ($user) {
                $q->where('coach_id', $user->id);
            });
        }

        $topPerformers = $topPerformersQuery->get();

        // Time series data for chart (fixed: clone query in loops)
        $timeSeriesData = $this->getTimeSeriesData($timeRange, $user);

        return inertia('dashboard', [
            'stats' => $stats,
            'growth' => $growth,
            'recentCompanies' => $recentCompanies,
            'recentPerformance' => $recentPerformance,
            'statusDistribution' => $statusDistribution,
            'levelDistribution' => $levelDistribution,
            'salesDistribution' => $salesDistribution,
            'topPerformers' => $topPerformers,
            'timeSeriesData' => $timeSeriesData,
            'timeRange' => $timeRange,
            'userRole' => $user->role,
        ]);
    }

    private function getDateRange($timeRange)
    {
        return match ($timeRange) {
            'week' => [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()],
            'quarter' => [Carbon::now()->startOfQuarter(), Carbon::now()->endOfQuarter()],
            'year' => [Carbon::now()->startOfYear(), Carbon::now()->endOfYear()],
            default => [Carbon::now()->startOfMonth(), Carbon::now()->endOfMonth()],
        };
    }

    private function getOnboardingRate()
    {
        $total = CompanyChecklist::count();
        $completed = CompanyChecklist::where('is_completed', true)->count();

        return $total > 0 ? round(($completed / $total) * 100, 1) : 0;
    }

    /**
     * Fixed Growth:
     * - Uses correct "previous period" for week/month/quarter/year
     * - Applies coach scoping (same as dashboard list)
     * - Returns change=null when previous=0 and current>0 (so UI can show "New")
     */
    private function getGrowthMetrics($startDate, $endDate, string $timeRange, $user)
    {
        [$previousStart, $previousEnd] = match ($timeRange) {
            'week' => [
                Carbon::parse($startDate)->copy()->subWeek(),
                Carbon::parse($endDate)->copy()->subWeek(),
            ],
            'quarter' => [
                Carbon::parse($startDate)->copy()->subQuarter(),
                Carbon::parse($endDate)->copy()->subQuarter(),
            ],
            'year' => [
                Carbon::parse($startDate)->copy()->subYear(),
                Carbon::parse($endDate)->copy()->subYear(),
            ],
            default => [ // month
                Carbon::parse($startDate)->copy()->subMonth(),
                Carbon::parse($endDate)->copy()->subMonth(),
            ],
        };

        $baseQuery = Company::query();
        if ($user->role === 'coach') {
            $baseQuery->where('coach_id', $user->id);
        }

        $current = (clone $baseQuery)->whereBetween('created_at', [$startDate, $endDate])->count();
        $previous = (clone $baseQuery)->whereBetween('created_at', [$previousStart, $previousEnd])->count();

        $change = null;
        if ($previous > 0) {
            $change = round((($current - $previous) / $previous) * 100, 1);
        } elseif ($current === 0) {
            $change = 0.0;
        } // else keep null => "New" in UI

        return [
            'current' => $current,
            'previous' => $previous,
            'change' => $change,
            'current_range' => [
                'start' => Carbon::parse($startDate)->toDateString(),
                'end' => Carbon::parse($endDate)->toDateString(),
            ],
            'previous_range' => [
                'start' => $previousStart->toDateString(),
                'end' => $previousEnd->toDateString(),
            ],
        ];
    }

    private function getTimeSeriesData(string $timeRange, $user)
    {
        $query = Company::query();

        // Optional: if coach should only see their own time series
        if ($user->role === 'coach') {
            $query->where('coach_id', $user->id);
        }

        return match ($timeRange) {
            'week' => $this->getDailyData($query),
            'quarter' => $this->getMonthlyData($query, 3),
            'year' => $this->getMonthlyData($query, 12),
            default => $this->getMonthlyData($query, 6),
        };
    }

    /**
     * Fixed: clone the query per iteration to avoid accumulating where clauses.
     */
    private function getDailyData($query)
    {
        $data = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);

            $count = (clone $query)
                ->whereDate('created_at', $date->toDateString())
                ->count();

            $data[] = [
                'label' => $date->format('D'),
                'date' => $date->format('M d'),
                'count' => $count,
            ];
        }

        return $data;
    }

    /**
     * Fixed: clone the query per iteration to avoid accumulating where clauses.
     */
    private function getMonthlyData($query, int $months)
    {
        $data = [];
        for ($i = $months - 1; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);

            $count = (clone $query)
                ->whereYear('created_at', $date->year)
                ->whereMonth('created_at', $date->month)
                ->count();

            $data[] = [
                'label' => $date->format('M'),
                'date' => $date->format('M Y'),
                'count' => $count,
            ];
        }

        return $data;
    }
}
