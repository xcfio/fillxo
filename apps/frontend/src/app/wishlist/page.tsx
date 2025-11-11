"use client"

import { ArrowRight, CheckCircle2, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { FormInput } from "@/components/ui/form-input"
import { Button } from "@/components/ui/button"
import { ErrorAlert } from "@/components/ui/error-alert"
import { Card } from "@/components/ui/card"
import Footer from "@/components/footer"
import Image from "next/image"

const ALLOWED_EMAIL_PROVIDERS = [
    "gmail.com",
    "googlemail.com",
    "outlook.com",
    "hotmail.com",
    "live.com",
    "icloud.com",
    "proton.me",
    "protonmail.com",
    "proton.me",
    "zoho.com",
    "fastmail.com",
    "tutanota.com",
    "mailfence.com",
    "mail.com"
]

export default function WishlistPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({ fullName: "", email: "" })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [errors, setErrors] = useState({ fullName: "", email: "", general: "" })

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

    const validateForm = () => {
        const newErrors = { fullName: "", email: "", general: "" }
        let isValid = true

        if (!formData.fullName.trim()) {
            newErrors.fullName = "Full name is required"
            isValid = false
        } else if (formData.fullName.trim().length < 2) {
            newErrors.fullName = "Name must be at least 2 characters"
            isValid = false
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required"
            isValid = false
        } else {
            const emailValidation = validateEmail(formData.email.trim())
            if (!emailValidation.isValid) {
                newErrors.email = emailValidation.message
                isValid = false
            }
        }

        setErrors(newErrors)
        return isValid
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrors({ fullName: "", email: "", general: "" })

        if (!validateForm()) return
        setIsSubmitting(true)

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/wishlist`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.message || "Failed to join wishlist")
            }

            setIsSuccess(true)
            setFormData({ fullName: "", email: "" })
            setTimeout(() => router.push("/"), 3000)
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
        <div className="min-h-screen bg-linear-to-br from-gray-950 via-blue-950 to-gray-950 text-white">
            {/* Navigation */}
            <nav className="fixed top-0 w-full bg-gray-900/80 backdrop-blur-md border-b border-blue-900/20 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <button
                        onClick={() => router.push("/")}
                        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                    >
                        <Image src="/favicon.svg" alt="fillxo" width={32} height={32} className="w-8 h-8" />
                        <span className="text-2xl font-bold bg-linear-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                            fillxo
                        </span>
                    </button>
                    <button
                        onClick={() => router.push("/")}
                        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <section className="pt-32 pb-20 px-6">
                <div className="max-w-lg mx-auto">
                    {isSuccess ? (
                        <div className="text-center">
                            <div className="w-20 h-20 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="w-10 h-10 text-green-400" />
                            </div>
                            <h1 className="text-4xl font-bold mb-4">You're on the list!</h1>
                            <p className="text-xl text-gray-400 mb-8">
                                We'll notify you as soon as fillxo launches. Get ready to transform your freelance
                                business!
                            </p>
                            <div className="bg-green-900/30 border border-green-700/50 rounded-xl p-6">
                                <p className="text-green-300 font-medium mb-2">Welcome to the fillxo community 🎉</p>
                                <p className="text-green-400/70 text-sm">Redirecting you back to home...</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="text-center mb-12">
                                <div className="inline-block mb-6 px-4 py-2 bg-blue-900/30 border border-blue-700/50 rounded-full text-blue-300 text-sm">
                                    ✨ Coming Soon
                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                                    Get Early
                                    <span className="text-blue-400"> Access</span>
                                </h1>
                                <p className="text-lg text-gray-400">
                                    Join the wishlist and be notified when fillxo launches in Bangladesh.
                                </p>
                            </div>

                            <div className="bg-gray-900/50 border border-blue-900/30 rounded-2xl p-8 backdrop-blur-sm">
                                {errors.general && <ErrorAlert message={errors.general} />}

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <FormInput
                                        id="fullName"
                                        label="Full Name"
                                        type="text"
                                        placeholder="Enter your full name"
                                        value={formData.fullName}
                                        error={errors.fullName}
                                        onChange={(e) => {
                                            setFormData({ ...formData, fullName: e.target.value })
                                            if (errors.fullName) setErrors({ ...errors, fullName: "" })
                                        }}
                                    />

                                    <FormInput
                                        id="email"
                                        label="Email Address"
                                        type="email"
                                        placeholder="your@email.com"
                                        value={formData.email}
                                        error={errors.email}
                                        onChange={(e) => {
                                            setFormData({ ...formData, email: e.target.value })
                                            if (errors.email) setErrors({ ...errors, email: "" })
                                        }}
                                    />

                                    <Button
                                        type="submit"
                                        isLoading={isSubmitting}
                                        icon={ArrowRight}
                                        className="w-full text-lg shadow-lg shadow-blue-600/20"
                                    >
                                        Join the Wishlist
                                    </Button>

                                    <p className="text-gray-500 text-sm text-center">
                                        We respect your privacy. No spam, ever.
                                    </p>
                                </form>
                            </div>

                            {/* Benefits */}
                            <div className="mt-12 space-y-4">
                                <h3 className="text-lg font-semibold text-center mb-6">What you'll get:</h3>
                                <div className="space-y-3">
                                    {[
                                        "Early access before public launch",
                                        "Exclusive launch discounts and offers",
                                        "Priority support during beta",
                                        "Direct input on features and improvements"
                                    ].map((benefit, index) => (
                                        <div
                                            key={index}
                                            className="flex items-start gap-3 bg-gray-900/30 border border-blue-900/20 rounded-lg p-4"
                                        >
                                            <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                                            <span className="text-gray-300">{benefit}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    )
}
