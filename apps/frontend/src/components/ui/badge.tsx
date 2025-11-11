import { ReactNode, HTMLAttributes } from "react"

interface BadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
    children: ReactNode
    variant?: "primary" | "success" | "warning" | "danger" | "info"
}

export function Badge({ children, variant = "primary", className = "", ...props }: BadgeProps) {
    const variants = {
        primary: "bg-blue-600/20 border-blue-700/50 text-blue-300",
        success: "bg-emerald-600/20 border-emerald-700/50 text-emerald-300",
        warning: "bg-yellow-600/20 border-yellow-700/50 text-yellow-300",
        danger: "bg-red-600/20 border-red-700/50 text-red-300",
        info: "bg-gray-600/20 border-gray-700/50 text-gray-300"
    }

    return (
        <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </span>
    )
}
