"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Mail, User, Phone, Lock, Send, CheckCircle, ArrowRight, Globe } from "lucide-react"
import { PageContainer } from "@/components/ui/page-container"
import { Card } from "@/components/ui/card"
import { FormInput } from "@/components/ui/form-input"
import { ErrorAlert } from "@/components/ui/error-alert"
import { isAuthenticated } from "@/utils/auth"

const PhoneCodes = new Map([
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
    ["EG", "+20"],
    ["ZA", "+27"],
    ["NG", "+234"],
    ["KE", "+254"],
    ["MA", "+212"],
    ["AU", "+61"],
    ["NZ", "+64"],
    ["FJ", "+679"]
])

const Countries = [
    { code: "BD", name: "Bangladesh" },
    { code: "US", name: "United States" },
    { code: "GB", name: "United Kingdom" },
    { code: "CA", name: "Canada" },
    { code: "AU", name: "Australia" },
    { code: "IN", name: "India" },
    { code: "PK", name: "Pakistan" },
    { code: "AF", name: "Afghanistan" },
    { code: "AE", name: "United Arab Emirates" },
    { code: "AR", name: "Argentina" },
    { code: "AT", name: "Austria" },
    { code: "BE", name: "Belgium" },
    { code: "BR", name: "Brazil" },
    { code: "BG", name: "Bulgaria" },
    { code: "CH", name: "Switzerland" },
    { code: "CL", name: "Chile" },
    { code: "CN", name: "China" },
    { code: "CO", name: "Colombia" },
    { code: "HR", name: "Croatia" },
    { code: "CY", name: "Cyprus" },
    { code: "CZ", name: "Czech Republic" },
    { code: "DE", name: "Germany" },
    { code: "DK", name: "Denmark" },
    { code: "EE", name: "Estonia" },
    { code: "EG", name: "Egypt" },
    { code: "ES", name: "Spain" },
    { code: "FI", name: "Finland" },
    { code: "FJ", name: "Fiji" },
    { code: "FR", name: "France" },
    { code: "GR", name: "Greece" },
    { code: "HK", name: "Hong Kong" },
    { code: "HU", name: "Hungary" },
    { code: "ID", name: "Indonesia" },
    { code: "IE", name: "Ireland" },
    { code: "IS", name: "Iceland" },
    { code: "IT", name: "Italy" },
    { code: "JP", name: "Japan" },
    { code: "KE", name: "Kenya" },
    { code: "KR", name: "South Korea" },
    { code: "LK", name: "Sri Lanka" },
    { code: "LT", name: "Lithuania" },
    { code: "LU", name: "Luxembourg" },
    { code: "LV", name: "Latvia" },
    { code: "MA", name: "Morocco" },
    { code: "MT", name: "Malta" },
    { code: "MX", name: "Mexico" },
    { code: "MY", name: "Malaysia" },
    { code: "NG", name: "Nigeria" },
    { code: "NL", name: "Netherlands" },
    { code: "NO", name: "Norway" },
    { code: "NP", name: "Nepal" },
    { code: "NZ", name: "New Zealand" },
    { code: "PE", name: "Peru" },
    { code: "PH", name: "Philippines" },
    { code: "PL", name: "Poland" },
    { code: "PT", name: "Portugal" },
    { code: "RO", name: "Romania" },
    { code: "RS", name: "Serbia" },
    { code: "RU", name: "Russia" },
    { code: "SA", name: "Saudi Arabia" },
    { code: "SE", name: "Sweden" },
    { code: "SG", name: "Singapore" },
    { code: "SI", name: "Slovenia" },
    { code: "SK", name: "Slovakia" },
    { code: "TH", name: "Thailand" },
    { code: "TR", name: "Turkey" },
    { code: "TW", name: "Taiwan" },
    { code: "UA", name: "Ukraine" },
    { code: "VN", name: "Vietnam" },
    { code: "ZA", name: "South Africa" }
]

// Phone Input Component with Country Code
function PhoneInput({
    value,
    onChange,
    error,
    countryCode,
    onCountryCodeChange
}: {
    value: string
    onChange: (value: string) => void
    error?: string
    countryCode: string
    onCountryCodeChange: (value: string) => void
}) {
    return (
        <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <Phone className="w-4 h-4 text-blue-400" />
                Phone Number
            </label>
            <div className="flex gap-0 border border-blue-900/30 rounded-lg overflow-hidden bg-gray-900/50">
                <input
                    type="text"
                    value={countryCode}
                    onChange={(e) => onCountryCodeChange(e.target.value)}
                    placeholder="+880"
                    className="w-20 sm:w-24 px-3 py-3 bg-transparent border-r border-blue-900/30 focus:outline-none focus:bg-gray-800/50 transition-all text-white text-center font-medium"
                />
                <input
                    type="tel"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="1712345678"
                    className="flex-1 px-4 py-3 bg-transparent focus:outline-none focus:bg-gray-800/50 transition-all text-white placeholder-gray-500"
                />
            </div>
            {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
        </div>
    )
}

export default function RegisterPage() {
    const router = useRouter()
    const [step, setStep] = useState(1) // 1: Form, 2: OTP, 3: Success
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    // Form data
    const [formData, setFormData] = useState({
        email: "",
        username: "",
        name: "",
        gender: "",
        phone: "",
        countryCode: "",
        country: "",
        password: "",
        confirmPassword: "",
        role: "freelancer"
    })

    const [otp, setOtp] = useState("")
    const [errors, setErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        const checkAuth = async () => (await isAuthenticated()) && router.push("/dashboard")
        checkAuth()
    }, [router])

    useEffect(() => {
        const detectCountry = async () => {
            try {
                const response = await fetch(`https://ipapi.co/country/`)
                const country = (await response.text()).trim().toUpperCase()
                const detectedCode = PhoneCodes.get(country) ?? ""

                if (country === "IL") {
                    setStep(3)
                    setError("Registration is not available in your country.")
                }

                setFormData((prev) => ({
                    ...prev,
                    countryCode: detectedCode,
                    country: country || "BD" // Store country code (ISO 3166-1 alpha-2)
                }))
            } catch (err) {
                // Default to Bangladesh if detection fails
                console.log("Country detection failed, defaulting to BD")
                setFormData((prev) => ({
                    ...prev,
                    country: "BD"
                }))
            }
        }

        // Check URL params for role
        const urlParams = new URLSearchParams(window.location.search)
        const roleParam = urlParams.get("role")
        if (roleParam === "client" || roleParam === "freelancer") {
            setFormData((prev) => ({
                ...prev,
                role: roleParam
            }))
        }

        detectCountry()
    }, [])

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            newErrors.email = "Invalid email format"
        }

        if (formData.username.length < 3 || !formData.username.match(/^[a-zA-Z0-9_-]+$/)) {
            newErrors.username = "Username must be 3+ chars (letters, numbers, _, -)"
        }

        if (formData.name.length < 2) {
            newErrors.name = "Name must be at least 2 characters"
        }

        if (!formData.gender || !["male", "female", "other"].includes(formData.gender)) {
            newErrors.gender = "Please select a gender"
        }

        if (!formData.country || formData.country.length !== 2) {
            newErrors.country = "Please select a country"
        }

        if (!`${formData.countryCode}${formData.phone}`.match(/^\+[1-9]\d{1,14}$/)) {
            newErrors.phone = "Invalid phone number format"
        }

        if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters"
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords don't match"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSendOTP = async () => {
        setError("")
        setSuccess("")

        if (!validateForm()) {
            setError("Please fix the errors above")
            return
        }

        setLoading(true)

        try {
            // Store form data in sessionStorage
            sessionStorage.setItem("fillxo_registration", JSON.stringify(formData))

            // Send OTP
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/send-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formData.email })
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || "Failed to send OTP")
            }

            setSuccess("OTP sent to your email! Check your inbox.")
            setStep(2)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async () => {
        setError("")
        setSuccess("")

        if (!otp.match(/^\d{6}$/)) {
            setError("OTP must be 6 digits")
            return
        }

        setLoading(true)

        try {
            // Get stored data
            const storedData = JSON.parse(sessionStorage.getItem("fillxo_registration") || "{}")
            if (!storedData.email) {
                throw new Error("Session expired. Please start over.")
            }

            // Prepare registration data
            const fullPhone = `${storedData.countryCode}${storedData.phone}`

            const registrationData = {
                email: storedData.email,
                username: storedData.username,
                name: storedData.name,
                gender: storedData.gender,
                phone: fullPhone,
                role: storedData.role,
                country: storedData.country || "BD",
                password: storedData.password,
                otp: otp
            }

            // Register user
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(registrationData)
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || "Registration failed")
            }

            const data = await response.json()
            sessionStorage.removeItem("fillxo_registration")

            setOtp("")
            setStep(3)
            setSuccess("Registration successful! Redirecting to dashboard...")

            window.sessionStorage.setItem("user", JSON.stringify(data))
            setTimeout(() => router.push("/dashboard"), 2000)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleResendOTP = async () => {
        setOtp("")
        setError("")
        setSuccess("")
        setLoading(true)

        try {
            const storedData = JSON.parse(sessionStorage.getItem("fillxo_registration") || "{}")
            if (!storedData.email) {
                throw new Error("Session expired. Please start over.")
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/send-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: storedData.email })
            })

            if (!response.ok) {
                throw new Error("Failed to resend OTP")
            }

            setSuccess("OTP resent successfully!")
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <PageContainer>
            <div className="max-w-md mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Create <span className="text-blue-400">Account</span>
                    </h1>
                    <p className="text-lg text-gray-400">Join Bangladesh's freelance marketplace</p>
                </div>

                <Card>
                    {error && <ErrorAlert message={error} variant="error" />}
                    {success && <ErrorAlert message={success} variant="info" />}

                    {/* Step Indicator */}
                    {step !== 3 && (
                        <div className="flex items-center justify-center mb-6 sm:mb-8">
                            <div className={`flex items-center ${step >= 1 ? "text-blue-400" : "text-gray-600"}`}>
                                <div
                                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border-2 text-sm ${
                                        step >= 1 ? "border-blue-400 bg-blue-400/20" : "border-gray-600"
                                    }`}
                                >
                                    1
                                </div>
                                <span className="ml-1.5 sm:ml-2 text-xs sm:text-sm">Details</span>
                            </div>
                            <div
                                className={`w-8 sm:w-12 h-0.5 mx-1.5 sm:mx-2 ${step >= 2 ? "bg-blue-400" : "bg-gray-600"}`}
                            />
                            <div className={`flex items-center ${step >= 2 ? "text-blue-400" : "text-gray-600"}`}>
                                <div
                                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border-2 text-sm ${
                                        step >= 2 ? "border-blue-400 bg-blue-400/20" : "border-gray-600"
                                    }`}
                                >
                                    2
                                </div>
                                <span className="ml-1.5 sm:ml-2 text-xs sm:text-sm">Verify</span>
                            </div>
                        </div>
                    )}

                    {/* Step 1: Registration Form */}
                    {step === 1 && (
                        <div className="space-y-3 sm:space-y-4">
                            <FormInput
                                label="Email"
                                type="email"
                                icon={Mail}
                                id="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                error={errors.email}
                                placeholder="your@email.com"
                            />

                            <FormInput
                                label="Username"
                                type="text"
                                icon={User}
                                id="username"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                error={errors.username}
                                placeholder="john_doe"
                            />

                            <FormInput
                                label="Full Name"
                                type="text"
                                icon={User}
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                error={errors.name}
                                placeholder="John Doe"
                            />

                            <div>
                                <label
                                    htmlFor="gender"
                                    className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"
                                >
                                    <User className="w-4 h-4 text-blue-400" />
                                    Gender
                                </label>
                                <select
                                    id="gender"
                                    value={formData.gender}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            gender: e.target.value as "male" | "female" | "other"
                                        })
                                    }
                                    className="w-full px-4 py-3 bg-gray-900/50 border border-blue-900/30 rounded-lg focus:outline-none focus:border-blue-600 transition-colors text-white"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                                {errors.gender && <p className="mt-2 text-sm text-red-400">{errors.gender}</p>}
                            </div>

                            <div>
                                <label
                                    htmlFor="country"
                                    className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"
                                >
                                    <Globe className="w-4 h-4 text-blue-400" />
                                    Country
                                </label>
                                <select
                                    id="country"
                                    value={formData.country}
                                    onChange={(e) => {
                                        const selectedCountry = e.target.value
                                        const phoneCode = PhoneCodes.get(selectedCountry) || ""
                                        setFormData({
                                            ...formData,
                                            country: selectedCountry,
                                            countryCode: phoneCode
                                        })
                                    }}
                                    className="w-full px-4 py-3 bg-gray-900/50 border border-blue-900/30 rounded-lg focus:outline-none focus:border-blue-600 transition-colors text-white"
                                >
                                    <option value="">Select Country</option>
                                    {Countries.map((country) => (
                                        <option key={country.code} value={country.code}>
                                            {country.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.country && <p className="mt-2 text-sm text-red-400">{errors.country}</p>}
                            </div>

                            <PhoneInput
                                value={formData.phone}
                                onChange={(phone) => setFormData({ ...formData, phone })}
                                countryCode={formData.countryCode}
                                onCountryCodeChange={(code) => setFormData({ ...formData, countryCode: code })}
                                error={errors.phone}
                            />

                            <FormInput
                                label="Password"
                                type="password"
                                icon={Lock}
                                id="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                error={errors.password}
                                placeholder="Minimum 8 characters"
                            />

                            <FormInput
                                label="Confirm Password"
                                type="password"
                                icon={Lock}
                                id="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                error={errors.confirmPassword}
                                placeholder="Re-enter password"
                            />

                            <div>
                                <label className="text-sm font-medium text-gray-300 mb-2 block">I am a</label>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, role: "freelancer" })}
                                        className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all font-medium ${
                                            formData.role === "freelancer"
                                                ? "border-blue-500 bg-blue-500/10 text-blue-300 ring-2 ring-blue-500/30"
                                                : "border-blue-900/40 text-gray-300 hover:border-blue-700/60 hover:bg-blue-900/10"
                                        }`}
                                    >
                                        Freelancer
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, role: "client" })}
                                        className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all font-medium ${
                                            formData.role === "client"
                                                ? "border-blue-500 bg-blue-500/10 text-blue-300 ring-2 ring-blue-500/30"
                                                : "border-blue-900/40 text-gray-300 hover:border-blue-700/60 hover:bg-blue-900/10"
                                        }`}
                                    >
                                        Client
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={handleSendOTP}
                                disabled={loading}
                                className="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-6 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6 active:scale-95"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Continue
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                            <p className="text-xs text-center text-gray-400 mt-4 px-2">
                                By creating an account you agree to the{" "}
                                <button
                                    onClick={() => router.push("/terms")}
                                    className="text-blue-400 hover:text-blue-300 underline"
                                >
                                    Terms of Service
                                </button>{" "}
                                and{" "}
                                <button
                                    onClick={() => router.push("/privacy")}
                                    className="text-blue-400 hover:text-blue-300 underline"
                                >
                                    Privacy Policy
                                </button>
                            </p>
                        </div>
                    )}

                    {/* Step 2: OTP Verification */}
                    {step === 2 && (
                        <div className="space-y-5 sm:space-y-6">
                            <div className="text-center mb-4 sm:mb-6">
                                <CheckCircle className="w-14 h-14 sm:w-16 sm:h-16 text-blue-400 mx-auto mb-3" />
                                <p className="text-sm sm:text-base text-gray-300 px-2">
                                    We've sent a 6-digit code to
                                    <br />
                                    <span className="text-blue-400 font-medium break-all">{formData.email}</span>
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-300 mb-2 block text-center">
                                    Enter OTP
                                </label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                    placeholder="000000"
                                    maxLength={6}
                                    className="w-full px-4 py-3 bg-gray-900/50 border border-blue-900/30 rounded-lg focus:outline-none focus:border-blue-600 transition-colors text-white text-center text-xl sm:text-2xl tracking-widest"
                                />
                            </div>

                            <button
                                onClick={handleRegister}
                                disabled={loading || otp.length !== 6}
                                className="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-6 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-95"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    "Create Account"
                                )}
                            </button>

                            <div className="text-center text-sm">
                                <button
                                    onClick={handleResendOTP}
                                    disabled={loading}
                                    className="text-blue-400 hover:text-blue-300 transition-colors disabled:opacity-50 active:scale-95"
                                >
                                    Resend OTP
                                </button>
                                <span className="text-gray-500 mx-2">•</span>
                                <button
                                    onClick={() => {
                                        setOtp("")
                                        setStep(1)
                                    }}
                                    className="text-blue-400 hover:text-blue-300 transition-colors active:scale-95"
                                >
                                    Change Details
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="mt-5 sm:mt-6 text-center text-sm text-gray-400">
                        Already have an account?{" "}
                        <button
                            onClick={() => router.push("/login")}
                            className="text-blue-400 hover:text-blue-300 transition-colors active:scale-95"
                        >
                            Sign in
                        </button>
                    </div>
                </Card>
            </div>
        </PageContainer>
    )
}
