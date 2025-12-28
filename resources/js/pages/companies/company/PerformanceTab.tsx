import { BarChart, Target, TrendingUp, Users } from 'lucide-react';

export default function PerformanceTab() {
    return (
        <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">
                Performance Metrics
            </h3>

            <div className="grid grid-cols-2 gap-3">
                <PerformanceMetric
                    icon={<TrendingUp className="h-3.5 w-3.5 text-gray-400" />}
                    label="Revenue Growth"
                    value="+24%"
                    color="text-green-600"
                />
                <PerformanceMetric
                    icon={<Target className="h-3.5 w-3.5 text-gray-400" />}
                    label="Target Achievement"
                    value="82%"
                    color="text-blue-600"
                />
                <PerformanceMetric
                    icon={<BarChart className="h-3.5 w-3.5 text-gray-400" />}
                    label="Efficiency Score"
                    value="7.8/10"
                    color="text-purple-600"
                />
                <PerformanceMetric
                    icon={<Users className="h-3.5 w-3.5 text-gray-400" />}
                    label="Client Satisfaction"
                    value="94%"
                    color="text-orange-600"
                />
            </div>

            {/* Performance Action Items */}
            <div className="rounded border border-gray-200 p-3">
                <h4 className="mb-2 text-xs font-semibold text-gray-900">
                    Action Items
                </h4>
                <div className="space-y-2">
                    {[
                        'Complete quarterly review',
                        'Update compliance documents',
                        'Schedule training session',
                        'Review performance metrics',
                    ].map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                className="h-3 w-3 rounded border-gray-300"
                            />
                            <span className="text-xs text-gray-700">
                                {item}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

interface PerformanceMetricProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    color: string;
}

function PerformanceMetric({
    icon,
    label,
    value,
    color,
}: PerformanceMetricProps) {
    return (
        <div className="rounded border border-gray-200 p-3">
            <div className="flex items-center gap-2">
                {icon}
                <div>
                    <p className="text-xs font-medium text-gray-600">{label}</p>
                    <p className={`text-sm font-semibold ${color}`}>{value}</p>
                </div>
            </div>
        </div>
    );
}
