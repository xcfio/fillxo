import { AlertCircle } from "lucide-react"

interface ErrorAlertProps {
    message: string
    variant?: "error" | "warning" | "info"
}

export function ErrorAlert({ message, variant = "error" }: ErrorAlertProps) {
    const variants = {
        error: {
            bg: "bg-red-900/30",
            border: "border-red-700/50",
            text: "text-red-300",
            icon: "text-red-400"
        },
        warning: {
            bg: "bg-yellow-900/30",
            border: "border-yellow-700/50",
            text: "text-yellow-300",
            icon: "text-yellow-400"
        },
        info: {
            bg: "bg-blue-900/30",
            border: "border-blue-700/50",
            text: "text-blue-300",
            icon: "text-blue-400"
        }
    }

    const style = variants[variant]

    return (
        <div className={`mb-6 ${style.bg} border ${style.border} rounded-xl p-4 flex items-start gap-3`}>
            <AlertCircle className={`w-5 h-5 ${style.icon} shrink-0 mt-0.5`} />
            <p className={`${style.text} text-sm`}>{message}</p>
        </div>
    )
}
