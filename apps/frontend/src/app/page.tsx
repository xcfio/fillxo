"use client"

import {
    Users,
    Zap,
    ArrowRight,
    CheckCircle2,
    DollarSign,
    Briefcase,
    UserCheck,
    CircleChevronDown,
    Globe
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Footer from "@/components/footer"
import Navbar from "@/components/navbar"

export default function LandingPage() {
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
        <div className="min-h-screen bg-linear-to-br from-gray-950 via-blue-950 to-gray-950 text-white">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6">
                <div className="max-w-6xl mx-auto text-center">
                    <div className="inline-block mb-6 px-4 py-2 bg-blue-900/30 border border-blue-700/50 rounded-full text-blue-300 text-sm">
                        The Future of Freelancing in Bangladesh
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                        Where Talent Meets
                        <br />
                        <span className="bg-linear-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
                            Opportunity
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
                        Connect with top Bangladeshi talent or find your next project. A complete freelance marketplace
                        built for local needs.
                    </p>

                    {!authCheckDone ? (
                        process.env.NODE_ENV !== "production" ? (
                            <div className="flex items-center justify-center gap-3 px-8 py-4 bg-gray-800/50 border border-blue-900/30 rounded-xl">
                                <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                                <span className="text-gray-400">Checking authentication...</span>
                            </div>
                        ) : (
                            <div className="h-14" />
                        )
                    ) : isLoggedIn ? (
                        <button
                            onClick={() => router.push("/dashboard")}
                            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold text-lg transition-all hover:scale-105 active:scale-95 inline-flex items-center gap-2 shadow-lg shadow-blue-600/20"
                        >
                            Go to Dashboard
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    ) : (
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <button
                                onClick={() => router.push("/register")}
                                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold text-lg transition-all hover:scale-105 active:scale-95 inline-flex items-center gap-2 shadow-lg shadow-blue-600/20"
                            >
                                Join as Freelancer
                                <ArrowRight className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => router.push("/register")}
                                className="px-8 py-4 bg-gray-800 hover:bg-gray-700 border border-blue-900/30 rounded-xl font-semibold text-lg transition-all hover:scale-105 active:scale-95 inline-flex items-center gap-2"
                            >
                                I'm Hiring
                                <Briefcase className="w-5 h-5" />
                            </button>
                        </div>
                    )}

                    <p className="text-gray-500 text-sm mt-6">Free to join • Built for Bangladesh</p>
                </div>
            </section>

            {/* For Freelancers / For Clients Toggle Section */}
            <section className="py-20 px-6 bg-gray-900/30">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
                        Everything You Need to
                        <span className="text-blue-400"> Succeed</span>
                    </h2>

                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        {/* For Freelancers */}
                        <div className="bg-gray-900/50 border border-blue-900/20 rounded-2xl p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center">
                                    <Users className="w-6 h-6 text-blue-400" />
                                </div>
                                <h3 className="text-2xl font-bold">For Freelancers</h3>
                            </div>
                            <ul className="space-y-4">
                                {[
                                    "Find projects that match your skills",
                                    "Build your professional portfolio",
                                    "Get paid securely (bKash, Nagad, Bank)",
                                    "Track time and manage projects",
                                    "Professional invoicing & contracts",
                                    "Connect with local and global clients"
                                ].map((item, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                                        <span className="text-gray-300">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* For Clients */}
                        <div className="bg-gray-900/50 border border-blue-900/20 rounded-2xl p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center">
                                    <Briefcase className="w-6 h-6 text-green-400" />
                                </div>
                                <h3 className="text-2xl font-bold">For Clients</h3>
                            </div>
                            <ul className="space-y-4">
                                {[
                                    "Access top Bangladeshi talent",
                                    "Post projects and get proposals",
                                    "Review portfolios and ratings",
                                    "Secure milestone-based payments",
                                    "Real-time project tracking",
                                    "Quality work, fair prices"
                                ].map((item, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                                        <span className="text-gray-300">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
                        How
                        <span className="text-blue-400"> fillxo Works</span>
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                step: "1",
                                icon: <UserCheck className="w-8 h-8" />,
                                title: "Create Your Profile",
                                desc: "Sign up in minutes. Build your profile, showcase your skills and portfolio."
                            },
                            {
                                step: "2",
                                icon: <Globe className="w-8 h-8" />,
                                title: "Find Work or Talent",
                                desc: "Freelancers: Browse projects. Clients: Post jobs and review proposals."
                            },
                            {
                                step: "3",
                                icon: <DollarSign className="w-8 h-8" />,
                                title: "Work & Get Paid",
                                desc: "Complete projects with confidence. Secure payments through local methods."
                            }
                        ].map((item, index) => (
                            <div key={index} className="text-center">
                                <div className="relative mb-6">
                                    <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center text-blue-400 mx-auto">
                                        {item.icon}
                                    </div>
                                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold mx-auto transform translate-x-1/2">
                                        {item.step}
                                    </div>
                                </div>
                                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                                <p className="text-gray-400">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="py-20 px-6 bg-gray-900/30">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
                        Popular
                        <span className="text-blue-400"> Categories</span>
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { name: "Web Development", icon: "💻" },
                            { name: "Graphic Design", icon: "🎨" },
                            { name: "Content Writing", icon: "✍️" },
                            { name: "Digital Marketing", icon: "📱" },
                            { name: "Video Editing", icon: "🎬" },
                            { name: "UI/UX Design", icon: "🎯" },
                            { name: "Data Entry", icon: "📊" },
                            { name: "Virtual Assistant", icon: "💼" }
                        ].map((category, index) => (
                            <div
                                key={index}
                                className="bg-gray-900/50 border border-blue-900/20 rounded-xl p-6 hover:border-blue-600/50 transition-all hover:transform hover:scale-105 text-center cursor-pointer"
                            >
                                <div className="text-4xl mb-3">{category.icon}</div>
                                <h3 className="font-semibold text-gray-200">{category.name}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose fillxo */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl font-bold mb-6">
                                Why Choose
                                <span className="text-blue-400"> fillxo?</span>
                            </h2>
                            <p className="text-gray-400 text-lg mb-8">
                                We're not just another freelance platform. We understand the unique challenges and
                                opportunities in Bangladesh's growing gig economy.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "Local payment methods (bKash, Nagad, Rocket)",
                                    "Dual language support (Bangla & English)",
                                    "Lower fees than international platforms",
                                    "Designed for Bangladesh market",
                                    "Mobile-first, works on slow internet",
                                    "Secure escrow payment system",
                                    "Dedicated support team"
                                ].map((benefit, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <CheckCircle2 className="w-6 h-6 text-blue-400 shrink-0 mt-0.5" />
                                        <span className="text-lg text-gray-300">{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 bg-blue-600/20 blur-3xl rounded-full"></div>
                            <div className="relative bg-linear-to-br from-gray-900/80 to-blue-900/40 border border-blue-900/30 rounded-2xl p-8 backdrop-blur-sm">
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
                                                <div className="text-xs text-gray-400 mb-1">Browse Jobs</div>
                                                <div className="text-blue-400 font-semibold">Explore</div>
                                            </div>
                                            <div className="bg-gray-900/50 rounded-lg p-3 text-center border border-blue-900/20">
                                                <div className="text-xs text-gray-400 mb-1">Post Project</div>
                                                <div className="text-green-400 font-semibold">Create</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-blue-600/10 border border-blue-700/30 rounded-xl p-6">
                                        <div className="text-sm text-gray-400 mb-4">Platform Features</div>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 text-sm">
                                                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                                <span className="text-gray-300">Secure escrow payments</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm">
                                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                                <span className="text-gray-300">Real-time messaging</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm">
                                                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                                                <span className="text-gray-300">Project milestones</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 px-6 bg-gray-900/30">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-5xl font-bold text-blue-400 mb-2">Free</div>
                            <div className="text-gray-400">To Get Started</div>
                        </div>
                        <div>
                            <div className="text-5xl font-bold text-blue-400 mb-2">24/7</div>
                            <div className="text-gray-400">Platform Access</div>
                        </div>
                        <div>
                            <div className="text-5xl font-bold text-blue-400 mb-2">100%</div>
                            <div className="text-gray-400">Secure Payments</div>
                        </div>
                        <div>
                            <div className="text-5xl font-bold text-blue-400 mb-2">Fast</div>
                            <div className="text-gray-400">Dispute Resolution</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 px-6 bg-gray-900/30">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
                        Frequently Asked
                        <span className="text-blue-400"> Questions</span>
                    </h2>

                    <div className="space-y-4">
                        {[
                            {
                                q: "When will fillxo launch?",
                                a: "We're working hard to launch soon! Join our wishlist to be notified the moment we go live. Early members will get special perks and priority access."
                            },
                            {
                                q: "Is fillxo really free to join?",
                                a: "Yes! Signing up as a freelancer or client is completely free. We'll only charge a small service fee when you successfully complete a project."
                            },
                            {
                                q: "What payment methods do you support?",
                                a: "We support popular Bangladeshi payment methods including bKash, Nagad, Rocket, and bank transfers. We're also working on international payment options like Payoneer and wire transfers."
                            },
                            {
                                q: "How is fillxo different from Upwork or Fiverr?",
                                a: "fillxo is built specifically for the Bangladeshi market. We offer local payment methods, dual language support, lower fees, and understand the unique needs of local freelancers and businesses."
                            },
                            {
                                q: "Do I need to be in Bangladesh to use fillxo?",
                                a: "While we're optimized for Bangladesh, anyone can join! Clients from anywhere can hire Bangladeshi talent, and freelancers can work with global clients."
                            },
                            {
                                q: "What categories of work are available?",
                                a: "We support a wide range of categories including Web Development, Graphic Design, Content Writing, Digital Marketing, Video Editing, UI/UX Design, Data Entry, Virtual Assistance, and more!"
                            },
                            {
                                q: "Can I use fillxo on my mobile phone?",
                                a: "Absolutely! fillxo is designed mobile-first and works great even on slower internet connections. Manage your freelance business on the go."
                            }
                        ].map((faq, index) => (
                            <details
                                key={index}
                                className="bg-gray-900/50 border border-blue-900/20 rounded-xl p-6 hover:border-blue-600/50 transition-all group"
                            >
                                <summary className="cursor-pointer font-semibold text-lg text-gray-200 flex items-center justify-between">
                                    {faq.q}
                                    <span className="text-blue-400 group-open:rotate-180 transition-transform">
                                        <CircleChevronDown />
                                    </span>
                                </summary>
                                <p className="mt-4 text-gray-400 leading-relaxed">{faq.a}</p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        Ready to Start Your
                        <br />
                        <span className="text-blue-400">Freelance Journey?</span>
                    </h2>
                    <p className="text-xl text-gray-400 mb-8">
                        Join thousands of Bangladeshi freelancers and clients waiting for launch.
                    </p>
                    {!authCheckDone ? (
                        process.env.NODE_ENV !== "production" ? (
                            <div className="flex items-center justify-center gap-3 px-8 py-4 bg-gray-800/50 border border-blue-900/30 rounded-xl">
                                <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                                <span className="text-gray-400">Checking authentication...</span>
                            </div>
                        ) : (
                            <div className="h-14" /> // Silent loading in production
                        )
                    ) : isLoggedIn ? (
                        <button
                            onClick={() => router.push("/dashboard")}
                            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold text-lg transition-all hover:scale-105 active:scale-95 inline-flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
                        >
                            Go to Dashboard
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    ) : (
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => router.push("/register")}
                                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold text-lg transition-all hover:scale-105 active:scale-95 inline-flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
                            >
                                Join as Freelancer
                                <ArrowRight className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => router.push("/register")}
                                className="px-8 py-4 bg-gray-800 hover:bg-gray-700 border border-blue-900/30 rounded-xl font-semibold text-lg transition-all hover:scale-105 active:scale-95 inline-flex items-center justify-center gap-2"
                            >
                                Join as Client
                                <Briefcase className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                    <p className="text-gray-500 text-sm mt-6">
                        No credit card required • Launching soon • Built for Bangladesh
                    </p>
                </div>
            </section>

            <Footer />
        </div>
    )
}
