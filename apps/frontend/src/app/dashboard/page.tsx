"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Navbar from "@/components/navbar"
import Image from "next/image"
import { User, Briefcase, Shield } from "lucide-react"

export default function DashboardPage() {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/users/me`, {
                    credentials: "include"
                })

                if (!response.ok) return router.push("/login")
                const userData = await response.json()
                setUser(userData)
            } catch (error) {
                router.push("/login")
            } finally {
                setLoading(false)
            }
        }

        fetchUser()
    }, [router])

    if (loading || !user) {
        return (
            <div className="min-h-screen bg-linear-to-br from-gray-950 via-blue-950 to-gray-950 text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Loading...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-950 via-blue-950 to-gray-950 text-white">
            <Navbar />

            {/* Main Content */}
            <div className="pt-24 px-6 pb-12 flex-1">
                <div className="max-w-7xl mx-auto">
                    {/* Welcome Section */}
                    <div className="mb-12">
                        <h1 className="text-4xl font-bold mb-2">
                            Welcome back, <span className="text-blue-400">{user.name}!</span>
                        </h1>
                        <p className="text-gray-400">
                            {user.role === "freelancer"
                                ? "Ready to find your next project?"
                                : user.role === "client"
                                  ? "Let's find the perfect freelancer for your project"
                                  : "Manage your freelance business and hiring needs"}
                        </p>
                    </div>

                    {/* User Info Card */}
                    <div className="bg-gray-900/50 border border-blue-900/30 rounded-2xl p-8 backdrop-blur-sm mb-8">
                        <div className="flex items-start gap-6">
                            <div className="w-24 h-24 bg-blue-600/20 border border-blue-700/50 rounded-full flex items-center justify-center">
                                {user.avatar ? (
                                    <Image
                                        src={user.avatar}
                                        alt={user.name}
                                        width={96}
                                        height={96}
                                        className="rounded-full"
                                    />
                                ) : (
                                    <User className="w-12 h-12 text-blue-400" />
                                )}
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <h2 className="text-2xl font-bold">{user.name}</h2>
                                    {user.privilege && (
                                        <span
                                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                                                user.privilege === "admin"
                                                    ? "bg-sky-600/20 text-sky-400 border border-sky-700/50"
                                                    : "bg-green-600/20 text-green-400 border border-green-700/50"
                                            }`}
                                        >
                                            <Shield className="w-3.5 h-3.5" />
                                            {user.privilege.toUpperCase()}
                                        </span>
                                    )}
                                </div>
                                <p className="text-gray-400 mb-4">
                                    <button
                                        onClick={() => router.push(`/users/${user.username}`)}
                                        className="hover:text-blue-400 transition-colors"
                                    >
                                        @{user.username}
                                    </button>
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-gray-900/50 border border-blue-900/20 rounded-lg p-4">
                                        <p className="text-gray-400 text-sm mb-1">Email</p>
                                        <p className="font-medium">{user.email}</p>
                                    </div>
                                    <div className="bg-gray-900/50 border border-blue-900/20 rounded-lg p-4">
                                        <p className="text-gray-400 text-sm mb-1">Role</p>
                                        <p className="font-medium capitalize">{user.role}</p>
                                    </div>
                                    <div className="bg-gray-900/50 border border-blue-900/20 rounded-lg p-4">
                                        <p className="text-gray-400 text-sm mb-1">Member Since</p>
                                        <p className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {user.role === "freelancer" ? (
                            <div className="bg-gray-900/50 border border-blue-900/30 rounded-2xl p-6 backdrop-blur-sm hover:border-blue-600/50 transition-colors cursor-pointer">
                                <Briefcase className="w-8 h-8 text-blue-400 mb-4" />
                                <h3 className="text-xl font-semibold mb-2">Browse Jobs</h3>
                                <p className="text-gray-400">Find your next opportunity</p>
                            </div>
                        ) : null}

                        {user.role === "client" ? (
                            <div className="bg-gray-900/50 border border-blue-900/30 rounded-2xl p-6 backdrop-blur-sm hover:border-blue-600/50 transition-colors cursor-pointer">
                                <Briefcase className="w-8 h-8 text-blue-400 mb-4" />
                                <h3 className="text-xl font-semibold mb-2">Post a Job</h3>
                                <p className="text-gray-400">Find talented freelancers</p>
                            </div>
                        ) : null}

                        {/* Edit Profile - Available for all roles */}
                        <div
                            onClick={() => router.push("/profile/update")}
                            className="bg-gray-900/50 border border-blue-900/30 rounded-2xl p-6 backdrop-blur-sm hover:border-blue-600/50 transition-colors cursor-pointer"
                        >
                            <User className="w-8 h-8 text-blue-400 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Edit Profile</h3>
                            <p className="text-gray-400">
                                {user.role === "freelancer" ? "Update your portfolio" : "Update your information"}
                            </p>
                        </div>
                    </div>

                    {/* Coming Soon Notice */}
                    <div className="mt-12 bg-blue-900/30 border border-blue-700/50 rounded-2xl p-8 text-center">
                        <h2 className="text-2xl font-bold mb-3">🚀 More Features Coming Soon!</h2>
                        <p className="text-gray-300 max-w-2xl mx-auto">
                            We're actively building out the complete fillxo experience. Stay tuned for job posting,
                            proposals, messaging, contracts, and much more!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
