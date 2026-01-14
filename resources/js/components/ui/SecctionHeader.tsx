
import * as React from 'react';

export interface SectionHeaderProps {
    icon?: React.ReactNode;
    title: string;
    subtitle?: string;
    right?: React.ReactNode;
    className?: string;
}

const SectionHeader = ({
                           icon,
                           title,
                           subtitle,
                           right,
                           className = '',
                       }: SectionHeaderProps) => {
    return (
        <div
            className={`flex items-start justify-between gap-6 ${className}`}
        >
            <div className="flex items-start gap-4">
                {icon && (
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-200 bg-white shadow-sm">
                        {icon}
                    </div>
                )}

                <div className="pt-0.5">
                    <h2 className="text-lg font-semibold text-zinc-900 md:text-xl">
                        {title}
                    </h2>

                    {subtitle && (
                        <p className="mt-1 text-sm text-zinc-500">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>

            {right && <div className="shrink-0">{right}</div>}
        </div>
    );
};

export default SectionHeader;
