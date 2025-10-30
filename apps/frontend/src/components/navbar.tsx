"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Image from "next/image"

export default function Navbar() {
    const router = useRouter()
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [authCheckDone, setAuthCheckDone] = useState(false)

    useEffect(() => {
        // Check authentication status from backend
        const checkAuth = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/me`, {
                    credentials: "include"
                })
                setIsLoggedIn(response.ok)
            } catch (error) {
                // Network error or auth failed, treat as not logged in
                if (process.env.NODE_ENV !== "production") {
                    console.error("Auth check failed:", error)
                }
                setIsLoggedIn(false)
            } finally {
                setAuthCheckDone(true)
            }
        }
        checkAuth()
    }, [])

    return (
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
                <div className="flex items-center gap-4">
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
                    ) : isLoggedIn ? (
                        <button
                            onClick={() => router.push("/dashboard")}
                            className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium"
                        >
                            Go to Dashboard
                        </button>
                    ) : (
                        <button
                            onClick={() => router.push("/register")}
                            className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium"
                        >
                            Get Started
                        </button>
                    )}
                </div>
            </div>
        </nav>
    )
}
