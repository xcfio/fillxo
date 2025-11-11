import { ButtonHTMLAttributes, ReactNode } from "react"
import { LucideIcon } from "lucide-react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "danger"
    isLoading?: boolean
    icon?: LucideIcon
    iconPosition?: "left" | "right"
    children: ReactNode
}

export function Button({
    variant = "primary",
    isLoading = false,
    icon: Icon,
    iconPosition = "right",
    children,
    className = "",
    disabled,
    ...props
}: ButtonProps) {
    const variants = {
        primary: "bg-blue-600 hover:bg-blue-700 text-white",
        secondary: "bg-gray-800 hover:bg-gray-700 border border-blue-900/30 text-white",
        danger: "bg-red-600 hover:bg-red-700 text-white"
    }

    return (
        <button
            className={`px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 active:scale-95 inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Loading...
                </>
            ) : (
                <>
                    {Icon && iconPosition === "left" && <Icon className="w-5 h-5" />}
                    {children}
                    {Icon && iconPosition === "right" && <Icon className="w-5 h-5" />}
                </>
            )}
        </button>
    )
}
