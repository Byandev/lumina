import React from 'react';

type EventType = 'Online' | 'Face to Face';

const TYPE_STYLES: Record<EventType, string> = {
    Online: 'border-blue-200 bg-blue-50 text-blue-700',
    'Face to Face': 'border-green-200 bg-green-50 text-green-700',
};

const EventTypeBadge = ({ type }: { type: EventType | null }) => {
    if (!type) {
        return (
            <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-[10px] font-semibold text-gray-500 sm:text-[11px]">
                <span className="h-1.5 w-1.5 rounded-full bg-gray-400 opacity-60" />
                Unknown
            </span>
        );
    }

    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold sm:text-[11px] ${
                TYPE_STYLES[type]
            }`}
        >
            <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
            {type}
        </span>
    );
};

export default EventTypeBadge;
