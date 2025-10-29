"use client"

import { ArrowLeft, ArrowRight, LoaderCircle, AlertCircle, Eye, EyeOff, Mail, CheckCircle2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Footer from "@/components/footer"
import Navbar from "@/components/navbar"
import Image from "next/image"
import Link from "next/link"

const ALLOWED_EMAIL_PROVIDERS = [
    "gmail.com",
    "googlemail.com",
    "outlook.com",
    "hotmail.com",
    "live.com",
    "icloud.com",
    "proton.me",
    "protonmail.com",
    "zoho.com",
    "fastmail.com",
    "tutanota.com",
    "mailfence.com",
    "mail.com"
]

export default function RegisterPage() {
    const router = useRouter()
    const [step, setStep] = useState<"email" | "details">("email")
    const [formData, setFormData] = useState({
        email: "",
        otp: "",
        username: "",
        name: "",
        password: "",
        confirmPassword: "",
        role: "freelancer" as "freelancer" | "client" | "both"
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSendingOTP, setIsSendingOTP] = useState(false)
    const [otpSent, setOtpSent] = useState(false)
    const [errors, setErrors] = useState({
        email: "",
        otp: "",
        username: "",
        name: "",
        password: "",
        confirmPassword: "",
        general: ""
    })

    useEffect(() => {
        const userData = localStorage.getItem("user") ?? sessionStorage.getItem("user")
        if (userData) return router.push("/dashboard")
    }, [router])

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return { isValid: false, message: "Please enter a valid email address" }
        }

        const domain = email.split("@")[1]?.toLowerCase()
        if (!ALLOWED_EMAIL_PROVIDERS.includes(domain)) {
            return {
                isValid: false,
                message: "Please use a popular email provider (Gmail, Outlook, etc.)"
            }
        }

        return { isValid: true, message: "" }
    }

    const handleSendOTP = async () => {
        setErrors({ ...errors, email: "", general: "" })

        const emailValidation = validateEmail(formData.email.trim())
        if (!emailValidation.isValid) {
            setErrors({ ...errors, email: emailValidation.message })
            return
        }

        setIsSendingOTP(true)

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/verify`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formData.email.trim() })
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.message || "Failed to send OTP")
            }

            setOtpSent(true)
        } catch (err) {
            setErrors({
                ...errors,
                general: err instanceof Error ? err.message : "Failed to send OTP. Please try again."
            })
        } finally {
            setIsSendingOTP(false)
        }
    }

    const handleVerifyOTP = () => {
        setErrors({ ...errors, otp: "", general: "" })

        if (!formData.otp.trim()) {
            setErrors({ ...errors, otp: "OTP is required" })
            return
        }

        if (formData.otp.length !== 6 || !/^\d{6}$/.test(formData.otp)) {
            setErrors({ ...errors, otp: "OTP must be 6 digits" })
            return
        }

        setStep("details")
    }

    const validateDetailsForm = () => {
        const newErrors = {
            email: "",
            otp: "",
            username: "",
            name: "",
            password: "",
            confirmPassword: "",
            general: ""
        }
        let isValid = true

        if (!formData.name.trim()) {
            newErrors.name = "Full name is required"
            isValid = false
        } else if (formData.name.trim().length < 2) {
            newErrors.name = "Name must be at least 2 characters"
            isValid = false
        }

        if (!formData.username.trim()) {
            newErrors.username = "Username is required"
            isValid = false
        } else if (formData.username.length < 3 || formData.username.length > 20) {
            newErrors.username = "Username must be 3-20 characters"
            isValid = false
        } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.username)) {
            newErrors.username = "Username can only contain letters, numbers, _ and -"
            isValid = false
        }

        if (!formData.password.trim()) {
            newErrors.password = "Password is required"
            isValid = false
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters"
            isValid = false
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match"
            isValid = false
        }

        setErrors(newErrors)
        return isValid
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrors({
            email: "",
            otp: "",
            username: "",
            name: "",
            password: "",
            confirmPassword: "",
            general: ""
        })

        if (!validateDetailsForm()) return
        setIsSubmitting(true)

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: formData.email.trim(),
                    otp: formData.otp.trim(),
                    username: formData.username.trim(),
                    name: formData.name.trim(),
                    password: formData.password,
                    role: formData.role
                })
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))

                if (response.status === 403) {
                    throw new Error("Invalid or expired OTP. Please request a new one.")
                } else if (response.status === 409) {
                    if (errorData.code === "EMAIL_ALREADY_EXISTS") {
                        throw new Error("This email is already registered. Please login instead.")
                    } else if (errorData.code === "USERNAME_ALREADY_EXISTS") {
                        throw new Error("This username is already taken. Please choose another.")
                    }
                    throw new Error(errorData.message || "User already exists")
                } else {
                    throw new Error(errorData.message || "Registration failed. Please try again.")
                }
            }

            const userData = await response.json()

            localStorage.setItem("user", JSON.stringify(userData))

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
                            Join
                            <span className="text-blue-400"> fillxo</span>
                        </h1>
                        <p className="text-lg text-gray-400">
                            {step === "email"
                                ? "Start your freelancing journey today"
                                : "Complete your profile to get started"}
                        </p>
                    </div>

                    {/* Progress Steps */}
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <div
                            className={`flex items-center gap-2 ${step === "email" ? "text-blue-400" : "text-green-400"}`}
                        >
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    step === "email" ? "bg-blue-600" : "bg-green-600"
                                }`}
                            >
                                {step === "email" ? "1" : <CheckCircle2 className="w-5 h-5" />}
                            </div>
                            <span className="text-sm font-medium">Verify Email</span>
                        </div>
                        <div className={`h-px w-12 ${step === "details" ? "bg-blue-600" : "bg-gray-700"}`} />
                        <div
                            className={`flex items-center gap-2 ${step === "details" ? "text-blue-400" : "text-gray-500"}`}
                        >
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    step === "details" ? "bg-blue-600" : "bg-gray-700"
                                }`}
                            >
                                2
                            </div>
                            <span className="text-sm font-medium">Your Details</span>
                        </div>
                    </div>

                    <div className="bg-gray-900/50 border border-blue-900/30 rounded-2xl p-8 backdrop-blur-sm">
                        {errors.general && (
                            <div className="mb-6 bg-red-900/30 border border-red-700/50 rounded-xl p-4 flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                <p className="text-red-300 text-sm">{errors.general}</p>
                            </div>
                        )}

                        {step === "email" ? (
                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="your@email.com"
                                        value={formData.email}
                                        onChange={(e) => {
                                            setFormData({ ...formData, email: e.target.value })
                                            if (errors.email) setErrors({ ...errors, email: "" })
                                            setOtpSent(false)
                                        }}
                                        disabled={otpSent}
                                        className={`w-full px-6 py-4 bg-gray-900/50 border ${
                                            errors.email ? "border-red-500" : "border-blue-900/30"
                                        } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                                    />
                                    {errors.email && <p className="mt-2 text-sm text-red-400">{errors.email}</p>}
                                </div>

                                {!otpSent ? (
                                    <button
                                        type="button"
                                        onClick={handleSendOTP}
                                        disabled={isSendingOTP}
                                        className="w-full px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
                                    >
                                        {isSendingOTP ? (
                                            <>
                                                <LoaderCircle className="w-5 h-5 animate-spin" />
                                                Sending OTP...
                                            </>
                                        ) : (
                                            <>
                                                <Mail className="w-5 h-5" />
                                                Send Verification Code
                                            </>
                                        )}
                                    </button>
                                ) : (
                                    <>
                                        <div className="bg-green-900/30 border border-green-700/50 rounded-xl p-4">
                                            <p className="text-green-300 text-sm flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4" />
                                                Verification code sent to {formData.email}
                                            </p>
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="otp"
                                                className="block text-sm font-medium text-gray-300 mb-2"
                                            >
                                                Verification Code
                                            </label>
                                            <input
                                                id="otp"
                                                type="text"
                                                placeholder="Enter 6-digit code"
                                                maxLength={6}
                                                value={formData.otp}
                                                onChange={(e) => {
                                                    const value = e.target.value.replace(/\D/g, "")
                                                    setFormData({ ...formData, otp: value })
                                                    if (errors.otp) setErrors({ ...errors, otp: "" })
                                                }}
                                                className={`w-full px-6 py-4 bg-gray-900/50 border ${
                                                    errors.otp ? "border-red-500" : "border-blue-900/30"
                                                } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all text-center text-2xl tracking-widest`}
                                            />
                                            {errors.otp && <p className="mt-2 text-sm text-red-400">{errors.otp}</p>}
                                        </div>

                                        <div className="flex gap-3">
                                            <button
                                                type="button"
                                                onClick={handleSendOTP}
                                                disabled={isSendingOTP}
                                                className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 disabled:opacity-70 disabled:cursor-not-allowed rounded-xl font-medium transition-all"
                                            >
                                                Resend Code
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleVerifyOTP}
                                                className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                                            >
                                                Continue
                                                <ArrowRight className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        readOnly
                                        className="w-full px-6 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-400 cursor-not-allowed"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        placeholder="Enter your full name"
                                        value={formData.name}
                                        onChange={(e) => {
                                            setFormData({ ...formData, name: e.target.value })
                                            if (errors.name) setErrors({ ...errors, name: "" })
                                        }}
                                        className={`w-full px-6 py-4 bg-gray-900/50 border ${
                                            errors.name ? "border-red-500" : "border-blue-900/30"
                                        } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all`}
                                    />
                                    {errors.name && <p className="mt-2 text-sm text-red-400">{errors.name}</p>}
                                </div>

                                <div>
                                    <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                                        Username
                                    </label>
                                    <input
                                        id="username"
                                        type="text"
                                        placeholder="Choose a unique username"
                                        value={formData.username}
                                        onChange={(e) => {
                                            setFormData({ ...formData, username: e.target.value })
                                            if (errors.username) setErrors({ ...errors, username: "" })
                                        }}
                                        className={`w-full px-6 py-4 bg-gray-900/50 border ${
                                            errors.username ? "border-red-500" : "border-blue-900/30"
                                        } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all`}
                                    />
                                    {errors.username && <p className="mt-2 text-sm text-red-400">{errors.username}</p>}
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Create a strong password"
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
                                            {showPassword ? (
                                                <EyeOff className="w-5 h-5" />
                                            ) : (
                                                <Eye className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && <p className="mt-2 text-sm text-red-400">{errors.password}</p>}
                                </div>

                                <div>
                                    <label
                                        htmlFor="confirmPassword"
                                        className="block text-sm font-medium text-gray-300 mb-2"
                                    >
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Re-enter your password"
                                            value={formData.confirmPassword}
                                            onChange={(e) => {
                                                setFormData({ ...formData, confirmPassword: e.target.value })
                                                if (errors.confirmPassword)
                                                    setErrors({ ...errors, confirmPassword: "" })
                                            }}
                                            className={`w-full px-6 py-4 pr-12 bg-gray-900/50 border ${
                                                errors.confirmPassword ? "border-red-500" : "border-blue-900/30"
                                            } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="w-5 h-5" />
                                            ) : (
                                                <Eye className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && (
                                        <p className="mt-2 text-sm text-red-400">{errors.confirmPassword}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-3">I want to:</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { value: "freelancer", label: "Work" },
                                            { value: "client", label: "Hire" }
                                        ].map((option) => (
                                            <button
                                                key={option.value}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, role: option.value as any })}
                                                className={`px-4 py-3 rounded-xl font-medium transition-all ${
                                                    formData.role === option.value
                                                        ? "bg-blue-600 text-white border-blue-600"
                                                        : "bg-gray-900/50 text-gray-400 border-blue-900/30 hover:border-blue-600/50"
                                                } border`}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <LoaderCircle className="w-5 h-5 animate-spin" />
                                            Creating Account...
                                        </>
                                    ) : (
                                        <>
                                            Create Account
                                            <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>

                                <p className="text-xs text-center text-gray-400">
                                    By creating an account you agree to the{" "}
                                    <Link
                                        href="/terms"
                                        target="_blank"
                                        className="text-blue-400 hover:text-blue-300 underline"
                                    >
                                        Terms of Service
                                    </Link>{" "}
                                    and our{" "}
                                    <Link
                                        href="/privacy"
                                        target="_blank"
                                        className="text-blue-400 hover:text-blue-300 underline"
                                    >
                                        Privacy Policy
                                    </Link>
                                    .
                                </p>
                            </form>
                        )}

                        <div className="mt-6 text-center">
                            <p className="text-gray-400">
                                Already have an account?{" "}
                                <Link
                                    href="/login"
                                    className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                                >
                                    Sign in
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
