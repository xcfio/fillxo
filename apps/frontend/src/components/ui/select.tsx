import { SelectHTMLAttributes } from "react"
import { ChevronDown, LucideIcon } from "lucide-react"

export interface SelectOption {
    value: string
    label: string
}

export interface SelectOptionGroup {
    label: string
    options: SelectOption[]
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string
    labelIcon?: LucideIcon
    icon?: LucideIcon
    error?: string
    options: Array<SelectOption | SelectOptionGroup>
    placeholder?: string
}

function isOptionGroup(option: SelectOption | SelectOptionGroup): option is SelectOptionGroup {
    return "options" in option
}

export function Select({
    label,
    labelIcon: LabelIcon,
    icon: Icon,
    error,
    options,
    placeholder,
    id,
    className = "",
    ...props
}: SelectProps) {
    return (
        <div>
            {label && (
                <label htmlFor={id} className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                    {LabelIcon && <LabelIcon className="w-4 h-4 text-blue-400" />}
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />}
                <select
                    id={id}
                    className={`w-full ${Icon ? "pl-12" : "pl-4"} pr-10 py-3 bg-gray-900/50 border ${
                        error ? "border-red-500/50" : "border-blue-900/30"
                    } rounded-lg text-white focus:outline-none focus:border-blue-600 transition-colors appearance-none ${className}`}
                    {...props}
                >
                    {placeholder && <option value="">{placeholder}</option>}
                    {options.map((option, index) =>
                        isOptionGroup(option) ? (
                            <optgroup key={`group-${index}`} label={option.label}>
                                {option.options.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </optgroup>
                        ) : (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        )
                    )}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
            {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
        </div>
    )
}
