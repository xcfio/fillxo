"use client"

import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Navbar from "@/components/navbar"
import Image from "next/image"
import { User, MapPin, Clock, Calendar, ArrowLeft, Briefcase } from "lucide-react"

interface UserProfile {
    id: string
    username: string
    name: string
    avatar: string | null
    role: "freelancer" | "client" | "both"
    country: string
    timezone: string
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
                                        <h1 className="text-3xl font-bold mb-2">{profile.name}</h1>
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
                        {/* About Section - Coming Soon */}
                        <div className="bg-gray-900/50 border border-blue-900/30 rounded-2xl p-8 backdrop-blur-sm">
                            <h2 className="text-2xl font-bold mb-4">About</h2>
                            <p className="text-gray-400 italic">
                                {isOwnProfile
                                    ? "Add a bio to your profile to tell others about yourself"
                                    : "This user hasn't added a bio yet"}
                            </p>
                        </div>

                        {profile.role === "freelancer" || profile.role === "both" ? (
                            <>
                                {/* Skills Section - Coming Soon */}
                                <div className="bg-gray-900/50 border border-blue-900/30 rounded-2xl p-8 backdrop-blur-sm">
                                    <h2 className="text-2xl font-bold mb-4">Skills & Expertise</h2>
                                    <p className="text-gray-400 italic">
                                        {isOwnProfile
                                            ? "Add your skills to showcase your expertise"
                                            : "No skills listed yet"}
                                    </p>
                                </div>

                                {/* Portfolio Section - Coming Soon */}
                                <div className="bg-gray-900/50 border border-blue-900/30 rounded-2xl p-8 backdrop-blur-sm">
                                    <h2 className="text-2xl font-bold mb-4">Portfolio</h2>
                                    <p className="text-gray-400 italic">
                                        {isOwnProfile
                                            ? "Add projects to your portfolio to attract clients"
                                            : "No portfolio items yet"}
                                    </p>
                                </div>

                                {/* Reviews Section - Coming Soon */}
                                <div className="bg-gray-900/50 border border-blue-900/30 rounded-2xl p-8 backdrop-blur-sm">
                                    <h2 className="text-2xl font-bold mb-4">Reviews & Ratings</h2>
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

                    {/* Coming Soon Notice */}
                    <div className="mt-8 bg-blue-900/30 border border-blue-700/50 rounded-2xl p-6 text-center">
                        <h3 className="text-xl font-bold mb-2">🚀 More Profile Features Coming Soon!</h3>
                        <p className="text-gray-300">
                            We're building out portfolio showcases, skills, reviews, and more!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
