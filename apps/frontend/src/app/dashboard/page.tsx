"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { PageContainer } from "@/components/ui/page-container"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { User, Briefcase, Shield, FileText, Bell, CreditCard, Receipt, Copy, Check } from "lucide-react"
import { getUser } from "@/utils/auth"
import { formatDate } from "@/utils/time"

export default function DashboardPage() {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [unreadCount, setUnreadCount] = useState(0)
    const [copiedId, setCopiedId] = useState(false)

    const copyUserId = async () => {
        if (user?.id) {
            await navigator.clipboard.writeText(user.id)
            setCopiedId(true)
            setTimeout(() => setCopiedId(false), 2000)
        }
    }

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await getUser()
                if (!user) return router.push("/login")
                setUser(user)
                // Fetch unread notifications count
                fetchUnreadCount()
            } catch (error) {
                router.push("/login")
            } finally {
                setLoading(false)
            }
        }

        fetchUser()
    }, [router])

    const fetchUnreadCount = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_ENDPOINT}/notifications?isRead=false&limit=100`,
                { credentials: "include" }
            )
            if (response.ok) {
                const data = await response.json()
                setUnreadCount(data.length)
            }
        } catch (error) {
            console.error("Error fetching unread count:", error)
        }
    }

    if (loading || !user) {
        return <LoadingSpinner />
    }

    return (
        <PageContainer>
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
                <Card className="mb-8">
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
                                    <Badge variant={user.privilege === "admin" ? "info" : "success"}>
                                        <Shield className="w-3.5 h-3.5 mr-1 inline" />
                                        {user.privilege.toUpperCase()}
                                    </Badge>
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
                                    <p className="font-medium">{formatDate(user.createdAt)}</p>
                                </div>
                            </div>

                            {/* User ID */}
                            <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                                <span>User ID:</span>
                                <code className="font-mono">{user.id}</code>
                                <button
                                    onClick={copyUserId}
                                    className="p-1 hover:bg-gray-800 rounded transition-colors"
                                    title="Copy User ID"
                                >
                                    {copiedId ? (
                                        <Check className="w-3 h-3 text-emerald-400" />
                                    ) : (
                                        <Copy className="w-3 h-3 text-gray-500" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(user.role === "freelancer" || user.role === "both") && (
                        <Card hover onClick={() => router.push("/jobs")} className="cursor-pointer p-6">
                            <Briefcase className="w-8 h-8 text-blue-400 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Browse Jobs</h3>
                            <p className="text-gray-400">Find your next opportunity</p>
                        </Card>
                    )}

                    {(user.role === "client" || user.role === "both") && (
                        <Card hover onClick={() => router.push("/jobs/post")} className="cursor-pointer p-6">
                            <Briefcase className="w-8 h-8 text-blue-400 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Post a Job</h3>
                            <p className="text-gray-400">Find talented freelancers</p>
                        </Card>
                    )}

                    {(user.role === "client" || user.role === "both") && (
                        <Card hover onClick={() => router.push("/jobs/my")} className="cursor-pointer p-6">
                            <Briefcase className="w-8 h-8 text-green-400 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">My Posted Jobs</h3>
                            <p className="text-gray-400">View and manage your job listings</p>
                        </Card>
                    )}

                    {/* Edit Profile - Available for all roles */}
                    <Card hover onClick={() => router.push("/profile/update")} className="cursor-pointer p-6">
                        <User className="w-8 h-8 text-blue-400 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Edit Profile</h3>
                        <p className="text-gray-400">
                            {user.role === "freelancer" ? "Update your portfolio" : "Update your information"}
                        </p>
                    </Card>

                    {/* Proposals - Available for all roles */}
                    <Card hover onClick={() => router.push("/proposals")} className="cursor-pointer p-6">
                        <FileText className="w-8 h-8 text-blue-400 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Proposals</h3>
                        <p className="text-gray-400">
                            {user.role === "freelancer"
                                ? "View your sent proposals"
                                : user.role === "client"
                                  ? "Review received proposals"
                                  : "Manage all your proposals"}
                        </p>
                    </Card>

                    {/* Contracts - Available for all roles */}
                    <Card hover onClick={() => router.push("/contracts")} className="cursor-pointer p-6">
                        <CreditCard className="w-8 h-8 text-emerald-400 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Contracts</h3>
                        <p className="text-gray-400">
                            {user.role === "freelancer"
                                ? "View your active contracts"
                                : user.role === "client"
                                  ? "Manage payments & contracts"
                                  : "View all your contracts"}
                        </p>
                    </Card>

                    {/* Payments - Available for all roles */}
                    <Card hover onClick={() => router.push("/payments")} className="cursor-pointer p-6">
                        <Receipt className="w-8 h-8 text-yellow-400 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Payments</h3>
                        <p className="text-gray-400">
                            {user.role === "freelancer"
                                ? "View received payments"
                                : user.role === "client"
                                  ? "View payment history"
                                  : "View all transactions"}
                        </p>
                    </Card>

                    {/* Notifications - Available for all roles */}
                    <Card hover onClick={() => router.push("/notifications")} className="cursor-pointer p-6">
                        <div className="relative w-fit">
                            <Bell className="w-8 h-8 text-blue-400 mb-4" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                    {unreadCount > 9 ? "9+" : unreadCount}
                                </span>
                            )}
                        </div>
                        <h3 className="text-xl font-semibold mb-2">
                            Notifications
                            {unreadCount > 0 && (
                                <span className="ml-2 text-sm text-red-400">({unreadCount} unread)</span>
                            )}
                        </h3>
                        <p className="text-gray-400">Stay updated on your activity</p>
                    </Card>
                </div>

                {/* Support Section */}
                <div className="mt-12 bg-gray-900/50 border border-blue-900/20 rounded-2xl p-8 text-center">
                    <h2 className="text-2xl font-bold mb-3">Need Help?</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto mb-4">
                        If you have any questions, issues, or feedback, feel free to reach out to us.
                    </p>
                    <button
                        onClick={() => router.push("/support")}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                        Contact Support
                    </button>
                </div>
            </div>
        </PageContainer>
    )
}
