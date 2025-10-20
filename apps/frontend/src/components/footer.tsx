"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"

export default function Footer() {
    const router = useRouter()

    return (
        <footer className="border-t border-blue-900/20 py-8 px-6">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                <button onClick={() => router.push("/")} className="flex items-center gap-2">
                    <Image src="/favicon.svg" alt="fillxo" width={24} height={24} className="w-6 h-6" />
                    <span className="font-semibold text-blue-400">fillxo</span>
                </button>

                <p className="text-gray-500 text-sm">© 2025 fillxo. All rights reserved</p>
            </div>
        </footer>
    )
}
