import { Calendar, Clock, Target } from 'lucide-react';

export default function AttendanceTab() {
    return (
        <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">
                Attendance Overview
            </h3>

            <div className="grid grid-cols-2 gap-3">
                <AttendanceMetric
                    icon={<Clock className="h-3.5 w-3.5 text-gray-400" />}
                    label="This Month"
                    value="85%"
                />
                <AttendanceMetric
                    icon={<Calendar className="h-3.5 w-3.5 text-gray-400" />}
                    label="Last Month"
                    value="78%"
                />
                <AttendanceMetric
                    icon={<Target className="h-3.5 w-3.5 text-gray-400" />}
                    label="Present Days"
                    value="18"
                />
                <AttendanceMetric
                    icon={<Clock className="h-3.5 w-3.5 text-gray-400" />}
                    label="Absent Days"
                    value="3"
                />
            </div>

            {/* Attendance Trend */}
            <div className="rounded border border-gray-200 p-3">
                <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs font-medium text-gray-700">
                        Monthly Trend
                    </p>
                    <span className="text-xs text-green-600">
                        +7% improvement
                    </span>
                </div>
                <div className="flex items-end gap-1">
                    {[65, 70, 72, 68, 75, 78, 80, 82, 85].map(
                        (height, index) => (
                            <div key={index} className="flex-1">
                                <div
                                    className="rounded-t bg-blue-100"
                                    style={{
                                        height: `${height}%`,
                                        minHeight: '20px',
                                    }}
                                ></div>
                                <div className="pt-1 text-center text-[10px] text-gray-500">
                                    W{index + 1}
                                </div>
                            </div>
                        ),
                    )}
                </div>
            </div>
        </div>
    );
}

interface AttendanceMetricProps {
    icon: React.ReactNode;
    label: string;
    value: string;
}

function AttendanceMetric({ icon, label, value }: AttendanceMetricProps) {
    return (
        <div className="rounded border border-gray-200 p-3">
            <div className="flex items-center gap-2">
                {icon}
                <div>
                    <p className="text-xs font-medium text-gray-600">{label}</p>
                    <p className="text-sm font-semibold text-gray-900">
                        {value}
                    </p>
                </div>
            </div>
        </div>
    );
}
