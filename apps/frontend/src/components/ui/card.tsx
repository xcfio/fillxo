import { ReactNode, HTMLAttributes } from "react"

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode
    hover?: boolean
}

export function Card({ children, className = "", hover = false, ...props }: CardProps) {
    return (
        <div
            className={`bg-gray-900/50 border border-blue-900/30 rounded-2xl p-8 backdrop-blur-sm ${
                hover ? "hover:border-blue-600/50 transition-colors" : ""
            } ${className}`}
            {...props}
        >
            {children}
        </div>
    )
}
