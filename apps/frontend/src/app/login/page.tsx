"use client"

import { ArrowLeft, ArrowRight, LoaderCircle, AlertCircle, Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Footer from "@/components/footer"
import Navbar from "@/components/navbar"
import Image from "next/image"
import Link from "next/link"

export default function LoginPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({ input: "", password: "" })
    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errors, setErrors] = useState({ input: "", password: "", general: "" })

    useEffect(() => {
        const userData = localStorage.getItem("user") ?? sessionStorage.getItem("user")
        if (userData) return router.push("/dashboard")
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
                body: JSON.stringify(formData)
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

            const userData = await response.json()

            if (rememberMe) {
                localStorage.setItem("user", JSON.stringify(userData))
            } else {
                sessionStorage.setItem("user", JSON.stringify(userData))
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
        <div className="min-h-screen bg-linear-to-br from-gray-950 via-blue-950 to-gray-950 text-white flex flex-col">
            <Navbar />

            {/* Main Content */}
            <section className="pt-32 pb-20 px-6 flex-1">
                <div className="max-w-md mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Welcome
                            <span className="text-blue-400"> Back</span>
                        </h1>
                        <p className="text-lg text-gray-400">Sign in to continue your freelancing journey</p>
                    </div>

                    <div className="bg-gray-900/50 border border-blue-900/30 rounded-2xl p-8 backdrop-blur-sm">
                        {errors.general && (
                            <div className="mb-6 bg-red-900/30 border border-red-700/50 rounded-xl p-4 flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                <p className="text-red-300 text-sm">{errors.general}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="input" className="block text-sm font-medium text-gray-300 mb-2">
                                    Email or Username
                                </label>
                                <input
                                    id="input"
                                    type="text"
                                    placeholder="Enter your email or username"
                                    value={formData.input}
                                    onChange={(e) => {
                                        setFormData({ ...formData, input: e.target.value })
                                        if (errors.input) setErrors({ ...errors, input: "" })
                                    }}
                                    className={`w-full px-6 py-4 bg-gray-900/50 border ${
                                        errors.input ? "border-red-500" : "border-blue-900/30"
                                    } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all`}
                                />
                                {errors.input && <p className="mt-2 text-sm text-red-400">{errors.input}</p>}
                            </div>

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

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
                            >
                                {isSubmitting ? (
                                    <>
                                        <LoaderCircle className="w-5 h-5 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
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
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
