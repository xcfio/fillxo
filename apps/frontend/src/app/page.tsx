"use client"

import { useState } from "react"
import {
    Users,
    Zap,
    Shield,
    Clock,
    ArrowRight,
    CheckCircle2,
    Sparkles,
    FileText,
    DollarSign,
    BarChart3
} from "lucide-react"
import { useRouter } from "next/navigation"

export default function LandingPage() {
    const router = useRouter()

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-gray-950 text-white">
            {/* Navigation */}
            <nav className="fixed top-0 w-full bg-gray-900/80 backdrop-blur-md border-b border-blue-900/20 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                            fillxo
                        </span>
                    </div>
                    <button
                        onClick={() => router.push("/wishlist")}
                        className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium"
                    >
                        Join Wishlist
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6">
                <div className="max-w-6xl mx-auto text-center">
                    <div className="inline-block mb-6 px-4 py-2 bg-blue-900/30 border border-blue-700/50 rounded-full text-blue-300 text-sm">
                        🇧🇩 Made for Bangladesh • Coming Soon • Free to Start
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                        Your All-in-One
                        <br />
                        <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
                            Freelance Platform
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
                        Manage clients, track time, create invoices, and get paid — all in one beautiful platform. Built
                        for Bangladeshi freelancers.
                    </p>

                    <button
                        onClick={() => router.push("/wishlist")}
                        className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold text-lg transition-all hover:scale-105 active:scale-95 inline-flex items-center gap-2 shadow-lg shadow-blue-600/20"
                    >
                        Join the Wishlist
                        <ArrowRight className="w-5 h-5" />
                    </button>

                    <p className="text-gray-500 text-sm mt-4">Be the first to know when we launch. No spam, ever.</p>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 px-6 bg-gray-900/30">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
                        Everything You Need in
                        <span className="text-blue-400"> One Place</span>
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                icon: <Users className="w-8 h-8" />,
                                title: "Client Management",
                                description:
                                    "Keep all your client information organized. Track projects and communication history."
                            },
                            {
                                icon: <Clock className="w-8 h-8" />,
                                title: "Time Tracking",
                                description:
                                    "Simple timer to track billable hours. Manual entry supported for flexibility."
                            },
                            {
                                icon: <FileText className="w-8 h-8" />,
                                title: "Professional Invoices",
                                description:
                                    "Generate beautiful invoices in Bangla & English. Download as PDF instantly."
                            },
                            {
                                icon: <DollarSign className="w-8 h-8" />,
                                title: "Payment Tracking",
                                description: "Track payments from bKash, Nagad, Rocket, Payoneer, and more."
                            },
                            {
                                icon: <BarChart3 className="w-8 h-8" />,
                                title: "Expense Management",
                                description: "Track your business expenses. Upload receipts and categorize spending."
                            },
                            {
                                icon: <Shield className="w-8 h-8" />,
                                title: "Client Portal",
                                description: "Give clients access to view invoices, projects, and make payments."
                            }
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="bg-gray-900/50 border border-blue-900/20 rounded-2xl p-6 hover:border-blue-600/50 transition-all hover:transform hover:scale-105"
                            >
                                <div className="w-14 h-14 bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-400 mb-4">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                <p className="text-gray-400">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl font-bold mb-6">
                                Built for
                                <span className="text-blue-400"> Bangladesh</span>
                            </h2>
                            <p className="text-gray-400 text-lg mb-8">
                                We understand the unique needs of Bangladeshi freelancers. That's why fillxo is designed
                                with local features you actually need.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "bKash, Nagad & Rocket payment tracking",
                                    "Dual language: Bangla & English",
                                    "BDT and USD currency support",
                                    "Mobile-optimized for on-the-go work",
                                    "Works great on slow internet",
                                    "GitHub authentication for developers",
                                    "Free to start — upgrade as you grow"
                                ].map((benefit, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <CheckCircle2 className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" />
                                        <span className="text-lg text-gray-300">{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 bg-blue-600/20 blur-3xl rounded-full"></div>
                            <div className="relative bg-gradient-to-br from-gray-900/80 to-blue-900/40 border border-blue-900/30 rounded-2xl p-8 backdrop-blur-sm">
                                <div className="space-y-4">
                                    <div className="bg-blue-600/10 border border-blue-700/30 rounded-xl p-6">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                                                <Zap className="w-6 h-6 text-blue-400" />
                                            </div>
                                            <div className="text-sm text-gray-400">Quick Actions</div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-gray-900/50 rounded-lg p-3 text-center border border-blue-900/20">
                                                <div className="text-xs text-gray-400 mb-1">New Invoice</div>
                                                <div className="text-blue-400 font-semibold">Create</div>
                                            </div>
                                            <div className="bg-gray-900/50 rounded-lg p-3 text-center border border-blue-900/20">
                                                <div className="text-xs text-gray-400 mb-1">Track Time</div>
                                                <div className="text-green-400 font-semibold">Start</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-blue-600/10 border border-blue-700/30 rounded-xl p-6">
                                        <div className="text-sm text-gray-400 mb-4">Recent Activity</div>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 text-sm">
                                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                                <span className="text-gray-300">Invoice #1234 paid</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm">
                                                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                                <span className="text-gray-300">New project created</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm">
                                                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                                                <span className="text-gray-300">Client meeting scheduled</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Section */}
            <section className="py-20 px-6 bg-gray-900/30">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-4xl font-bold mb-6">
                        Why Freelancers
                        <span className="text-blue-400"> Love fillxo</span>
                    </h2>
                    <p className="text-xl text-gray-400 mb-16 max-w-3xl mx-auto">
                        Stop juggling between Excel sheets, WhatsApp, and email. Manage everything in one beautiful
                        platform.
                    </p>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="text-5xl font-bold text-blue-400 mb-2">Free</div>
                            <div className="text-gray-400">To Get Started</div>
                        </div>
                        <div className="text-center">
                            <div className="text-5xl font-bold text-blue-400 mb-2">2x</div>
                            <div className="text-gray-400">Faster Invoicing</div>
                        </div>
                        <div className="text-center">
                            <div className="text-5xl font-bold text-blue-400 mb-2">0</div>
                            <div className="text-gray-400">Technical Knowledge Needed</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Who Is This For */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-bold text-center mb-16">
                        Perfect For
                        <span className="text-blue-400"> Every Freelancer</span>
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { title: "Web Developers", desc: "Track projects and bill clients accurately" },
                            { title: "Designers", desc: "Showcase work and get paid on time" },
                            { title: "Writers", desc: "Manage articles and track word counts" },
                            { title: "Consultants", desc: "Professional invoicing for your services" }
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="bg-gray-900/50 border border-blue-900/20 rounded-xl p-6 text-center"
                            >
                                <h3 className="text-xl font-semibold mb-2 text-blue-400">{item.title}</h3>
                                <p className="text-gray-400 text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        Ready to Simplify Your
                        <br />
                        <span className="text-blue-400">Freelance Life?</span>
                    </h2>
                    <p className="text-xl text-gray-400 mb-8">
                        Join the waitlist and be among the first to experience fillxo when we launch.
                    </p>
                    <button
                        onClick={() => router.push("/wishlist")}
                        className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold text-lg transition-all hover:scale-105 active:scale-95 inline-flex items-center gap-2 shadow-lg shadow-blue-600/20"
                    >
                        Join the Wishlist Now
                        <ArrowRight className="w-5 h-5" />
                    </button>
                    <p className="text-gray-500 text-sm mt-4">
                        No credit card required • Launching soon • Free to start
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-blue-900/20 py-8 px-6">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Sparkles className="w-4 h-4" />
                        </div>
                        <span className="font-semibold text-blue-400">fillxo</span>
                    </div>
                    <p className="text-gray-500 text-sm">© 2025 fillxo. Built with ❤️ for Bangladeshi Freelancers</p>
                </div>
            </footer>
        </div>
    )
}
