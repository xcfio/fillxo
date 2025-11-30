"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import {
    Menu,
    X,
    LogOut,
    MessageSquare,
    Bell,
    User,
    Settings,
    Briefcase,
    LayoutDashboard,
    ChevronDown,
    Check
} from "lucide-react"
import { getUser } from "@/utils/auth"
import { Notification } from "@/types/notification"

export default function Navbar() {
    const router = useRouter()
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [authCheckDone, setAuthCheckDone] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [userData, setUserData] = useState<any>(null)
    const [unreadCount, setUnreadCount] = useState(0)
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [isNotificationOpen, setIsNotificationOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const notificationRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const user = await getUser()
                if (user) {
                    setUserData(user)
                    setIsLoggedIn(true)
                    // Fetch unread notification count
                    fetchUnreadCount()
                } else {
                    setIsLoggedIn(false)
                    setUserData(null)
                    setUnreadCount(0)
                }
            } catch (error) {
                setIsLoggedIn(false)
                setUserData(null)
                setUnreadCount(0)
            } finally {
                setAuthCheckDone(true)
            }
        }
        checkAuth()

        const handleFocus = () => {
            checkAuth()
        }
        window.addEventListener("focus", handleFocus)

        return () => {
            window.removeEventListener("focus", handleFocus)
        }
    }, [])

    const fetchUnreadCount = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/notifications?limit=5`, {
                credentials: "include"
            })
            if (response.ok) {
                const data = await response.json()
                setNotifications(data)
                // Count unread
                const countResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/notifications?isRead=false&limit=100`,
                    { credentials: "include" }
                )
                if (countResponse.ok) {
                    const countData = await countResponse.json()
                    setUnreadCount(countData.length)
                }
            }
        } catch (error) {
            console.error("Error fetching notifications:", error)
        }
    }

    const markAllRead = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/notifications/read-all`, {
                method: "PUT",
                credentials: "include"
            })
            if (response.ok) {
                setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
                setUnreadCount(0)
            }
        } catch (error) {
            console.error("Error marking all as read:", error)
        }
    }

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false)
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setIsNotificationOpen(false)
            }
        }

        if (isDropdownOpen || isNotificationOpen) {
            document.addEventListener("mousedown", handleClickOutside)
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [isDropdownOpen, isNotificationOpen])

    const handleLogout = async () => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/logout`, {
                method: "POST",
                credentials: "include"
            })
            window.sessionStorage.removeItem("user")
        } catch (error) {
            console.error("Logout error:", error)
        } finally {
            setIsLoggedIn(false)
            setUserData(null)
            setIsDropdownOpen(false)
            router.push("/")
        }
    }

    const handleNavigation = (path: string) => {
        setIsDropdownOpen(false)
        setIsMobileMenuOpen(false)
        router.push(path)
    }

    return (
        <nav className="fixed top-0 w-full bg-gray-900/80 backdrop-blur-md border-b border-blue-900/20 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
                <button
                    onClick={() => router.push("/")}
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                    <Image src="/favicon.svg" alt="fillxo" width={32} height={32} className="w-8 h-8" />
                    <span className="text-xl sm:text-2xl font-bold bg-linear-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                        fillxo
                    </span>
                </button>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-4">
                    <button
                        onClick={() => router.push("/terms")}
                        className="px-3 py-2 text-sm text-gray-300 hover:text-white transition-colors font-medium"
                    >
                        Terms of Service
                    </button>
                    <button
                        onClick={() => router.push("/privacy")}
                        className="px-3 py-2 text-sm text-gray-300 hover:text-white transition-colors font-medium"
                    >
                        Privacy Policy
                    </button>
                    {!authCheckDone && process.env.NODE_ENV !== "production" ? (
                        <div className="px-4 py-2 text-sm bg-gray-700 rounded-lg flex items-center gap-2">
                            <div className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                            <span className="text-gray-400">Auth...</span>
                        </div>
                    ) : isLoggedIn && userData ? (
                        <>
                            {/* Notifications Dropdown */}
                            <div className="relative" ref={notificationRef}>
                                <button
                                    onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                                    className="relative p-2 text-gray-400 hover:text-white transition-colors"
                                    title="Notifications"
                                >
                                    <Bell className="w-5 h-5" />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                            {unreadCount > 9 ? "9+" : unreadCount}
                                        </span>
                                    )}
                                </button>

                                {isNotificationOpen && (
                                    <div className="absolute top-full right-0 mt-1 w-80 bg-gray-900 border border-blue-900/30 rounded-xl shadow-xl overflow-hidden z-50">
                                        <div className="px-4 py-3 border-b border-blue-900/20 flex justify-between items-center">
                                            <h3 className="font-semibold">Notifications</h3>
                                            <div className="flex items-center gap-2">
                                                {unreadCount > 0 && (
                                                    <>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                markAllRead()
                                                            }}
                                                            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                                                            title="Mark all as read"
                                                        >
                                                            <Check className="w-3 h-3" />
                                                            Mark read
                                                        </button>
                                                        <span className="text-xs text-gray-500">•</span>
                                                        <span className="text-xs text-red-400">
                                                            {unreadCount} unread
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="max-h-80 overflow-y-auto">
                                            {notifications.length === 0 ? (
                                                <div className="px-4 py-8 text-center text-gray-400">
                                                    <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                                    <p className="text-sm">No notifications yet</p>
                                                </div>
                                            ) : (
                                                notifications.map((notification) => (
                                                    <button
                                                        key={notification.id}
                                                        onClick={() => {
                                                            setIsNotificationOpen(false)
                                                            if (notification.link) {
                                                                router.push(notification.link)
                                                            }
                                                        }}
                                                        className={`w-full px-4 py-3 text-left hover:bg-gray-800/50 transition-colors border-b border-blue-900/10 last:border-0 ${
                                                            !notification.isRead ? "bg-blue-900/10" : ""
                                                        }`}
                                                    >
                                                        <p
                                                            className={`text-sm font-medium ${!notification.isRead ? "text-white" : "text-gray-300"}`}
                                                        >
                                                            {notification.title}
                                                        </p>
                                                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                                                            {notification.message}
                                                        </p>
                                                    </button>
                                                ))
                                            )}
                                        </div>
                                        <button
                                            onClick={() => {
                                                setIsNotificationOpen(false)
                                                router.push("/notifications")
                                            }}
                                            className="w-full px-4 py-3 text-center text-sm text-blue-400 hover:bg-gray-800/50 transition-colors border-t border-blue-900/20"
                                        >
                                            See all notifications
                                        </button>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => router.push("/dashboard")}
                                className="text-gray-400 hover:text-white transition-colors"
                                title="Messages"
                            >
                                <MessageSquare className="w-5 h-5" />
                            </button>

                            {/* Avatar Dropdown */}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-800/50 rounded-lg transition-colors"
                                >
                                    <div className="w-8 h-8 bg-blue-600/20 border border-blue-700/50 rounded-full flex items-center justify-center">
                                        {userData.avatar ? (
                                            <Image
                                                src={userData.avatar}
                                                alt={userData.name}
                                                width={32}
                                                height={32}
                                                className="rounded-full"
                                            />
                                        ) : (
                                            <User className="w-4 h-4 text-blue-400" />
                                        )}
                                    </div>
                                    <ChevronDown
                                        className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                                    />
                                </button>

                                {/* Dropdown Menu */}
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-64 bg-gray-900 border border-blue-900/30 rounded-lg shadow-xl overflow-hidden z-50">
                                        {/* User Info */}
                                        <div className="px-4 py-3 border-b border-blue-900/30">
                                            <p className="font-semibold text-white">{userData.name}</p>
                                            <p className="text-sm text-gray-400">@{userData.username}</p>
                                            <p className="text-xs text-gray-500 mt-1">{userData.email}</p>
                                        </div>

                                        {/* Menu Items */}
                                        <div className="py-2">
                                            <button
                                                onClick={() => handleNavigation("/dashboard")}
                                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800/50 hover:text-white transition-colors"
                                            >
                                                <LayoutDashboard className="w-4 h-4" />
                                                Dashboard
                                            </button>
                                            <button
                                                onClick={() => handleNavigation(`/users/${userData.username}`)}
                                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800/50 hover:text-white transition-colors"
                                            >
                                                <User className="w-4 h-4" />
                                                View Profile
                                            </button>
                                            <button
                                                onClick={() => handleNavigation("/profile/update")}
                                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800/50 hover:text-white transition-colors"
                                            >
                                                <Settings className="w-4 h-4" />
                                                Edit Profile
                                            </button>
                                            {(userData.role === "freelancer" || userData.role === "both") && (
                                                <button
                                                    onClick={() => handleNavigation("/jobs")}
                                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800/50 hover:text-white transition-colors"
                                                >
                                                    <Briefcase className="w-4 h-4" />
                                                    Browse Jobs
                                                </button>
                                            )}
                                            {(userData.role === "client" || userData.role === "both") && (
                                                <button
                                                    onClick={() => handleNavigation("/jobs/post")}
                                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800/50 hover:text-white transition-colors"
                                                >
                                                    <Briefcase className="w-4 h-4" />
                                                    Post a Job
                                                </button>
                                            )}
                                        </div>

                                        {/* Logout */}
                                        <div className="border-t border-blue-900/30 py-2">
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => router.push("/login")}
                                className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors font-medium"
                            >
                                Login
                            </button>
                            <button
                                onClick={() => router.push("/register")}
                                className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium"
                            >
                                Get Started
                            </button>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
                    aria-label="Toggle menu"
                >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-gray-900/95 backdrop-blur-md border-t border-blue-900/20">
                    <div className="px-4 py-4 space-y-3">
                        <button
                            onClick={() => {
                                router.push("/jobs")
                                setIsMobileMenuOpen(false)
                            }}
                            className="block w-full text-left px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors font-medium"
                        >
                            Browse Jobs
                        </button>
                        <button
                            onClick={() => {
                                router.push("/terms")
                                setIsMobileMenuOpen(false)
                            }}
                            className="block w-full text-left px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors font-medium"
                        >
                            Terms of Service
                        </button>
                        <button
                            onClick={() => {
                                router.push("/privacy")
                                setIsMobileMenuOpen(false)
                            }}
                            className="block w-full text-left px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors font-medium"
                        >
                            Privacy Policy
                        </button>
                        {!authCheckDone && process.env.NODE_ENV !== "production" ? (
                            <div className="px-4 py-3 text-sm bg-gray-700 rounded-lg flex items-center gap-2">
                                <div className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                                <span className="text-gray-400">Auth...</span>
                            </div>
                        ) : isLoggedIn && userData ? (
                            <>
                                <button
                                    onClick={() => handleNavigation("/dashboard")}
                                    className="block w-full text-left px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors font-medium"
                                >
                                    <div className="flex items-center gap-3">
                                        <LayoutDashboard className="w-4 h-4" />
                                        Dashboard
                                    </div>
                                </button>
                                <button
                                    onClick={() => handleNavigation(`/users/${userData.username}`)}
                                    className="block w-full text-left px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors font-medium"
                                >
                                    <div className="flex items-center gap-3">
                                        <User className="w-4 h-4" />
                                        View Profile
                                    </div>
                                </button>
                                <button
                                    onClick={() => handleNavigation("/profile/update")}
                                    className="block w-full text-left px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors font-medium"
                                >
                                    <div className="flex items-center gap-3">
                                        <Settings className="w-4 h-4" />
                                        Edit Profile
                                    </div>
                                </button>
                                <button
                                    onClick={() => handleNavigation("/notifications")}
                                    className="block w-full text-left px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors font-medium"
                                >
                                    <div className="flex items-center gap-3">
                                        <Bell className="w-4 h-4" />
                                        Notifications
                                        {unreadCount > 0 && (
                                            <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                                                {unreadCount > 9 ? "9+" : unreadCount}
                                            </span>
                                        )}
                                    </div>
                                </button>
                                <button
                                    onClick={() => handleNavigation("/dashboard")}
                                    className="block w-full text-left px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors font-medium"
                                >
                                    <div className="flex items-center gap-3">
                                        <MessageSquare className="w-4 h-4" />
                                        Messages
                                    </div>
                                </button>
                                {userData.role === "freelancer" && (
                                    <button
                                        onClick={() => handleNavigation("/dashboard")}
                                        className="block w-full text-left px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors font-medium"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Briefcase className="w-4 h-4" />
                                            Browse Jobs
                                        </div>
                                    </button>
                                )}
                                {userData.role === "client" && (
                                    <button
                                        onClick={() => handleNavigation("/dashboard")}
                                        className="block w-full text-left px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors font-medium"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Briefcase className="w-4 h-4" />
                                            Post a Job
                                        </div>
                                    </button>
                                )}
                                <button
                                    onClick={() => {
                                        handleLogout()
                                    }}
                                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-red-600/20 hover:bg-red-600/30 border border-red-700/50 rounded-lg text-red-300 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => handleNavigation("/login")}
                                    className="block w-full px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors font-medium text-center"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => handleNavigation("/register")}
                                    className="block w-full px-4 py-3 text-sm bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium text-center"
                                >
                                    Get Started
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}
