"use client"

import { useState, useEffect } from "react"
import {
    Plus,
    FileText,
    HelpCircle,
    Info,
    Github,
    MessageCircle,
    Sun,
    Moon,
    Shield,
    Briefcase,
    Facebook
} from "lucide-react"

export default function Footer() {
    const [isLight, setIsLight] = useState(false)

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme")
        const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches

        const shouldBeLight = savedTheme === "light" || (!savedTheme && prefersLight)
        setIsLight(shouldBeLight)

        if (shouldBeLight) {
            document.body.setAttribute("data-theme", "light")
        }
    }, [])

    const toggleTheme = () => {
        const newTheme = !isLight
        setIsLight(newTheme)

        if (newTheme) {
            document.body.setAttribute("data-theme", "light")
            localStorage.setItem("theme", "light")
        } else {
            document.body.removeAttribute("data-theme")
            localStorage.setItem("theme", "dark")
        }
    }

    return (
        <footer className="relative z-2 mt-16 border-t border-gray-800/50 bg-gray-900/50 text-gray-400 backdrop-blur-md">
            <div className="mx-auto max-w-[1200px] px-8 pb-6 pt-12 md:px-4">
                <div className="mb-8 grid grid-cols-1 items-start gap-12 lg:grid-cols-[2fr_3fr]">
                    {/* Footer Info */}
                    <div className="w-full">
                        <h3 className="mb-3 text-[1.8rem] font-extrabold leading-tight">
                            <a
                                href="/"
                                className="inline-block bg-linear-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent no-underline"
                            >
                                fillxo
                            </a>
                        </h3>
                        <p className="m-0 text-[0.95rem] leading-relaxed text-gray-400">
                            The ultimate freelance marketplace for Bangladesh. Connect with top talent or find your next
                            project. Built for local needs.
                        </p>
                    </div>

                    {/* Footer Links */}
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-4 md:gap-8">
                        {/* Quick Links */}
                        <div className="flex flex-col gap-4">
                            <h4 className="m-0 mb-2 p-0 text-[1.1rem] font-semibold text-white">Quick Links</h4>
                            <div className="flex flex-col gap-2.5 md:items-start items-center">
                                <a
                                    href="/browse-jobs"
                                    className="flex min-h-8 w-fit items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[0.9rem] leading-snug text-gray-400 no-underline transition-all duration-300 hover:translate-x-1 hover:bg-blue-500/10 hover:text-white"
                                >
                                    <Briefcase
                                        size={18}
                                        className="shrink-0 transition-transform duration-300 hover:scale-110"
                                    />
                                    <span className="shrink-0 overflow-visible whitespace-nowrap">Browse Jobs</span>
                                </a>
                                <a
                                    href="/post-job"
                                    className="flex min-h-8 w-fit items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[0.9rem] leading-snug text-gray-400 no-underline transition-all duration-300 hover:translate-x-1 hover:bg-blue-500/10 hover:text-white"
                                >
                                    <Plus
                                        size={18}
                                        className="shrink-0 transition-transform duration-300 hover:scale-110"
                                    />
                                    <span className="shrink-0 overflow-visible whitespace-nowrap">Post a Job</span>
                                </a>
                                <a
                                    href="/how-it-works"
                                    className="flex min-h-8 w-fit items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[0.9rem] leading-snug text-gray-400 no-underline transition-all duration-300 hover:translate-x-1 hover:bg-blue-500/10 hover:text-white"
                                >
                                    <HelpCircle
                                        size={18}
                                        className="shrink-0 transition-transform duration-300 hover:scale-110"
                                    />
                                    <span className="shrink-0 overflow-visible whitespace-nowrap">How It Works</span>
                                </a>
                                <a
                                    href="/about"
                                    className="flex min-h-8 w-fit items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[0.9rem] leading-snug text-gray-400 no-underline transition-all duration-300 hover:translate-x-1 hover:bg-blue-500/10 hover:text-white"
                                >
                                    <Info
                                        size={18}
                                        className="shrink-0 transition-transform duration-300 hover:scale-110"
                                    />
                                    <span className="shrink-0 overflow-visible whitespace-nowrap">About Us</span>
                                </a>
                            </div>
                        </div>

                        {/* Legal */}
                        <div className="flex flex-col gap-4">
                            <h4 className="m-0 mb-2 p-0 text-[1.1rem] font-semibold text-white">Legal</h4>
                            <div className="flex flex-col gap-2.5 md:items-start items-center">
                                <a
                                    href="/terms"
                                    className="flex min-h-8 w-fit items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[0.9rem] leading-snug text-gray-400 no-underline transition-all duration-300 hover:translate-x-1 hover:bg-blue-500/10 hover:text-white"
                                >
                                    <FileText
                                        size={18}
                                        className="shrink-0 transition-transform duration-300 hover:scale-110"
                                    />
                                    <span className="shrink-0 overflow-visible whitespace-nowrap">
                                        Terms of Service
                                    </span>
                                </a>
                                <a
                                    href="/privacy"
                                    className="flex min-h-8 w-fit items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[0.9rem] leading-snug text-gray-400 no-underline transition-all duration-300 hover:translate-x-1 hover:bg-blue-500/10 hover:text-white"
                                >
                                    <Shield
                                        size={18}
                                        className="shrink-0 transition-transform duration-300 hover:scale-110"
                                    />
                                    <span className="shrink-0 overflow-visible whitespace-nowrap">Privacy Policy</span>
                                </a>
                            </div>
                        </div>

                        {/* Connect */}
                        <div className="flex flex-col gap-4">
                            <h4 className="m-0 mb-2 p-0 text-[1.1rem] font-semibold text-white">Connect</h4>
                            <div className="flex flex-col gap-2.5 md:items-start items-center">
                                {/* <a
                                    href="https://github.com/xcfio"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex min-h-8 w-fit items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[0.9rem] leading-snug text-gray-400 no-underline transition-all duration-300 hover:translate-x-1 hover:bg-blue-500/10 hover:text-white"
                                    aria-label="GitHub"
                                >
                                    <Github
                                        size={20}
                                        className="shrink-0 transition-transform duration-300 hover:scale-110"
                                    />
                                    <span className="shrink-0 overflow-visible whitespace-nowrap">GitHub</span>
                                </a> */}
                                <a
                                    href="https://www.facebook.com/groups/fillxo"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex min-h-8 w-fit items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[0.9rem] leading-snug text-gray-400 no-underline transition-all duration-300 hover:translate-x-1 hover:bg-blue-500/10 hover:text-white"
                                    aria-label="Support Group"
                                >
                                    <Facebook
                                        size={20}
                                        className="shrink-0 transition-transform duration-300 hover:scale-110"
                                    />
                                    <span className="shrink-0 overflow-visible whitespace-nowrap">Support Group</span>
                                </a>
                            </div>
                        </div>

                        {/* Theme */}
                        <div className="flex flex-col gap-4">
                            <h4 className="m-0 mb-2 p-0 text-[1.1rem] font-semibold text-white">Theme</h4>
                            <div className="flex flex-col gap-4">
                                <p className="m-0 text-[0.85rem] italic text-gray-500">
                                    * This app currently only supports Dark mode
                                </p>
                            </div>
                            {/* <button
                                onClick={toggleTheme}
                                className="group relative flex min-h-10 w-fit items-center justify-start gap-2.5 overflow-hidden rounded-md border-2 border-gray-700 bg-transparent px-3 py-2.5 text-[0.9rem] leading-snug text-gray-400 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-500/50 hover:bg-blue-500/5 hover:text-white active:translate-y-0 active:scale-[0.98] md:mx-0 mx-auto"
                                aria-label={`Switch to ${isLight ? "dark" : "light"} theme`}
                            >
                                <span className="absolute left-0 top-0 h-full w-full -translate-x-full bg-linear-to-r from-transparent via-white/10 to-transparent transition-all duration-500 group-hover:translate-x-full"></span>
                                {isLight ? (
                                    <Moon
                                        size={18}
                                        className="shrink-0 transition-all duration-300 group-hover:rotate-15 group-hover:scale-110"
                                    />
                                ) : (
                                    <Sun
                                        size={18}
                                        className="shrink-0 transition-all duration-300 group-hover:rotate-15 group-hover:scale-110"
                                    />
                                )}
                                <span className="shrink-0 whitespace-nowrap font-medium">
                                    {isLight ? "Dark Mode" : "Light Mode"}
                                </span>
                            </button> */}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800/50 pt-6 text-center">
                    <p className="m-0 text-[0.9rem] leading-snug text-gray-500">
                        © {new Date().getFullYear()} fillxo. Made with ❤️ for Bangladesh. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}
