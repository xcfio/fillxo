import { InputHTMLAttributes } from "react"
import { LucideIcon } from "lucide-react"

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string
    icon?: LucideIcon
    error?: string
}

export function FormInput({ label, icon: Icon, error, id, className = "", ...props }: FormInputProps) {
    return (
        <div>
            <label htmlFor={id} className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                {Icon && <Icon className="w-4 h-4 text-blue-400" />}
                {label}
            </label>
            <input
                id={id}
                className={`w-full px-4 py-3 bg-gray-900/50 border ${
                    error ? "border-red-500/50" : "border-blue-900/30"
                } rounded-lg focus:outline-none focus:border-blue-600 transition-colors text-white placeholder-gray-500 ${className}`}
                {...props}
            />
            {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
        </div>
    )
}
