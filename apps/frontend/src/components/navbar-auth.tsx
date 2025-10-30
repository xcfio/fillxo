"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { LogOut, MessageSquare, Bell } from "lucide-react"

export default function NavbarAuth() {
    const router = useRouter()

    const handleLogout = async () => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/logout`, {
                method: "POST",
                credentials: "include"
            })
        } catch (error) {
            console.error("Logout error:", error)
        } finally {
            router.push("/")
        }
    }

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

                <div className="flex items-center gap-6">
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
                    <button className="text-gray-400 hover:text-white transition-colors">
                        <Bell className="w-5 h-5" />
                    </button>
                    <button className="text-gray-400 hover:text-white transition-colors">
                        <MessageSquare className="w-5 h-5" />
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-700/50 rounded-lg text-red-300 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    )
}
