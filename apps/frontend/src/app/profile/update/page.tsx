"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { PageContainer } from "@/components/ui/page-container"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { FormInput } from "@/components/ui/form-input"
import { Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ErrorAlert } from "@/components/ui/error-alert"
import { Card } from "@/components/ui/card"
import { User, Mail, Phone, Globe, Clock, ArrowLeft, Save, ChevronDown, Briefcase, Award, Shield } from "lucide-react"

interface PortfolioItem {
    title: string
    description: string
    images?: string
    link?: string
}

interface ClientProfile {
    companyName?: string
    industry?: string
}

interface FreelancerProfile {
    title?: string
    skills?: string[]
    bio?: string
    portfolio?: PortfolioItem[]
}

interface UpdateFormData {
    avatar?: string
    email?: string
    username?: string
    name?: string
    role?: "freelancer" | "client"
    phone?: string
    country?: string
    timezone?: string
    client?: ClientProfile
    freelancer?: FreelancerProfile
}

export default function UpdateProfilePage() {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [formData, setFormData] = useState<UpdateFormData>({})
    const [skillInput, setSkillInput] = useState("")
    const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([])
    const [newPortfolioItem, setNewPortfolioItem] = useState<PortfolioItem>({
        title: "",
        description: "",
        images: "",
        link: ""
    })

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/users/me`, {
                    credentials: "include"
                })

                if (!response.ok) return router.push("/login")
                const userData = await response.json()
                setUser(userData)

                // Initialize form data with current user data
                setFormData({
                    avatar: userData.avatar || "",
                    email: userData.email || "",
                    username: userData.username || "",
                    name: userData.name || "",
                    role: userData.role || "freelancer",
                    phone: userData.phone || "",
                    country: userData.country || "",
                    timezone: userData.timezone || "",
                    client: userData.client || {},
                    freelancer: userData.freelancer || {}
                })

                // Initialize portfolio items if they exist
                if (userData.freelancer?.portfolio) {
                    setPortfolioItems(userData.freelancer.portfolio)
                }
            } catch (error) {
                router.push("/login")
            } finally {
                setLoading(false)
            }
        }

        fetchUser()
    }, [router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setSuccess("")
        setUpdating(true)

        try {
            // Only send fields that have been modified
            const updatedFields: UpdateFormData = {}

            if (formData.avatar !== user.avatar) updatedFields.avatar = formData.avatar
            if (formData.email !== user.email) updatedFields.email = formData.email
            if (formData.username !== user.username) updatedFields.username = formData.username
            if (formData.name !== user.name) updatedFields.name = formData.name
            if (formData.role !== user.role) updatedFields.role = formData.role
            if (formData.phone !== user.phone) updatedFields.phone = formData.phone
            if (formData.country !== user.country) updatedFields.country = formData.country
            if (formData.timezone !== user.timezone) updatedFields.timezone = formData.timezone

            // Add client fields if modified
            if (
                formData.client?.companyName !== user.client?.companyName ||
                formData.client?.industry !== user.client?.industry
            ) {
                updatedFields.client = formData.client
            }

            // Add freelancer fields if modified
            const freelancerChanged = JSON.stringify(formData.freelancer) !== JSON.stringify(user.freelancer)
            if (freelancerChanged) {
                updatedFields.freelancer = {
                    ...formData.freelancer,
                    portfolio: portfolioItems
                }
            }

            // Check if at least one field is being updated
            if (Object.keys(updatedFields).length === 0) {
                setError("No changes detected")
                setUpdating(false)
                return
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/users/me`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(updatedFields)
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || "Failed to update profile")
            }

            setSuccess("Profile updated successfully!")

            // Refresh user data
            const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/users/me`, {
                credentials: "include"
            })
            const updatedUser = await userResponse.json()
            setUser(updatedUser)

            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
                router.push("/dashboard")
            }, 2000)
        } catch (err: any) {
            setError(err.message || "An error occurred while updating your profile")
        } finally {
            setUpdating(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target

        // Handle nested client fields
        if (name.startsWith("client.")) {
            const field = name.split(".")[1]
            setFormData({
                ...formData,
                client: {
                    ...formData.client,
                    [field]: value
                }
            })
        }
        // Handle nested freelancer fields
        else if (name.startsWith("freelancer.")) {
            const field = name.split(".")[1]
            setFormData({
                ...formData,
                freelancer: {
                    ...formData.freelancer,
                    [field]: value
                }
            })
        }
        // Handle regular fields
        else {
            setFormData({
                ...formData,
                [name]: value
            })
        }
    }

    const handleAddSkill = () => {
        if (skillInput.trim()) {
            const currentSkills = formData.freelancer?.skills || []
            setFormData({
                ...formData,
                freelancer: {
                    ...formData.freelancer,
                    skills: [...currentSkills, skillInput.trim()]
                }
            })
            setSkillInput("")
        }
    }

    const handleRemoveSkill = (index: number) => {
        const currentSkills = formData.freelancer?.skills || []
        setFormData({
            ...formData,
            freelancer: {
                ...formData.freelancer,
                skills: currentSkills.filter((_, i) => i !== index)
            }
        })
    }

    const handleAddPortfolioItem = () => {
        if (newPortfolioItem.title && newPortfolioItem.description) {
            setPortfolioItems([...portfolioItems, newPortfolioItem])
            setNewPortfolioItem({ title: "", description: "", images: "", link: "" })
        }
    }

    const handleRemovePortfolioItem = (index: number) => {
        setPortfolioItems(portfolioItems.filter((_, i) => i !== index))
    }

    if (loading || !user) {
        return <LoadingSpinner message="Loading profile..." />
    }

    return (
        <PageContainer showFooter={false}>
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Dashboard
                    </button>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-4xl font-bold">Update Profile</h1>
                        {user?.privilege && (
                            <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${
                                    user.privilege === "admin"
                                        ? "bg-sky-600/20 text-sky-400 border border-sky-700/50"
                                        : "bg-green-600/20 text-green-400 border border-green-700/50"
                                }`}
                            >
                                <Shield className="w-4 h-4" />
                                {user.privilege.toUpperCase()}
                            </span>
                        )}
                    </div>
                    <p className="text-gray-400">Update your personal information and preferences</p>
                </div>

                {/* Update Form */}
                <Card>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Avatar URL */}
                        <div>
                            <label htmlFor="avatar" className="flex items-center gap-2 text-sm font-medium mb-2">
                                <User className="w-4 h-4 text-blue-400" />
                                Avatar URL
                            </label>
                            <input
                                type="url"
                                id="avatar"
                                name="avatar"
                                value={formData.avatar}
                                onChange={handleChange}
                                placeholder="https://example.com/avatar.jpg"
                                className="w-full px-4 py-3 bg-gray-900/50 border border-blue-900/30 rounded-lg focus:outline-none focus:border-blue-600 transition-colors"
                            />
                        </div>

                        {/* Name */}
                        <div>
                            <label htmlFor="name" className="flex items-center gap-2 text-sm font-medium mb-2">
                                <User className="w-4 h-4 text-blue-400" />
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                                className="w-full px-4 py-3 bg-gray-900/50 border border-blue-900/30 rounded-lg focus:outline-none focus:border-blue-600 transition-colors"
                            />
                        </div>

                        {/* Username */}
                        <div>
                            <label htmlFor="username" className="flex items-center gap-2 text-sm font-medium mb-2">
                                <User className="w-4 h-4 text-blue-400" />
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="johndoe"
                                className="w-full px-4 py-3 bg-gray-900/50 border border-blue-900/30 rounded-lg focus:outline-none focus:border-blue-600 transition-colors"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium mb-2">
                                <Mail className="w-4 h-4 text-blue-400" />
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="john@example.com"
                                className="w-full px-4 py-3 bg-gray-900/50 border border-blue-900/30 rounded-lg focus:outline-none focus:border-blue-600 transition-colors"
                            />
                        </div>

                        {/* Role */}
                        <div>
                            <label htmlFor="role" className="flex items-center gap-2 text-sm font-medium mb-2">
                                <User className="w-4 h-4 text-blue-400" />
                                Role
                            </label>
                            <div className="relative">
                                <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                <select
                                    id="role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-5 py-3 bg-gray-900/50 border border-blue-900/30 rounded-lg focus:outline-none focus:border-blue-600 transition-colors appearance-none"
                                >
                                    <option value="freelancer">Freelancer</option>
                                    <option value="client">Client</option>
                                </select>
                            </div>
                        </div>

                        {/* Phone */}
                        <div>
                            <label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium mb-2">
                                <Phone className="w-4 h-4 text-blue-400" />
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+1 234 567 8900"
                                className="w-full px-4 py-3 bg-gray-900/50 border border-blue-900/30 rounded-lg focus:outline-none focus:border-blue-600 transition-colors"
                            />
                        </div>

                        {/* Country */}
                        <div>
                            <label htmlFor="country" className="flex items-center gap-2 text-sm font-medium mb-2">
                                <Globe className="w-4 h-4 text-blue-400" />
                                Country
                            </label>
                            <div className="relative">
                                <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                <select
                                    id="country"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-5 py-3 bg-gray-900/50 border border-blue-900/30 rounded-lg focus:outline-none focus:border-blue-600 transition-colors appearance-none"
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
                        </div>

                        {/* Timezone */}
                        <div>
                            <label htmlFor="timezone" className="flex items-center gap-2 text-sm font-medium mb-2">
                                <Clock className="w-4 h-4 text-blue-400" />
                                Timezone
                            </label>
                            <div className="relative">
                                <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                <select
                                    id="timezone"
                                    name="timezone"
                                    value={formData.timezone}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-5 py-3 bg-gray-900/50 border border-blue-900/30 rounded-lg focus:outline-none focus:border-blue-600 transition-colors appearance-none"
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
                                        <option value="America/Buenos_Aires">Argentina Time (Buenos Aires)</option>
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
                                        <option value="Europe/Amsterdam">Central European Time (Amsterdam)</option>
                                        <option value="Europe/Brussels">Central European Time (Brussels)</option>
                                        <option value="Europe/Vienna">Central European Time (Vienna)</option>
                                        <option value="Europe/Zurich">Central European Time (Zurich)</option>
                                        <option value="Europe/Stockholm">Central European Time (Stockholm)</option>
                                        <option value="Europe/Copenhagen">Central European Time (Copenhagen)</option>
                                        <option value="Europe/Oslo">Central European Time (Oslo)</option>
                                        <option value="Europe/Helsinki">Eastern European Time (Helsinki)</option>
                                        <option value="Europe/Athens">Eastern European Time (Athens)</option>
                                        <option value="Europe/Istanbul">Turkey Time (Istanbul)</option>
                                        <option value="Europe/Moscow">Moscow Time (Moscow)</option>
                                        <option value="Europe/Warsaw">Central European Time (Warsaw)</option>
                                        <option value="Europe/Prague">Central European Time (Prague)</option>
                                        <option value="Europe/Budapest">Central European Time (Budapest)</option>
                                        <option value="Europe/Bucharest">Eastern European Time (Bucharest)</option>
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
                                        <option value="Africa/Johannesburg">South Africa Time (Johannesburg)</option>
                                        <option value="Africa/Lagos">West Africa Time (Lagos)</option>
                                        <option value="Africa/Nairobi">East Africa Time (Nairobi)</option>
                                        <option value="Africa/Casablanca">Western European Time (Casablanca)</option>
                                    </optgroup>
                                    <optgroup label="Australia & Pacific">
                                        <option value="Australia/Sydney">Australian Eastern Time (Sydney)</option>
                                        <option value="Australia/Melbourne">Australian Eastern Time (Melbourne)</option>
                                        <option value="Australia/Brisbane">Australian Eastern Time (Brisbane)</option>
                                        <option value="Australia/Perth">Australian Western Time (Perth)</option>
                                        <option value="Australia/Adelaide">Australian Central Time (Adelaide)</option>
                                        <option value="Pacific/Auckland">New Zealand Time (Auckland)</option>
                                        <option value="Pacific/Fiji">Fiji Time (Fiji)</option>
                                    </optgroup>
                                </select>
                            </div>
                        </div>

                        {/* Client Profile Fields */}
                        {formData.role === "client" && (
                            <div className="space-y-6 pt-6 border-t border-blue-900/30">
                                <h3 className="text-xl font-semibold flex items-center gap-2">
                                    <Briefcase className="w-5 h-5 text-blue-400" />
                                    Client Profile
                                </h3>

                                {/* Company Name */}
                                <div>
                                    <label
                                        htmlFor="client.companyName"
                                        className="flex items-center gap-2 text-sm font-medium mb-2"
                                    >
                                        Company Name
                                    </label>
                                    <input
                                        type="text"
                                        id="client.companyName"
                                        name="client.companyName"
                                        value={formData.client?.companyName || ""}
                                        onChange={handleChange}
                                        placeholder="Your Company Ltd."
                                        className="w-full px-4 py-3 bg-gray-900/50 border border-blue-900/30 rounded-lg focus:outline-none focus:border-blue-600 transition-colors"
                                    />
                                </div>

                                {/* Industry */}
                                <div>
                                    <label
                                        htmlFor="client.industry"
                                        className="flex items-center gap-2 text-sm font-medium mb-2"
                                    >
                                        Industry
                                    </label>
                                    <input
                                        type="text"
                                        id="client.industry"
                                        name="client.industry"
                                        value={formData.client?.industry || ""}
                                        onChange={handleChange}
                                        placeholder="Technology, Finance, Healthcare, etc."
                                        className="w-full px-4 py-3 bg-gray-900/50 border border-blue-900/30 rounded-lg focus:outline-none focus:border-blue-600 transition-colors"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Freelancer Profile Fields */}
                        {formData.role === "freelancer" && (
                            <div className="space-y-6 pt-6 border-t border-blue-900/30">
                                <h3 className="text-xl font-semibold flex items-center gap-2">
                                    <Award className="w-5 h-5 text-blue-400" />
                                    Freelancer Profile
                                </h3>

                                {/* Title */}
                                <div>
                                    <label
                                        htmlFor="freelancer.title"
                                        className="flex items-center gap-2 text-sm font-medium mb-2"
                                    >
                                        Professional Title
                                    </label>
                                    <input
                                        type="text"
                                        id="freelancer.title"
                                        name="freelancer.title"
                                        value={formData.freelancer?.title || ""}
                                        onChange={handleChange}
                                        placeholder="Full Stack Developer, UI/UX Designer, etc."
                                        className="w-full px-4 py-3 bg-gray-900/50 border border-blue-900/30 rounded-lg focus:outline-none focus:border-blue-600 transition-colors"
                                    />
                                </div>

                                {/* Bio */}
                                <div>
                                    <label
                                        htmlFor="freelancer.bio"
                                        className="flex items-center gap-2 text-sm font-medium mb-2"
                                    >
                                        Bio
                                    </label>
                                    <textarea
                                        id="freelancer.bio"
                                        name="freelancer.bio"
                                        value={formData.freelancer?.bio || ""}
                                        onChange={handleChange}
                                        placeholder="Tell us about yourself and your experience..."
                                        rows={4}
                                        className="w-full px-4 py-3 bg-gray-900/50 border border-blue-900/30 rounded-lg focus:outline-none focus:border-blue-600 transition-colors resize-none"
                                    />
                                </div>

                                {/* Skills */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium mb-2">Skills</label>
                                    <div className="flex gap-2 mb-3">
                                        <input
                                            type="text"
                                            value={skillInput}
                                            onChange={(e) => setSkillInput(e.target.value)}
                                            onKeyPress={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault()
                                                    handleAddSkill()
                                                }
                                            }}
                                            placeholder="Add a skill (e.g., React, Python)"
                                            className="flex-1 px-4 py-3 bg-gray-900/50 border border-blue-900/30 rounded-lg focus:outline-none focus:border-blue-600 transition-colors"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddSkill}
                                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.freelancer?.skills?.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-blue-900/30 border border-blue-700/50 rounded-full text-sm flex items-center gap-2"
                                            >
                                                {skill}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveSkill(index)}
                                                    className="text-red-400 hover:text-red-300"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Portfolio */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                                        Portfolio
                                    </label>

                                    {/* Existing Portfolio Items */}
                                    <div className="space-y-4 mb-4">
                                        {portfolioItems.map((item, index) => (
                                            <div
                                                key={index}
                                                className="p-4 bg-gray-900/50 border border-blue-900/30 rounded-lg"
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="font-medium">{item.title}</h4>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemovePortfolioItem(index)}
                                                        className="text-red-400 hover:text-red-300"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                                <p className="text-sm text-gray-400 mb-2">{item.description}</p>
                                                <div className="text-xs text-blue-400">
                                                    <a
                                                        href={item.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="hover:underline"
                                                    >
                                                        {item.link}
                                                    </a>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Add New Portfolio Item */}
                                    <div className="p-4 bg-gray-900/30 border border-blue-900/20 rounded-lg space-y-3">
                                        <input
                                            type="text"
                                            value={newPortfolioItem.title}
                                            onChange={(e) =>
                                                setNewPortfolioItem({ ...newPortfolioItem, title: e.target.value })
                                            }
                                            placeholder="Project Title"
                                            className="w-full px-4 py-2 bg-gray-900/50 border border-blue-900/30 rounded-lg focus:outline-none focus:border-blue-600 transition-colors text-sm"
                                        />
                                        <textarea
                                            value={newPortfolioItem.description}
                                            onChange={(e) =>
                                                setNewPortfolioItem({
                                                    ...newPortfolioItem,
                                                    description: e.target.value
                                                })
                                            }
                                            placeholder="Project Description"
                                            rows={2}
                                            className="w-full px-4 py-2 bg-gray-900/50 border border-blue-900/30 rounded-lg focus:outline-none focus:border-blue-600 transition-colors resize-none text-sm"
                                        />
                                        <input
                                            type="url"
                                            value={newPortfolioItem.images}
                                            onChange={(e) =>
                                                setNewPortfolioItem({
                                                    ...newPortfolioItem,
                                                    images: e.target.value
                                                })
                                            }
                                            placeholder="Image URL"
                                            className="w-full px-4 py-2 bg-gray-900/50 border border-blue-900/30 rounded-lg focus:outline-none focus:border-blue-600 transition-colors text-sm"
                                        />
                                        <input
                                            type="url"
                                            value={newPortfolioItem.link}
                                            onChange={(e) =>
                                                setNewPortfolioItem({ ...newPortfolioItem, link: e.target.value })
                                            }
                                            placeholder="Project Link"
                                            className="w-full px-4 py-2 bg-gray-900/50 border border-blue-900/30 rounded-lg focus:outline-none focus:border-blue-600 transition-colors text-sm"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddPortfolioItem}
                                            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm"
                                        >
                                            Add Portfolio Item
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Error Message */}
                        {error && <ErrorAlert message={error} />}

                        {/* Success Message */}
                        {success && (
                            <div className="bg-green-900/30 border border-green-700/50 rounded-lg p-4 text-green-200 flex items-start gap-3">
                                <Award className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                                <p className="text-sm">{success}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <Button type="submit" isLoading={updating} icon={Save} iconPosition="left" className="w-full">
                            Save Changes
                        </Button>
                    </form>
                </Card>
            </div>
        </PageContainer>
    )
}
