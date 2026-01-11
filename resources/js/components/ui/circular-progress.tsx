import React from "react";

type Props = {
    percentage: number; // 0 - 100
    size?: number;      // px
};

export default function CircleProgress({
                                           percentage,
                                           size = 40,
                                       }: Props) {
    const value = Math.min(100, Math.max(0, percentage));

    const strokeWidth = size * 0.2;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const dash = (value / 100) * circumference;

    return (
        <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
        >
            {/* background */}
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                strokeWidth={strokeWidth}
                fill="none"
                stroke="#e5e7eb"
            />

            {/* progress */}
            {value > 0 && (
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                    fill="none"
                    stroke="#111827"
                    strokeLinecap="round"
                    strokeDasharray={`${dash} ${circumference - dash}`}
                    transform={`rotate(-90 ${size / 2} ${size / 2})`}
                    style={{ transition: "stroke-dasharray 0.3s ease" }}
                />
            )}
        </svg>
    );
}
