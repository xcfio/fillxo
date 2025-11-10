"use client"

import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Navbar from "@/components/navbar"
import Image from "next/image"
import {
    User,
    MapPin,
    Clock,
    Calendar,
    ArrowLeft,
    Briefcase,
    Award,
    ExternalLink,
    FileText,
    Lightbulb,
    Briefcase as Portfolio,
    Star,
    Building2,
    Factory,
    Shield
} from "lucide-react"

interface PortfolioItem {
    title: string
    description: string
    images: string
    link: string
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

interface UserProfile {
    id: string
    username: string
    name: string
    avatar: string | null
    role: "freelancer" | "client"
    privilege?: "moderator" | "admin" | null
    country: string
    timezone: string
    client?: ClientProfile
    freelancer?: FreelancerProfile
    createdAt: string
}

export default function UserProfilePage() {
    const router = useRouter()
    const params = useParams()
    const username = String(params.username)

    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [currentUser, setCurrentUser] = useState<any>(null)

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/users/me`, {
                    credentials: "include"
                })
                if (response.ok) {
                    const userData = await response.json()
                    setCurrentUser(userData)
                    setIsLoggedIn(true)
                }
            } catch (error) {
                setIsLoggedIn(false)
            }
        }

        checkAuth()
    }, [])

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/users/${encodeURIComponent(username)}`
                )

                if (!response.ok) {
                    if (response.status === 404) {
                        setError("User not found")
                    } else {
                        setError("Failed to load profile")
                    }
                    setLoading(false)
                    return
                }

                const data = await response.json()
                setProfile(data)
            } catch (error) {
                setError("An error occurred while loading the profile")
            } finally {
                setLoading(false)
            }
        }

        if (username) {
            fetchProfile()
        }
    }, [username])

    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-gray-950 via-blue-950 to-gray-950 text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Loading profile...</p>
                </div>
            </div>
        )
    }

    if (error || !profile) {
        return (
            <div className="min-h-screen bg-linear-to-br from-gray-950 via-blue-950 to-gray-950 text-white">
                <Navbar />

                <div className="pt-24 px-6 pb-12">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="bg-red-900/20 border border-red-700/50 rounded-2xl p-8">
                            <h1 className="text-3xl font-bold mb-4">Profile Not Found</h1>
                            <p className="text-gray-400 mb-6">
                                {error || "The user you're looking for doesn't exist."}
                            </p>
                            <button
                                onClick={() => router.push("/")}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                Back to Home
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const isOwnProfile = currentUser && currentUser.username === profile.username

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-950 via-blue-950 to-gray-950 text-white">
            <Navbar />

            <div className="pt-24 px-6 pb-12">
                <div className="max-w-5xl mx-auto">
                    {/* Back Button */}
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back
                    </button>

                    {/* Profile Header */}
                    <div className="bg-gray-900/50 border border-blue-900/30 rounded-2xl p-8 backdrop-blur-sm mb-8">
                        <div className="flex flex-col md:flex-row items-start gap-6">
                            {/* Avatar */}
                            <div className="w-32 h-32 bg-blue-600/20 border border-blue-700/50 rounded-full flex items-center justify-center shrink-0">
                                {profile.avatar ? (
                                    <Image
                                        src={profile.avatar}
                                        alt={profile.name}
                                        width={128}
                                        height={128}
                                        className="rounded-full object-cover"
                                    />
                                ) : (
                                    <User className="w-16 h-16 text-blue-400" />
                                )}
                            </div>

                            {/* Profile Info */}
                            <div className="flex-1">
                                <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h1 className="text-3xl font-bold">{profile.name}</h1>
                                            {profile.privilege && (
                                                <span
                                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                                                        profile.privilege === "admin"
                                                            ? "bg-sky-600/20 text-sky-400 border border-sky-700/50"
                                                            : "bg-green-600/20 text-green-400 border border-green-700/50"
                                                    }`}
                                                >
                                                    <Shield className="w-3.5 h-3.5" />
                                                    {profile.privilege.toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-gray-400 text-lg">@{profile.username}</p>
                                    </div>
                                    {isOwnProfile && (
                                        <button
                                            onClick={() => router.push("/profile/update")}
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                                        >
                                            Edit Profile
                                        </button>
                                    )}
                                </div>

                                {/* Role Badge */}
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/20 border border-blue-700/50 rounded-lg mb-6">
                                    <Briefcase className="w-4 h-4 text-blue-400" />
                                    <span className="capitalize font-medium">{profile.role}</span>
                                </div>

                                {/* Profile Details */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {profile.country && (
                                        <div className="flex items-center gap-3 text-gray-300">
                                            <MapPin className="w-5 h-5 text-blue-400" />
                                            <div>
                                                <p className="text-sm text-gray-400">Country</p>
                                                <p className="font-medium">{profile.country}</p>
                                            </div>
                                        </div>
                                    )}
                                    {profile.timezone && (
                                        <div className="flex items-center gap-3 text-gray-300">
                                            <Clock className="w-5 h-5 text-blue-400" />
                                            <div>
                                                <p className="text-sm text-gray-400">Timezone</p>
                                                <p className="font-medium">{profile.timezone}</p>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3 text-gray-300">
                                        <Calendar className="w-5 h-5 text-blue-400" />
                                        <div>
                                            <p className="text-sm text-gray-400">Member Since</p>
                                            <p className="font-medium">
                                                {new Date(profile.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Profile Sections */}
                    <div className="grid grid-cols-1 gap-6">
                        {/* Client Profile Section */}
                        {profile.role === "client" && (
                            <div className="bg-gray-900/50 border border-blue-900/30 rounded-2xl p-8 backdrop-blur-sm">
                                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                    <Briefcase className="w-6 h-6 text-blue-400" />
                                    Client Information
                                </h2>
                                {profile.client?.companyName || profile.client?.industry ? (
                                    <div className="space-y-3">
                                        {profile.client.companyName && (
                                            <div className="flex items-center gap-3">
                                                <Building2 className="w-5 h-5 text-blue-400" />
                                                <div>
                                                    <p className="text-sm text-gray-400">Company</p>
                                                    <p className="text-lg font-medium">{profile.client.companyName}</p>
                                                </div>
                                            </div>
                                        )}
                                        {profile.client.industry && (
                                            <div className="flex items-center gap-3">
                                                <Factory className="w-5 h-5 text-blue-400" />
                                                <div>
                                                    <p className="text-sm text-gray-400">Industry</p>
                                                    <p className="text-lg font-medium">{profile.client.industry}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-gray-400 italic">
                                        {isOwnProfile
                                            ? "Add your company information in your profile settings"
                                            : "No company information available"}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* About Section */}
                        {profile.role === "freelancer" && (
                            <div className="bg-gray-900/50 border border-blue-900/30 rounded-2xl p-8 backdrop-blur-sm">
                                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                    <FileText className="w-6 h-6 text-blue-400" />
                                    About
                                </h2>
                                {profile.freelancer?.bio ? (
                                    <p className="text-gray-300 leading-relaxed">{profile.freelancer.bio}</p>
                                ) : (
                                    <p className="text-gray-400 italic">
                                        {isOwnProfile
                                            ? "Add a bio to your profile to tell others about yourself"
                                            : "This user hasn't added a bio yet"}
                                    </p>
                                )}
                            </div>
                        )}

                        {profile.role === "freelancer" ? (
                            <>
                                {/* Professional Title */}
                                {profile.freelancer?.title && (
                                    <div className="bg-gray-900/50 border border-blue-900/30 rounded-2xl p-8 backdrop-blur-sm">
                                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                            <Award className="w-6 h-6 text-blue-400" />
                                            Professional Title
                                        </h2>
                                        <p className="text-xl text-gray-300">{profile.freelancer.title}</p>
                                    </div>
                                )}

                                {/* Skills Section */}
                                <div className="bg-gray-900/50 border border-blue-900/30 rounded-2xl p-8 backdrop-blur-sm">
                                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                        <Lightbulb className="w-6 h-6 text-blue-400" />
                                        Skills & Expertise
                                    </h2>
                                    {profile.freelancer?.skills && profile.freelancer.skills.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {profile.freelancer.skills.map((skill, index) => (
                                                <span
                                                    key={index}
                                                    className="px-4 py-2 bg-blue-900/30 border border-blue-700/50 rounded-full text-sm font-medium"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-400 italic">
                                            {isOwnProfile
                                                ? "Add your skills to showcase your expertise"
                                                : "No skills listed yet"}
                                        </p>
                                    )}
                                </div>

                                {/* Portfolio Section */}
                                <div className="bg-gray-900/50 border border-blue-900/30 rounded-2xl p-8 backdrop-blur-sm">
                                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                        <Portfolio className="w-6 h-6 text-blue-400" />
                                        Portfolio
                                    </h2>
                                    {profile.freelancer?.portfolio && profile.freelancer.portfolio.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {profile.freelancer.portfolio.map((item, index) => (
                                                <div
                                                    key={index}
                                                    className="bg-gray-900/50 border border-blue-900/30 rounded-lg overflow-hidden hover:border-blue-700/50 transition-colors"
                                                >
                                                    {/* Portfolio Image */}
                                                    {item.images && (
                                                        <div className="relative h-48 bg-gray-800">
                                                            <Image
                                                                src={item.images}
                                                                alt={item.title}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                    )}

                                                    {/* Portfolio Content */}
                                                    <div className="p-4">
                                                        <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                                                        <p className="text-gray-400 text-sm mb-4">{item.description}</p>
                                                        {item.link && (
                                                            <a
                                                                href={item.link}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm transition-colors"
                                                            >
                                                                View Project
                                                                <ExternalLink className="w-4 h-4" />
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-400 italic">
                                            {isOwnProfile
                                                ? "Add projects to your portfolio to attract clients"
                                                : "No portfolio items yet"}
                                        </p>
                                    )}
                                </div>

                                {/* Reviews Section - Coming Soon */}
                                <div className="bg-gray-900/50 border border-blue-900/30 rounded-2xl p-8 backdrop-blur-sm">
                                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                        <Star className="w-6 h-6 text-blue-400" />
                                        Reviews & Ratings
                                    </h2>
                                    <p className="text-gray-400 italic">No reviews yet</p>
                                </div>
                            </>
                        ) : null}

                        {!isOwnProfile && (
                            <div className="bg-blue-900/30 border border-blue-700/50 rounded-2xl p-6">
                                <button
                                    onClick={() => {
                                        if (!isLoggedIn) {
                                            router.push("/login")
                                        } else {
                                            // TODO: Implement messaging
                                            alert("Messaging feature coming soon!")
                                        }
                                    }}
                                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
                                >
                                    {isLoggedIn ? "Send Message" : "Login to Contact"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
