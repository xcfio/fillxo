"use client"

import { ArrowRight, Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { PageContainer } from "@/components/ui/page-container"
import { FormInput } from "@/components/ui/form-input"
import { Button } from "@/components/ui/button"
import { ErrorAlert } from "@/components/ui/error-alert"
import { Card } from "@/components/ui/card"
import Link from "next/link"

export default function LoginPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({ input: "", password: "" })
    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errors, setErrors] = useState({ input: "", password: "", general: "" })
    const [authCheckStatus, setAuthCheckStatus] = useState<"checking" | "done" | "error">("checking")

    useEffect(() => {
        // Check if user is already authenticated via cookie
        const checkAuth = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/users/me`, {
                    credentials: "include"
                })
                if (response.ok) {
                    router.push("/dashboard")
                } else {
                    setAuthCheckStatus("done")
                }
            } catch (error) {
                setAuthCheckStatus("error")
                if (process.env.NODE_ENV !== "production") {
                    console.error("Auth check failed:", error)
                }
            }
        }
        checkAuth()
    }, [router])

    const validateForm = () => {
        const newErrors = { input: "", password: "", general: "" }
        let isValid = true

        if (!formData.input.trim()) {
            newErrors.input = "Email or username is required"
            isValid = false
        }

        if (!formData.password.trim()) {
            newErrors.password = "Password is required"
            isValid = false
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters"
            isValid = false
        }

        setErrors(newErrors)
        return isValid
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrors({ input: "", password: "", general: "" })

        if (!validateForm()) return
        setIsSubmitting(true)

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ ...formData, remember: rememberMe })
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))

                if (response.status === 404) {
                    throw new Error("User not found. Please check your email/username.")
                } else if (response.status === 403) {
                    throw new Error("Incorrect password. Please try again.")
                } else {
                    throw new Error(errorData.message || "Login failed. Please try again.")
                }
            }

            router.push("/dashboard")
        } catch (err) {
            setErrors({
                ...errors,
                general: err instanceof Error ? err.message : "Something went wrong. Please try again."
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <PageContainer>
            <div className="max-w-md mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Welcome
                        <span className="text-blue-400"> Back</span>
                    </h1>
                    <p className="text-lg text-gray-400">Sign in to continue your freelancing journey</p>
                </div>

                <Card>
                    {/* Development-only auth check status */}
                    {process.env.NODE_ENV !== "production" && authCheckStatus === "checking" && (
                        <ErrorAlert variant="info" message="Checking authentication status..." />
                    )}
                    {process.env.NODE_ENV !== "production" && authCheckStatus === "error" && (
                        <ErrorAlert
                            variant="warning"
                            message="Dev Notice: Auth check failed. Cannot connect to backend. Check console for details."
                        />
                    )}

                    {errors.general && <ErrorAlert message={errors.general} />}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <FormInput
                            id="input"
                            label="Email or Username"
                            type="text"
                            placeholder="Enter your email or username"
                            value={formData.input}
                            error={errors.input}
                            onChange={(e) => {
                                setFormData({ ...formData, input: e.target.value })
                                if (errors.input) setErrors({ ...errors, input: "" })
                            }}
                        />

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={(e) => {
                                        setFormData({ ...formData, password: e.target.value })
                                        if (errors.password) setErrors({ ...errors, password: "" })
                                    }}
                                    className={`w-full px-6 py-4 pr-12 bg-gray-900/50 border ${
                                        errors.password ? "border-red-500" : "border-blue-900/30"
                                    } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.password && <p className="mt-2 text-sm text-red-400">{errors.password}</p>}
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-600/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </div>
                                <span
                                    className={`transition-all duration-250 ease-in-out ${rememberMe ? "text-blue-400 decoration-blue-400 decoration-2 drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]" : "text-gray-400"}`}
                                >
                                    Remember me
                                </span>
                            </label>
                            <Link
                                href="/reset-password"
                                className="text-blue-400 hover:text-blue-300 transition-colors"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            isLoading={isSubmitting}
                            icon={ArrowRight}
                            className="w-full text-lg shadow-lg shadow-blue-600/20"
                        >
                            Sign In
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-400">
                            Don't have an account?{" "}
                            <Link
                                href="/register"
                                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                            >
                                Sign up
                            </Link>
                        </p>
                    </div>
                </Card>
            </div>
        </PageContainer>
    )
}
