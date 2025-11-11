import { SelectHTMLAttributes } from "react"
import { ChevronDown, LucideIcon } from "lucide-react"

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label: string
    icon?: LucideIcon
    error?: string
    options: Array<{ value: string; label: string }>
}

export function Select({ label, icon: Icon, error, options, id, className = "", ...props }: SelectProps) {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">
                {label}
            </label>
            <div className="relative">
                {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />}
                <select
                    id={id}
                    className={`w-full ${Icon ? "pl-12" : "pl-4"} pr-10 py-3.5 bg-slate-950/50 border ${
                        error ? "border-red-500/50" : "border-slate-700/50"
                    } rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none ${className}`}
                    {...props}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
            {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
        </div>
    )
}
