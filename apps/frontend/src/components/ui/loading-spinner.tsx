interface LoadingSpinnerProps {
    size?: "sm" | "md" | "lg"
    message?: string
}

export function LoadingSpinner({ size = "md", message = "Loading..." }: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: "w-8 h-8",
        md: "w-16 h-16",
        lg: "w-24 h-24"
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-gray-950 via-blue-950 to-gray-950 text-white">
            <div className="text-center">
                <div
                    className={`${sizeClasses[size]} border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4`}
                />
                <p className="text-gray-400">{message}</p>
            </div>
        </div>
    )
}
