"use client"

import { ArrowRight, LoaderCircle, AlertCircle, Eye, EyeOff, Mail, CheckCircle2, ChevronDown } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Footer from "@/components/footer"
import Navbar from "@/components/navbar"
import Link from "next/link"

const allowed_emails = new Set([
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
])

const timezoneToCountry = new Map([
    // America
    ["America/New_York", "US"],
    ["America/Chicago", "US"],
    ["America/Denver", "US"],
    ["America/Los_Angeles", "US"],
    ["America/Anchorage", "US"],
    ["Pacific/Honolulu", "US"],
    ["America/Phoenix", "US"],
    ["America/Toronto", "CA"],
    ["America/Vancouver", "CA"],
    ["America/Montreal", "CA"],
    ["America/Mexico_City", "MX"],
    ["America/Cancun", "MX"],
    ["America/Sao_Paulo", "BR"],
    ["America/Rio_Branco", "BR"],
    ["America/Buenos_Aires", "AR"],
    ["America/Bogota", "CO"],
    ["America/Lima", "PE"],
    ["America/Santiago", "CL"],
    // Europe
    ["Europe/London", "GB"],
    ["Europe/Dublin", "IE"],
    ["Europe/Paris", "FR"],
    ["Europe/Berlin", "DE"],
    ["Europe/Rome", "IT"],
    ["Europe/Madrid", "ES"],
    ["Europe/Amsterdam", "NL"],
    ["Europe/Brussels", "BE"],
    ["Europe/Vienna", "AT"],
    ["Europe/Zurich", "CH"],
    ["Europe/Stockholm", "SE"],
    ["Europe/Copenhagen", "DK"],
    ["Europe/Oslo", "NO"],
    ["Europe/Helsinki", "FI"],
    ["Europe/Athens", "GR"],
    ["Europe/Istanbul", "TR"],
    ["Europe/Moscow", "RU"],
    ["Europe/Warsaw", "PL"],
    ["Europe/Prague", "CZ"],
    ["Europe/Budapest", "HU"],
    ["Europe/Bucharest", "RO"],
    ["Europe/Kiev", "UA"],
    ["Europe/Sofia", "BG"],
    ["Europe/Riga", "LV"],
    ["Europe/Tallinn", "EE"],
    ["Europe/Vilnius", "LT"],
    ["Europe/Belgrade", "RS"],
    ["Europe/Zagreb", "HR"],
    ["Europe/Ljubljana", "SI"],
    ["Europe/Bratislava", "SK"],
    ["Europe/Luxembourg", "LU"],
    ["Europe/Malta", "MT"],
    ["Europe/Lisbon", "PT"],
    ["Europe/Reykjavik", "IS"],
    ["Europe/Nicosia", "CY"],
    // Asia
    ["Asia/Dubai", "AE"],
    ["Asia/Riyadh", "SA"],
    ["Asia/Kolkata", "IN"],
    ["Asia/Dhaka", "BD"],
    ["Asia/Kathmandu", "NP"],
    ["Asia/Bangkok", "TH"],
    ["Asia/Ho_Chi_Minh", "VN"],
    ["Asia/Jakarta", "ID"],
    ["Asia/Singapore", "SG"],
    ["Asia/Hong_Kong", "HK"],
    ["Asia/Shanghai", "CN"],
    ["Asia/Taipei", "TW"],
    ["Asia/Manila", "PH"],
    ["Asia/Tokyo", "JP"],
    ["Asia/Seoul", "KR"],
    ["Asia/Karachi", "PK"],
    ["Asia/Colombo", "LK"],
    ["Asia/Kuala_Lumpur", "MY"],
    ["Asia/Jerusalem", "IL"],
    // Africa
    ["Africa/Cairo", "EG"],
    ["Africa/Johannesburg", "ZA"],
    ["Africa/Lagos", "NG"],
    ["Africa/Nairobi", "KE"],
    ["Africa/Casablanca", "MA"],
    // Australia & Pacific
    ["Australia/Sydney", "AU"],
    ["Australia/Melbourne", "AU"],
    ["Australia/Brisbane", "AU"],
    ["Australia/Perth", "AU"],
    ["Australia/Adelaide", "AU"],
    ["Pacific/Auckland", "NZ"],
    ["Pacific/Fiji", "FJ"]
])

const countryToPhoneCode = new Map([
    ["US", "+1"],
    ["CA", "+1"],
    ["MX", "+52"],
    ["AR", "+54"],
    ["BR", "+55"],
    ["CL", "+56"],
    ["CO", "+57"],
    ["PE", "+51"],
    ["GB", "+44"],
    ["IE", "+353"],
    ["FR", "+33"],
    ["DE", "+49"],
    ["IT", "+39"],
    ["ES", "+34"],
    ["NL", "+31"],
    ["BE", "+32"],
    ["AT", "+43"],
    ["CH", "+41"],
    ["SE", "+46"],
    ["DK", "+45"],
    ["NO", "+47"],
    ["FI", "+358"],
    ["GR", "+30"],
    ["TR", "+90"],
    ["RU", "+7"],
    ["PL", "+48"],
    ["CZ", "+420"],
    ["HU", "+36"],
    ["RO", "+40"],
    ["UA", "+380"],
    ["BG", "+359"],
    ["LV", "+371"],
    ["EE", "+372"],
    ["LT", "+370"],
    ["RS", "+381"],
    ["HR", "+385"],
    ["SI", "+386"],
    ["SK", "+421"],
    ["LU", "+352"],
    ["MT", "+356"],
    ["PT", "+351"],
    ["IS", "+354"],
    ["CY", "+357"],
    ["AE", "+971"],
    ["SA", "+966"],
    ["IN", "+91"],
    ["BD", "+880"],
    ["NP", "+977"],
    ["TH", "+66"],
    ["VN", "+84"],
    ["ID", "+62"],
    ["SG", "+65"],
    ["HK", "+852"],
    ["CN", "+86"],
    ["TW", "+886"],
    ["PH", "+63"],
    ["JP", "+81"],
    ["KR", "+82"],
    ["PK", "+92"],
    ["LK", "+94"],
    ["MY", "+60"],
    ["IL", "+972"],
    ["EG", "+20"],
    ["ZA", "+27"],
    ["NG", "+234"],
    ["KE", "+254"],
    ["MA", "+212"],
    ["AU", "+61"],
    ["NZ", "+64"],
    ["FJ", "+679"]
])

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
        role: "freelancer" as "freelancer" | "client" | "both",
        phone: "",
        phoneCountryCode: "",
        country: "",
        timezone: ""
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
        phone: "",
        country: "",
        general: ""
    })
    const [authCheckStatus, setAuthCheckStatus] = useState<"checking" | "done" | "error">("checking")

    useEffect(() => {
        const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
        const detectedCountry = timezoneToCountry.get(detectedTimezone) ?? ""
        const detectedPhoneCode = countryToPhoneCode.get(detectedCountry) ?? ""

        setFormData((prev) => ({
            ...prev,
            timezone: detectedTimezone,
            country: detectedCountry,
            phoneCountryCode: detectedPhoneCode
        }))

        const checkAuth = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/me`, {
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

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return { isValid: false, message: "Please enter a valid email address" }
        }

        const domain = email.split("@")[1]?.toLowerCase()
        if (!allowed_emails.has(domain)) {
            return {
                isValid: false,
                message: "Please use a popular email provider (Gmail, Outlook, etc.)"
            }
        }

        return { isValid: true, message: "" }
    }

    const handleSendOTP = async () => {
        setErrors({ ...errors, email: "", phone: "", country: "", general: "" })

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
                throw new Error(errorData.message ?? "Failed to send OTP")
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
        setErrors({ ...errors, otp: "", phone: "", country: "", general: "" })

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
            phone: "",
            country: "",
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
        } else if (!/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(formData.username)) {
            newErrors.username = "Username must start with a letter and can only contain letters, numbers, _ and -"
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

        if (formData.phone.trim()) {
            if (!formData.phoneCountryCode) {
                newErrors.phone = "Please select a country code"
                isValid = false
            } else if (!/^\d{4,15}$/.test(formData.phone.trim())) {
                newErrors.phone = "Phone number must be 4-15 digits"
                isValid = false
            }
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
            phone: "",
            country: "",
            general: ""
        })

        if (!validateDetailsForm()) return
        setIsSubmitting(true)

        try {
            const payload: any = {
                email: formData.email.trim(),
                otp: formData.otp.trim(),
                username: formData.username.trim(),
                name: formData.name.trim(),
                password: formData.password,
                role: formData.role
            }

            // Add optional fields if provided
            if (formData.phone.trim() && formData.phoneCountryCode) {
                payload.phone = formData.phoneCountryCode + formData.phone.trim()
            }
            if (formData.country.trim()) payload.country = formData.country.trim().toUpperCase()
            if (formData.timezone.trim()) payload.timezone = formData.timezone.trim()

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
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
                    throw new Error(errorData.message ?? "User already exists")
                } else {
                    throw new Error(errorData.message ?? "Registration failed. Please try again.")
                }
            }

            router.push("/dashboard")
        } catch (err) {
            setErrors({
                ...errors,
                email: "",
                otp: "",
                username: "",
                name: "",
                password: "",
                confirmPassword: "",
                phone: "",
                country: "",
                general: err instanceof Error ? err.message : "Something went wrong. Please try again."
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-950 via-blue-950 to-slate-950 text-white flex flex-col">
            <Navbar />

            {/* Main Content */}
            <section className="pt-24 pb-16 px-4 flex-1">
                <div className="max-w-xl mx-auto">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-cyan-400">
                            Create Your Account
                        </h1>
                        <p className="text-base text-gray-400">
                            {step === "email"
                                ? "Start your freelancing journey today"
                                : "Complete your profile to get started"}
                        </p>
                    </div>

                    {/* Progress Steps */}
                    <div className="flex items-center justify-center gap-3 mb-8">
                        <div
                            className={`flex items-center gap-2 transition-all ${step === "email" ? "text-blue-400" : "text-emerald-400"}`}
                        >
                            <div
                                className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold transition-all ${
                                    step === "email"
                                        ? "bg-blue-600 shadow-lg shadow-blue-600/50"
                                        : "bg-emerald-600 shadow-lg shadow-emerald-600/50"
                                }`}
                            >
                                {step === "email" ? "1" : <CheckCircle2 className="w-5 h-5" />}
                            </div>
                            <span className="text-sm font-medium hidden sm:inline">Verify Email</span>
                        </div>
                        <div
                            className={`h-0.5 w-16 transition-all ${step === "details" ? "bg-linear-to-r from-emerald-600 to-blue-600" : "bg-gray-700"}`}
                        />
                        <div
                            className={`flex items-center gap-2 transition-all ${step === "details" ? "text-blue-400" : "text-gray-500"}`}
                        >
                            <div
                                className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold transition-all ${
                                    step === "details"
                                        ? "bg-blue-600 shadow-lg shadow-blue-600/50"
                                        : "bg-gray-800 border-2 border-gray-700"
                                }`}
                            >
                                2
                            </div>
                            <span className="text-sm font-medium hidden sm:inline">Your Details</span>
                        </div>
                    </div>

                    <div className="bg-slate-900/80 border border-slate-800/50 rounded-2xl p-6 md:p-8 backdrop-blur-xl shadow-2xl">
                        {/* Development-only auth check status */}
                        {process.env.NODE_ENV !== "production" && authCheckStatus === "checking" && (
                            <div className="mb-6 bg-blue-900/30 border border-blue-700/50 rounded-xl p-4 flex items-start gap-3">
                                <LoaderCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5 animate-spin" />
                                <p className="text-blue-300 text-sm">Checking authentication status...</p>
                            </div>
                        )}
                        {process.env.NODE_ENV !== "production" && authCheckStatus === "error" && (
                            <div className="mb-6 bg-yellow-900/30 border border-yellow-700/50 rounded-xl p-4 flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                                <div className="text-yellow-300 text-sm">
                                    <p className="font-medium mb-1">Dev Notice: Auth check failed</p>
                                    <p className="text-xs text-yellow-400">
                                        Cannot connect to backend. Check console for details.
                                    </p>
                                </div>
                            </div>
                        )}

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
                                        className={`w-full px-5 py-3.5 bg-slate-950/50 border ${
                                            errors.email ? "border-red-500/50" : "border-slate-700/50"
                                        } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                                    />
                                    {errors.email && <p className="mt-2 text-sm text-red-400">{errors.email}</p>}
                                </div>

                                {!otpSent ? (
                                    <button
                                        type="button"
                                        onClick={handleSendOTP}
                                        disabled={isSendingOTP}
                                        className="w-full px-8 py-3.5 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-70 disabled:cursor-not-allowed rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
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
                                        <div className="bg-emerald-900/20 border border-emerald-700/40 rounded-xl p-4">
                                            <p className="text-emerald-300 text-sm flex items-center gap-2">
                                                <CheckCircle2 className="w-5 h-5" />
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
                                                className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-70 disabled:cursor-not-allowed rounded-xl font-medium transition-all border border-slate-700/50"
                                            >
                                                Resend Code
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleVerifyOTP}
                                                className="flex-1 px-4 py-3 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
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
                                        className={`w-full px-5 py-3.5 bg-slate-950/50 border ${
                                            errors.name ? "border-red-500/50" : "border-slate-700/50"
                                        } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all`}
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
                                        className={`w-full px-5 py-3.5 bg-slate-950/50 border ${
                                            errors.username ? "border-red-500/50" : "border-slate-700/50"
                                        } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all`}
                                    />
                                    {errors.username && <p className="mt-2 text-sm text-red-400">{errors.username}</p>}
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                                        Phone Number{" "}
                                    </label>
                                    <div className="flex gap-2">
                                        <div className="relative">
                                            <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                            <select
                                                id="phoneCountryCode"
                                                value={formData.phoneCountryCode}
                                                onChange={(e) => {
                                                    setFormData({ ...formData, phoneCountryCode: e.target.value })
                                                }}
                                                className="w-[110px] pl-9 pr-3 py-3.5 bg-slate-950/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none"
                                            >
                                                <option value="">Code</option>
                                                <optgroup label="North America">
                                                    <option value="+1">+1 US/CA</option>
                                                </optgroup>
                                                <optgroup label="Europe">
                                                    <option value="+30">+30</option>
                                                    <option value="+31">+31</option>
                                                    <option value="+32">+32</option>
                                                    <option value="+33">+33</option>
                                                    <option value="+34">+34</option>
                                                    <option value="+39">+39</option>
                                                    <option value="+40">+40</option>
                                                    <option value="+41">+41</option>
                                                    <option value="+43">+43</option>
                                                    <option value="+44">+44</option>
                                                    <option value="+45">+45</option>
                                                    <option value="+46">+46</option>
                                                    <option value="+47">+47</option>
                                                    <option value="+48">+48</option>
                                                    <option value="+49">+49</option>
                                                    <option value="+351">+351</option>
                                                    <option value="+352">+352</option>
                                                    <option value="+353">+353</option>
                                                    <option value="+354">+354</option>
                                                    <option value="+356">+356</option>
                                                    <option value="+357">+357</option>
                                                    <option value="+358">+358</option>
                                                    <option value="+370">+370</option>
                                                    <option value="+371">+371</option>
                                                    <option value="+372">+372</option>
                                                    <option value="+380">+380</option>
                                                    <option value="+381">+381</option>
                                                    <option value="+385">+385</option>
                                                    <option value="+386">+386</option>
                                                    <option value="+420">+420</option>
                                                    <option value="+421">+421</option>
                                                </optgroup>
                                                <optgroup label="Asia">
                                                    <option value="+7">+7</option>
                                                    <option value="+60">+60</option>
                                                    <option value="+62">+62</option>
                                                    <option value="+63">+63</option>
                                                    <option value="+65">+65</option>
                                                    <option value="+66">+66</option>
                                                    <option value="+81">+81</option>
                                                    <option value="+82">+82</option>
                                                    <option value="+84">+84</option>
                                                    <option value="+86">+86</option>
                                                    <option value="+90">+90</option>
                                                    <option value="+91">+91</option>
                                                    <option value="+92">+92</option>
                                                    <option value="+94">+94</option>
                                                    <option value="+852">+852</option>
                                                    <option value="+880">+880</option>
                                                    <option value="+886">+886</option>
                                                    <option value="+966">+966</option>
                                                    <option value="+971">+971</option>
                                                    <option value="+972">+972</option>
                                                    <option value="+977">+977</option>
                                                </optgroup>
                                                <optgroup label="South America">
                                                    <option value="+51">+51</option>
                                                    <option value="+52">+52</option>
                                                    <option value="+54">+54</option>
                                                    <option value="+55">+55</option>
                                                    <option value="+56">+56</option>
                                                    <option value="+57">+57</option>
                                                </optgroup>
                                                <optgroup label="Africa">
                                                    <option value="+20">+20</option>
                                                    <option value="+27">+27</option>
                                                    <option value="+212">+212</option>
                                                    <option value="+234">+234</option>
                                                    <option value="+254">+254</option>
                                                </optgroup>
                                                <optgroup label="Oceania">
                                                    <option value="+61">+61</option>
                                                    <option value="+64">+64</option>
                                                    <option value="+679">+679</option>
                                                </optgroup>
                                            </select>
                                        </div>
                                        <input
                                            id="phone"
                                            type="tel"
                                            placeholder="1234567890"
                                            value={formData.phone}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, "")
                                                setFormData({ ...formData, phone: value })
                                                if (errors.phone) setErrors({ ...errors, phone: "" })
                                            }}
                                            className={`flex-1 px-5 py-3.5 bg-slate-950/50 border ${
                                                errors.phone ? "border-red-500/50" : "border-slate-700/50"
                                            } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all`}
                                        />
                                    </div>
                                    {errors.phone && <p className="mt-2 text-sm text-red-400">{errors.phone}</p>}
                                </div>

                                <div>
                                    <label htmlFor="country" className="block text-sm font-medium text-gray-300 mb-2">
                                        Country
                                    </label>
                                    <div className="relative">
                                        <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                        <select
                                            id="country"
                                            value={formData.country}
                                            onChange={(e) => {
                                                setFormData({ ...formData, country: e.target.value })
                                                if (errors.country) setErrors({ ...errors, country: "" })
                                            }}
                                            className={`w-full pl-12 pr-5 py-3.5 bg-slate-950/50 border ${
                                                errors.country ? "border-red-500/50" : "border-slate-700/50"
                                            } rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none`}
                                        >
                                            <option value="">Select a country</option>
                                            <option value="AR">Argentina</option>
                                            <option value="AU">Australia</option>
                                            <option value="AT">Austria</option>
                                            <option value="BD">Bangladesh</option>
                                            <option value="BE">Belgium</option>
                                            <option value="BR">Brazil</option>
                                            <option value="BG">Bulgaria</option>
                                            <option value="CA">Canada</option>
                                            <option value="CL">Chile</option>
                                            <option value="CN">China</option>
                                            <option value="CO">Colombia</option>
                                            <option value="HR">Croatia</option>
                                            <option value="CY">Cyprus</option>
                                            <option value="CZ">Czech Republic</option>
                                            <option value="DK">Denmark</option>
                                            <option value="EG">Egypt</option>
                                            <option value="EE">Estonia</option>
                                            <option value="FI">Finland</option>
                                            <option value="FR">France</option>
                                            <option value="DE">Germany</option>
                                            <option value="GR">Greece</option>
                                            <option value="HK">Hong Kong</option>
                                            <option value="HU">Hungary</option>
                                            <option value="IS">Iceland</option>
                                            <option value="IN">India</option>
                                            <option value="ID">Indonesia</option>
                                            <option value="IE">Ireland</option>
                                            <option value="IT">Italy</option>
                                            <option value="JP">Japan</option>
                                            <option value="KE">Kenya</option>
                                            <option value="KR">South Korea</option>
                                            <option value="LV">Latvia</option>
                                            <option value="LT">Lithuania</option>
                                            <option value="LU">Luxembourg</option>
                                            <option value="MY">Malaysia</option>
                                            <option value="MT">Malta</option>
                                            <option value="MX">Mexico</option>
                                            <option value="NL">Netherlands</option>
                                            <option value="NZ">New Zealand</option>
                                            <option value="NG">Nigeria</option>
                                            <option value="NO">Norway</option>
                                            <option value="PK">Pakistan</option>
                                            <option value="PE">Peru</option>
                                            <option value="PH">Philippines</option>
                                            <option value="PL">Poland</option>
                                            <option value="PT">Portugal</option>
                                            <option value="RO">Romania</option>
                                            <option value="RU">Russia</option>
                                            <option value="SA">Saudi Arabia</option>
                                            <option value="RS">Serbia</option>
                                            <option value="SG">Singapore</option>
                                            <option value="SK">Slovakia</option>
                                            <option value="SI">Slovenia</option>
                                            <option value="ZA">South Africa</option>
                                            <option value="ES">Spain</option>
                                            <option value="LK">Sri Lanka</option>
                                            <option value="SE">Sweden</option>
                                            <option value="CH">Switzerland</option>
                                            <option value="TW">Taiwan</option>
                                            <option value="TH">Thailand</option>
                                            <option value="TR">Turkey</option>
                                            <option value="UA">Ukraine</option>
                                            <option value="AE">United Arab Emirates</option>
                                            <option value="GB">United Kingdom</option>
                                            <option value="US">United States</option>
                                            <option value="VN">Vietnam</option>
                                        </select>
                                    </div>
                                    {errors.country && <p className="mt-2 text-sm text-red-400">{errors.country}</p>}
                                </div>

                                <div>
                                    <label htmlFor="timezone" className="block text-sm font-medium text-gray-300 mb-2">
                                        Timezone{" "}
                                    </label>
                                    <div className="relative">
                                        <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                        <select
                                            id="timezone"
                                            value={formData.timezone}
                                            onChange={(e) => {
                                                setFormData({ ...formData, timezone: e.target.value })
                                            }}
                                            className="w-full pl-12 pr-5 py-3.5 bg-slate-950/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none"
                                        >
                                            <option value="">Select a timezone</option>
                                            <optgroup label="UTC">
                                                <option value="UTC">UTC (Coordinated Universal Time)</option>
                                            </optgroup>
                                            <optgroup label="America">
                                                <option value="America/New_York">Eastern Time (New York)</option>
                                                <option value="America/Chicago">Central Time (Chicago)</option>
                                                <option value="America/Denver">Mountain Time (Denver)</option>
                                                <option value="America/Los_Angeles">Pacific Time (Los Angeles)</option>
                                                <option value="America/Anchorage">Alaska Time (Anchorage)</option>
                                                <option value="Pacific/Honolulu">Hawaii Time (Honolulu)</option>
                                                <option value="America/Toronto">Eastern Time (Toronto)</option>
                                                <option value="America/Vancouver">Pacific Time (Vancouver)</option>
                                                <option value="America/Mexico_City">Central Time (Mexico City)</option>
                                                <option value="America/Sao_Paulo">Brasilia Time (São Paulo)</option>
                                                <option value="America/Buenos_Aires">
                                                    Argentina Time (Buenos Aires)
                                                </option>
                                                <option value="America/Bogota">Colombia Time (Bogotá)</option>
                                                <option value="America/Lima">Peru Time (Lima)</option>
                                                <option value="America/Santiago">Chile Time (Santiago)</option>
                                            </optgroup>
                                            <optgroup label="Europe">
                                                <option value="Europe/London">British Time (London)</option>
                                                <option value="Europe/Dublin">Irish Time (Dublin)</option>
                                                <option value="Europe/Paris">Central European Time (Paris)</option>
                                                <option value="Europe/Berlin">Central European Time (Berlin)</option>
                                                <option value="Europe/Rome">Central European Time (Rome)</option>
                                                <option value="Europe/Madrid">Central European Time (Madrid)</option>
                                                <option value="Europe/Amsterdam">
                                                    Central European Time (Amsterdam)
                                                </option>
                                                <option value="Europe/Brussels">
                                                    Central European Time (Brussels)
                                                </option>
                                                <option value="Europe/Vienna">Central European Time (Vienna)</option>
                                                <option value="Europe/Zurich">Central European Time (Zurich)</option>
                                                <option value="Europe/Stockholm">
                                                    Central European Time (Stockholm)
                                                </option>
                                                <option value="Europe/Copenhagen">
                                                    Central European Time (Copenhagen)
                                                </option>
                                                <option value="Europe/Oslo">Central European Time (Oslo)</option>
                                                <option value="Europe/Helsinki">
                                                    Eastern European Time (Helsinki)
                                                </option>
                                                <option value="Europe/Athens">Eastern European Time (Athens)</option>
                                                <option value="Europe/Istanbul">Turkey Time (Istanbul)</option>
                                                <option value="Europe/Moscow">Moscow Time (Moscow)</option>
                                                <option value="Europe/Warsaw">Central European Time (Warsaw)</option>
                                                <option value="Europe/Prague">Central European Time (Prague)</option>
                                                <option value="Europe/Budapest">
                                                    Central European Time (Budapest)
                                                </option>
                                                <option value="Europe/Bucharest">
                                                    Eastern European Time (Bucharest)
                                                </option>
                                                <option value="Europe/Kiev">Eastern European Time (Kiev)</option>
                                            </optgroup>
                                            <optgroup label="Asia">
                                                <option value="Asia/Dubai">Gulf Standard Time (Dubai)</option>
                                                <option value="Asia/Riyadh">Arabia Standard Time (Riyadh)</option>
                                                <option value="Asia/Kolkata">India Standard Time (Kolkata)</option>
                                                <option value="Asia/Dhaka">Bangladesh Time (Dhaka)</option>
                                                <option value="Asia/Kathmandu">Nepal Time (Kathmandu)</option>
                                                <option value="Asia/Bangkok">Indochina Time (Bangkok)</option>
                                                <option value="Asia/Ho_Chi_Minh">Indochina Time (Ho Chi Minh)</option>
                                                <option value="Asia/Jakarta">Western Indonesia Time (Jakarta)</option>
                                                <option value="Asia/Singapore">Singapore Time (Singapore)</option>
                                                <option value="Asia/Hong_Kong">Hong Kong Time (Hong Kong)</option>
                                                <option value="Asia/Shanghai">China Standard Time (Shanghai)</option>
                                                <option value="Asia/Taipei">Taipei Time (Taiwan)</option>
                                                <option value="Asia/Manila">Philippine Time (Manila)</option>
                                                <option value="Asia/Tokyo">Japan Standard Time (Tokyo)</option>
                                                <option value="Asia/Seoul">Korea Standard Time (Seoul)</option>
                                                <option value="Asia/Karachi">Pakistan Standard Time (Karachi)</option>
                                                <option value="Asia/Tashkent">Uzbekistan Time (Tashkent)</option>
                                                <option value="Asia/Almaty">East Kazakhstan Time (Almaty)</option>
                                            </optgroup>
                                            <optgroup label="Africa">
                                                <option value="Africa/Cairo">Eastern European Time (Cairo)</option>
                                                <option value="Africa/Johannesburg">
                                                    South Africa Time (Johannesburg)
                                                </option>
                                                <option value="Africa/Lagos">West Africa Time (Lagos)</option>
                                                <option value="Africa/Nairobi">East Africa Time (Nairobi)</option>
                                                <option value="Africa/Casablanca">
                                                    Western European Time (Casablanca)
                                                </option>
                                            </optgroup>
                                            <optgroup label="Australia & Pacific">
                                                <option value="Australia/Sydney">
                                                    Australian Eastern Time (Sydney)
                                                </option>
                                                <option value="Australia/Melbourne">
                                                    Australian Eastern Time (Melbourne)
                                                </option>
                                                <option value="Australia/Brisbane">
                                                    Australian Eastern Time (Brisbane)
                                                </option>
                                                <option value="Australia/Perth">Australian Western Time (Perth)</option>
                                                <option value="Australia/Adelaide">
                                                    Australian Central Time (Adelaide)
                                                </option>
                                                <option value="Pacific/Auckland">New Zealand Time (Auckland)</option>
                                                <option value="Pacific/Fiji">Fiji Time (Fiji)</option>
                                            </optgroup>
                                        </select>
                                    </div>
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
                                            className={`w-full px-5 py-3.5 pr-12 bg-slate-950/50 border ${
                                                errors.password ? "border-red-500/50" : "border-slate-700/50"
                                            } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all`}
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
                                            className={`w-full px-5 py-3.5 pr-12 bg-slate-950/50 border ${
                                                errors.confirmPassword ? "border-red-500/50" : "border-slate-700/50"
                                            } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all`}
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
                                    className="w-full px-8 py-3.5 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-70 disabled:cursor-not-allowed rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
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
                                        className="text-blue-400 hover:text-blue-300 underline transition-colors"
                                    >
                                        Terms of Service
                                    </Link>{" "}
                                    and{" "}
                                    <Link
                                        href="/privacy"
                                        target="_blank"
                                        className="text-blue-400 hover:text-blue-300 underline transition-colors"
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
