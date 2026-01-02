import * as React from "react"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
    return (
        <div className="relative group">
            <input
                type={type}
                data-slot="input"
                className={cn(
                    "bg-white border border-gray-300 rounded-lg",
                    "file:text-gray-700 placeholder:text-gray-500",
                    "flex h-10 w-full min-w-0 px-3 py-2 text-sm text-gray-900 transition-all duration-150 outline-none",
                    "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
                    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
                    // Focus effects
                    "focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20",
                    // Hover effects
                    "hover:border-gray-400",
                    // Selection
                    "selection:bg-pink-100 selection:text-pink-900",
                    // Placeholder
                    "focus:placeholder:text-gray-400",
                    // Error states
                    "aria-invalid:border-red-400 aria-invalid:ring-red-100",
                    className
                )}
                {...props}
            />
        </div>
    )
}

export { Input }
