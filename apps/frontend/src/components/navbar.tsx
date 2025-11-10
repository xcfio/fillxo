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
    ChevronDown
} from "lucide-react"

export default function Navbar() {
    const router = useRouter()
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [authCheckDone, setAuthCheckDone] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [userData, setUserData] = useState<any>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // Check authentication status from backend
        const checkAuth = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/users/me`, {
                    credentials: "include"
                })
                if (response.ok) {
                    const data = await response.json()
                    setUserData(data)
                    setIsLoggedIn(true)
                } else {
                    setIsLoggedIn(false)
                    setUserData(null)
                }
            } catch (error) {
                setIsLoggedIn(false)
                setUserData(null)
            } finally {
                setAuthCheckDone(true)
            }
        }
        checkAuth()

        // Also check when window gains focus (user might have logged in/out in another tab)
        const handleFocus = () => {
            checkAuth()
        }
        window.addEventListener("focus", handleFocus)

        return () => {
            window.removeEventListener("focus", handleFocus)
        }
    }, [])

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false)
            }
        }

        if (isDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside)
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [isDropdownOpen])

    const handleLogout = async () => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/logout`, {
                method: "POST",
                credentials: "include"
            })
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
                            <button
                                onClick={() => router.push("/dashboard")}
                                className="text-gray-400 hover:text-white transition-colors"
                                title="Notifications"
                            >
                                <Bell className="w-5 h-5" />
                            </button>
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
                                            {userData.role === "freelancer" && (
                                                <button
                                                    onClick={() => handleNavigation("/dashboard")}
                                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800/50 hover:text-white transition-colors"
                                                >
                                                    <Briefcase className="w-4 h-4" />
                                                    Browse Jobs
                                                </button>
                                            )}
                                            {userData.role === "client" && (
                                                <button
                                                    onClick={() => handleNavigation("/dashboard")}
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
                                    onClick={() => handleNavigation("/dashboard")}
                                    className="block w-full text-left px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors font-medium"
                                >
                                    <div className="flex items-center gap-3">
                                        <Bell className="w-4 h-4" />
                                        Notifications
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
