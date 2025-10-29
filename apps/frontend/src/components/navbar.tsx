"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Image from "next/image"

export default function Navbar() {
    const router = useRouter()
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        // Check if user is logged in
        const userData = localStorage.getItem("user")
        setIsLoggedIn(!!userData)
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
                    {isLoggedIn ? (
                        <button
                            onClick={() => router.push("/dashboard")}
                            className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium"
                        >
                            Go to Dashboard
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={() => router.push("/login")}
                                className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors font-medium"
                            >
                                Sign In
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
            </div>
        </nav>
    )
}
