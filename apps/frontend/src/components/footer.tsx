"use client"

import { Facebook, Mail } from "lucide-react"

export default function Footer() {
    const links = {
        platform: [
            { href: "/jobs", label: "Browse Jobs" },
            { href: "/how-it-works", label: "How It Works" },
            { href: "/about", label: "About" }
        ],
        support: [
            { href: "/support", label: "Help Center" },
            { href: "mailto:omarfaruksxp@gmail.com", label: "Contact Us" },
            { href: "https://www.facebook.com/groups/fillxo", label: "Community", external: true }
        ],
        legal: [
            { href: "/terms", label: "Terms" },
            { href: "/privacy", label: "Privacy" }
        ]
    }

    return (
        <footer className="mt-auto border-t border-gray-800/50 bg-gray-950/80">
            <div className="mx-auto max-w-6xl px-6 py-12">
                {/* Main Footer Content */}
                <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-4 lg:col-span-2">
                        <a href="/" className="inline-block text-2xl font-bold text-white mb-3">
                            fillxo
                        </a>
                        <p className="text-sm text-gray-400 max-w-xs mb-4">
                            Bangladesh's freelance marketplace. Connect, collaborate, and grow.
                        </p>
                        <div className="flex gap-3">
                            <a
                                href="https://www.facebook.com/groups/fillxo"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-800/50 text-gray-400 hover:bg-blue-600 hover:text-white transition-all"
                                aria-label="Facebook"
                            >
                                <Facebook size={18} />
                            </a>
                            <a
                                href="mailto:omarfaruksxp@gmail.com"
                                className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-800/50 text-gray-400 hover:bg-blue-600 hover:text-white transition-all"
                                aria-label="Email"
                            >
                                <Mail size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Platform Links */}
                    <div>
                        <h4 className="text-sm font-semibold text-white mb-4">Platform</h4>
                        <ul className="space-y-2.5">
                            {links.platform.map((link) => (
                                <li key={link.href}>
                                    <a
                                        href={link.href}
                                        className="text-sm text-gray-400 hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h4 className="text-sm font-semibold text-white mb-4">Support</h4>
                        <ul className="space-y-2.5">
                            {links.support.map((link) => (
                                <li key={link.href}>
                                    <a
                                        href={link.href}
                                        {...(link.external && { target: "_blank", rel: "noopener noreferrer" })}
                                        className="text-sm text-gray-400 hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h4 className="text-sm font-semibold text-white mb-4">Legal</h4>
                        <ul className="space-y-2.5">
                            {links.legal.map((link) => (
                                <li key={link.href}>
                                    <a
                                        href={link.href}
                                        className="text-sm text-gray-400 hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-10 pt-6 border-t border-gray-800/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-gray-500">© {new Date().getFullYear()} fillxo. All rights reserved.</p>
                    <p className="text-xs text-gray-500">Made with ❤️ in Bangladesh</p>
                </div>
            </div>
        </footer>
    )
}
