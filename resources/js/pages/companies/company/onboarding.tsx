import { Company } from '@/types/models/Company';
import { Progress } from '@/components/ui/progress';
import { percentageFormatter } from '@/lib/formatter';
import ComponentCard from '@/components/component-card';
import CompanyLayout from '@/pages/companies/company/company-layout';
import OnboardingChecklistItem from '@/components/companies/onboarding-checklist-item';
import {
    CheckCircle,
    ClipboardList,
    TrendingUp,
    ArrowLeft,
} from 'lucide-react';
import { Link } from '@inertiajs/react';

interface Props {
    company: Company;
}

const Onboarding = ({ company }: Props) => {
    const completedCount =
        company.onboarding_checklists?.filter((item) => item.is_completed)
            .length || 0;
    const totalCount = company.onboarding_checklists?.length || 0;
    const completionPercentage = (company.onboarding_percentage ?? 0) * 100;

    return (
        <CompanyLayout company={company}>
            <div className="">
                {/* Header Section */}
                <div className="mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center space-x-3">
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900">
                                        Onboarding Progress
                                    </h1>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {company.name} • Track your onboarding
                                        journey
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Progress Overview Card */}
                <div className="mb-8 border border-gray-200 bg-white">
                    <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                        <div className="flex items-center space-x-2">
                            <TrendingUp className="h-5 w-5 text-pink-500" />
                            <h2 className="text-lg font-semibold text-gray-900">
                                Overall Progress
                            </h2>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="flex flex-col space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <ClipboardList className="h-5 w-5 text-gray-400" />
                                    <span className="text-sm text-gray-600">
                                        {completedCount} of {totalCount} tasks
                                        completed
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <CheckCircle className="h-5 w-5 text-pink-500" />
                                    <span className="text-2xl font-semibold text-gray-900">
                                        {percentageFormatter(
                                            company.onboarding_percentage as number,
                                        )}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Progress
                                    value={completionPercentage}
                                    max={100}
                                    className="h-2 bg-gray-100"
                                />
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>0%</span>
                                    <span>25%</span>
                                    <span>50%</span>
                                    <span>75%</span>
                                    <span>100%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Checklist Section */}
                <div className="border border-gray-200 bg-white">
                    <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <ClipboardList className="h-5 w-5 text-pink-500" />
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Onboarding Checklist
                                </h2>
                            </div>
                            <div className="text-sm text-gray-500">
                                {completionPercentage === 100 ? (
                                    <span className="text-green-600">
                                        Complete ✓
                                    </span>
                                ) : (
                                    <span>
                                        {Math.round(completionPercentage)}%
                                        Complete
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {company.onboarding_checklists?.length > 0 ? (
                            company.onboarding_checklists.map(
                                (checklist, index) => (
                                    <div
                                        key={checklist.id}
                                        className="p-4 transition-colors duration-150 hover:bg-gray-50"
                                    >
                                        <OnboardingChecklistItem
                                            checklist={checklist}
                                        />
                                    </div>
                                ),
                            )
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12">
                                <div className="mb-4 border border-gray-200 bg-gray-50 p-4">
                                    <ClipboardList className="h-8 w-8 text-gray-400" />
                                </div>
                                <p className="text-sm text-gray-500">
                                    No onboarding tasks available
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Stats Footer */}
                {completionPercentage === 100 && (
                    <div className="mt-6 border border-green-200 bg-green-50 p-4">
                        <div className="flex items-center space-x-3">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <div>
                                <p className="text-sm font-medium text-green-800">
                                    Congratulations! You've completed all
                                    onboarding tasks.
                                </p>
                                <p className="mt-1 text-xs text-green-600">
                                    Your company is now fully onboarded and
                                    ready to go.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {completionPercentage > 0 && completionPercentage < 100 && (
                    <div className="relative mt-6 overflow-hidden border-2 border-transparent bg-gradient-to-r from-pink-100 to-violet-100 p-4">
                        {/* Gradient border */}
                        <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-pink-100 to-violet-100 opacity-30 blur"></div>

                        {/* Content on top */}
                        <div className="relative flex items-center space-x-3">
                            {/* Icon with gradient */}
                            <TrendingUp className="h-5 w-5 bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent" />
                            <div>
                                <p className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-sm font-medium text-transparent">
                                    Keep going! You're making great progress.
                                </p>
                                <p className="mt-1 bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-xs text-transparent">
                                    Complete the remaining tasks to finish your
                                    onboarding.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </CompanyLayout>
    );
};

export default Onboarding;
