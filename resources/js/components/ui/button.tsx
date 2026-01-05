import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none relative overflow-hidden group isolate",
    {
        variants: {
            variant: {
                // Main pink-cyan gradient
                default:
                    "bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white shadow-lg shadow-pink-500/25 hover:shadow-xl hover:shadow-cyan-500/35 hover:scale-[1.02] active:scale-[0.98] focus-visible:shadow-2xl focus-visible:shadow-cyan-500/50 focus-visible:ring-2 focus-visible:ring-white/70",

                // Glowing outline variant
                outline:
                    "border-2 bg-transparent text-foreground shadow-xs border-pink-300/30 hover:border-pink-400/50 hover:bg-pink-500/5 dark:hover:bg-pink-500/10 hover:shadow-lg hover:shadow-pink-500/20 focus-visible:border-cyan-400 focus-visible:shadow-lg focus-visible:shadow-cyan-500/30",

                // Enhanced destructive
                destructive:
                    "bg-gradient-to-r from-rose-600 via-red-500 to-orange-500 text-white shadow-lg shadow-rose-500/25 hover:shadow-xl hover:shadow-orange-500/35 focus-visible:shadow-2xl focus-visible:shadow-rose-500/50 focus-visible:ring-2 focus-visible:ring-white/70",

                // Enhanced secondary
                secondary:
                    "bg-gradient-to-r from-gray-700 via-gray-600 to-gray-500 text-white shadow-lg shadow-gray-500/20 hover:shadow-xl hover:shadow-gray-500/35 focus-visible:shadow-2xl focus-visible:shadow-gray-500/50 focus-visible:ring-2 focus-visible:ring-white/70",

                // Animated ghost
                ghost:
                    "bg-transparent text-foreground hover:bg-gradient-to-r hover:from-pink-500/10 hover:via-purple-500/10 hover:to-cyan-500/10 hover:scale-[1.02] dark:hover:from-pink-500/15 dark:hover:via-purple-500/15 dark:hover:to-cyan-500/15",

                link: "text-primary underline-offset-4 hover:underline bg-transparent p-0 h-auto hover:text-cyan-500 transition-colors",

                // Premium variants with inner glow
                gradient:
                    "bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white shadow-lg shadow-pink-500/25 hover:shadow-xl hover:shadow-cyan-500/40 hover:scale-[1.02] before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-white/40 before:via-white/20 before:to-transparent before:opacity-0 hover:before:opacity-30 before:transition-opacity before:duration-500",

                "neon-glow":
                    "bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white shadow-lg shadow-pink-500/30 hover:shadow-xl hover:shadow-cyan-500/40 animate-pulse-slow border border-white/20 hover:border-white/40 before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-white/30 before:via-white/10 before:to-transparent before:opacity-0 hover:before:opacity-40 before:transition-opacity",

                "glass-morphism":
                    "bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl border border-white/20 text-white shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-black/20 hover:bg-gradient-to-r hover:from-pink-500/20 hover:via-purple-500/20 hover:to-cyan-500/20 hover:border-pink-400/30 focus-visible:border-cyan-400/50",
            },
            size: {
                default: "h-8 px-6 py-2 has-[>svg]:px-4 text-sm rounded-sm ",
                sm: "h-8 rounded-lg gap-1.5 px-3.5 has-[>svg]:px-2.5 text-xs",
                lg: "h-12 rounded-lg px-8 has-[>svg]:px-5 text-base font-semibold",
                xl: "h-14 rounded-xl px-10 has-[>svg]:px-6 text-base font-semibold",
                icon: "size-10 rounded-lg",
                "icon-sm": "size-8 rounded-md",
                "icon-lg": "size-12 rounded-lg",
            },
            animation: {
                none: "",
                pulse: "animate-pulse-slow",
                "pulse-fast": "animate-pulse",
                shimmer: "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
            },
        },
        compoundVariants: [
            {
                variant: ["default", "gradient", "neon-glow", "destructive", "secondary"],
                className: "active:translate-y-0.5",
            },
        ],
        defaultVariants: {
            variant: "default",
            size: "default",
            animation: "none",
        },
    }
)

function Button({
                    className,
                    variant = "default",
                    size = "default",
                    animation = "none",
                    asChild = false,
                    ...props
                }: React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    animation?: "none" | "pulse" | "pulse-fast" | "shimmer"
}) {
    const Comp = asChild ? Slot : "button"

    return (
        <Comp
            data-slot="button"
            data-variant={variant}
            data-size={size}
            data-animation={animation}
            className={cn(buttonVariants({ variant, size, animation, className }))}
            {...props}
        />
    )
}

export { Button, buttonVariants }
