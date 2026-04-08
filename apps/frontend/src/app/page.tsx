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
    Globe,
    Shield,
    Clock,
    Star,
    TrendingUp,
    MessageSquare,
    Search
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { isAuthenticated } from "@/utils/auth"

export default function LandingPage() {
    const router = useRouter()
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [authCheckDone, setAuthCheckDone] = useState(false)

    useEffect(() => {
        const checkAuth = async () => setIsLoggedIn(await isAuthenticated()) ?? setAuthCheckDone(true)
        checkAuth()
    }, [])

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            {/* Floating Header */}
            <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center bg-gray-900/70 backdrop-blur-xl border border-gray-800/50 rounded-2xl px-6 py-3">
                    <button
                        onClick={() => router.push("/")}
                        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                    >
                        <Image src="/favicon.svg" alt="fillxo" width={32} height={32} className="w-8 h-8" />
                        <span className="text-xl font-bold bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                            fillxo
                        </span>
                    </button>

                    <nav className="hidden md:flex items-center gap-8">
                        <button
                            onClick={() => router.push("/jobs")}
                            className="text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            Browse Jobs
                        </button>
                        <button
                            onClick={() => router.push("/how-it-works")}
                            className="text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            How It Works
                        </button>
                        <button
                            onClick={() => router.push("/search")}
                            className="text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            Find Talent
                        </button>
                    </nav>

                    <div className="flex items-center gap-3">
                        {!authCheckDone ? (
                            <div className="w-20 h-9 bg-gray-800 rounded-lg animate-pulse" />
                        ) : isLoggedIn ? (
                            <Button onClick={() => router.push("/dashboard")}>Dashboard</Button>
                        ) : (
                            <>
                                <button
                                    onClick={() => router.push("/login")}
                                    className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
                                >
                                    Log In
                                </button>
                                <Button onClick={() => router.push("/register")}>Get Started</Button>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative pt-32 pb-24 px-6 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-150 bg-linear-to-b from-blue-600/20 via-cyan-600/10 to-transparent blur-3xl pointer-events-none" />
                <div className="absolute top-40 left-20 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-60 right-20 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-6xl mx-auto text-center relative">
                    <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 bg-linear-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-full">
                        <span className="text-sm text-gray-300">Now Open for Early Access</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-[1.1] tracking-tight">
                        Work Without
                        <br />
                        <span className="bg-linear-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                            Boundaries
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                        Connect with Bangladesh's best talent or find projects that match your skills. Secure payments,
                        real-time collaboration, zero hassle.
                    </p>

                    {!authCheckDone ? (
                        <div className="h-14" />
                    ) : isLoggedIn ? (
                        <Button
                            onClick={() => router.push("/dashboard")}
                            icon={ArrowRight}
                            className="shadow-lg shadow-blue-600/25"
                        >
                            Go to Dashboard
                        </Button>
                    ) : (
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Button
                                onClick={() => router.push("/register")}
                                icon={ArrowRight}
                                className="shadow-lg shadow-blue-600/25"
                            >
                                Start Freelancing
                            </Button>
                            <button
                                onClick={() => router.push("/register?role=client")}
                                className="group flex items-center gap-2 px-6 py-3 text-gray-300 hover:text-white transition-colors"
                            >
                                <Briefcase className="w-5 h-5" />
                                Hire Talent
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    )}

                    {/* Trust Badges */}
                    <div className="flex flex-wrap justify-center gap-6 mt-16 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-green-500" />
                            <span>Secure Payments</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-500" />
                            <span>24/7 Support</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span>Verified Talent</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Floating Stats Bar */}
            <section className="px-6 -mt-4 relative z-10">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-linear-to-r from-gray-900 to-gray-900/80 border border-gray-800/50 rounded-3xl p-8 backdrop-blur-sm">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            <div className="text-center">
                                <div className="text-3xl md:text-4xl font-bold bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                    Free
                                </div>
                                <div className="text-sm text-gray-500 mt-1">To Join</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl md:text-4xl font-bold bg-linear-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                                    1%
                                </div>
                                <div className="text-sm text-gray-500 mt-1">Low Fees</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl md:text-4xl font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                    Fast
                                </div>
                                <div className="text-sm text-gray-500 mt-1">Withdrawals</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl md:text-4xl font-bold bg-linear-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                                    100%
                                </div>
                                <div className="text-sm text-gray-500 mt-1">Secure</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">
                            Built for <span className="text-blue-400">Success</span>
                        </h2>
                        <p className="text-gray-400 max-w-xl mx-auto">
                            Everything you need to grow your freelance career or find the perfect talent
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                icon: <Search className="w-6 h-6" />,
                                title: "Smart Matching",
                                desc: "AI-powered matching connects you with the right projects or talent instantly",
                                color: "blue"
                            },
                            {
                                icon: <Shield className="w-6 h-6" />,
                                title: "Escrow Protection",
                                desc: "Funds are held securely until work is approved - peace of mind for everyone",
                                color: "green"
                            },
                            {
                                icon: <MessageSquare className="w-6 h-6" />,
                                title: "Real-time Chat",
                                desc: "Built-in messaging keeps all project communication in one place",
                                color: "purple"
                            },
                            {
                                icon: <DollarSign className="w-6 h-6" />,
                                title: "Local Payments",
                                desc: "bKash, Nagad, Rocket, and bank transfers - get paid your way",
                                color: "cyan"
                            },
                            {
                                icon: <TrendingUp className="w-6 h-6" />,
                                title: "Track Progress",
                                desc: "Milestone-based projects with clear timelines and deliverables",
                                color: "orange"
                            },
                            {
                                icon: <Star className="w-6 h-6" />,
                                title: "Build Reputation",
                                desc: "Reviews and ratings help you stand out and win more work",
                                color: "yellow"
                            }
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="group relative bg-gray-900/50 border border-gray-800/50 rounded-2xl p-6 hover:border-gray-700/50 transition-all hover:-translate-y-1"
                            >
                                <div
                                    className={`w-12 h-12 rounded-xl bg-${feature.color}-600/20 flex items-center justify-center text-${feature.color}-400 mb-4`}
                                >
                                    {feature.icon}
                                </div>
                                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-24 px-6 bg-linear-to-b from-gray-900/50 to-transparent">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">
                            Three Steps to <span className="text-cyan-400">Success</span>
                        </h2>
                        <p className="text-gray-400 max-w-xl mx-auto">Get started in minutes, not days</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                step: "01",
                                icon: <UserCheck className="w-8 h-8" />,
                                title: "Create Profile",
                                desc: "Sign up free and build your professional profile with skills and portfolio"
                            },
                            {
                                step: "02",
                                icon: <Globe className="w-8 h-8" />,
                                title: "Connect",
                                desc: "Browse jobs or post projects. Our smart matching helps you find the perfect fit"
                            },
                            {
                                step: "03",
                                icon: <DollarSign className="w-8 h-8" />,
                                title: "Earn & Grow",
                                desc: "Complete projects, get paid securely, and build your reputation"
                            }
                        ].map((item, index) => (
                            <div key={index} className="relative">
                                <div className="text-8xl font-bold text-gray-900 absolute -top-4 -left-2 select-none">
                                    {item.step}
                                </div>
                                <div className="relative bg-gray-900/80 border border-gray-800/50 rounded-2xl p-8 h-full">
                                    <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-blue-600/20 to-cyan-600/20 flex items-center justify-center text-blue-400 mb-6">
                                        {item.icon}
                                    </div>
                                    <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                                    <p className="text-gray-400">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">
                            Popular <span className="text-blue-400">Categories</span>
                        </h2>
                        <p className="text-gray-400 max-w-xl mx-auto">Find work in your area of expertise</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { name: "Web Development", icon: "💻", desc: "Websites & Apps" },
                            { name: "Graphic Design", icon: "🎨", desc: "Logos & Branding" },
                            { name: "Content Writing", icon: "✍️", desc: "Blogs & Copywriting" },
                            { name: "Digital Marketing", icon: "📱", desc: "SEO & Social Media" },
                            { name: "Video Editing", icon: "🎬", desc: "YouTube & Reels" },
                            { name: "UI/UX Design", icon: "🎯", desc: "User Experience" },
                            { name: "Data Entry", icon: "📊", desc: "Admin & Research" },
                            { name: "Virtual Assistant", icon: "💼", desc: "Support & Tasks" }
                        ].map((category, index) => (
                            <button
                                key={index}
                                onClick={() => router.push(`/jobs?category=${encodeURIComponent(category.name)}`)}
                                className="group bg-gray-900/50 border border-gray-800/50 rounded-2xl p-6 hover:border-blue-600/50 hover:bg-gray-900/80 transition-all text-left"
                            >
                                <div className="text-3xl mb-3">{category.icon}</div>
                                <h3 className="font-semibold text-gray-200 group-hover:text-white transition-colors">
                                    {category.name}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">{category.desc}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* For Who Section */}
            <section className="py-24 px-6 bg-linear-to-b from-transparent via-gray-900/50 to-transparent">
                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Freelancers */}
                        <div className="relative group">
                            <div className="absolute inset-0 bg-linear-to-r from-blue-600/20 to-cyan-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative bg-gray-900/80 border border-gray-800/50 rounded-3xl p-8 h-full">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-14 h-14 bg-blue-600/20 rounded-2xl flex items-center justify-center">
                                        <Users className="w-7 h-7 text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold">For Freelancers</h3>
                                        <p className="text-gray-400 text-sm">Build your career</p>
                                    </div>
                                </div>
                                <ul className="space-y-4">
                                    {[
                                        "Find high-quality projects",
                                        "Set your own rates",
                                        "Get paid securely",
                                        "Build your portfolio",
                                        "Work from anywhere"
                                    ].map((item, index) => (
                                        <li key={index} className="flex items-center gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
                                            <span className="text-gray-300">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Button
                                    onClick={() => router.push("/register?role=freelancer")}
                                    className="mt-8 w-full"
                                    icon={ArrowRight}
                                >
                                    Start Freelancing
                                </Button>
                            </div>
                        </div>

                        {/* Clients */}
                        <div className="relative group">
                            <div className="absolute inset-0 bg-linear-to-r from-green-600/20 to-emerald-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative bg-gray-900/80 border border-gray-800/50 rounded-3xl p-8 h-full">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-14 h-14 bg-green-600/20 rounded-2xl flex items-center justify-center">
                                        <Briefcase className="w-7 h-7 text-green-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold">For Clients</h3>
                                        <p className="text-gray-400 text-sm">Find perfect talent</p>
                                    </div>
                                </div>
                                <ul className="space-y-4">
                                    {[
                                        "Access verified talent",
                                        "Post jobs for free",
                                        "Secure payments",
                                        "Track project progress",
                                        "Quality guaranteed"
                                    ].map((item, index) => (
                                        <li key={index} className="flex items-center gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                                            <span className="text-gray-300">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Button
                                    onClick={() => router.push("/register?role=client")}
                                    variant="secondary"
                                    className="mt-8 w-full"
                                    icon={ArrowRight}
                                >
                                    Post a Job
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24 px-6">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">
                            Got <span className="text-blue-400">Questions?</span>
                        </h2>
                        <p className="text-gray-400">We've got answers</p>
                    </div>

                    <div className="space-y-4">
                        {[
                            {
                                q: "Is fillxo free to join?",
                                a: "Yes! Signing up is completely free for both freelancers and clients. We only charge a small service fee when you successfully complete a project."
                            },
                            {
                                q: "What payment methods do you support?",
                                a: "We support bKash, Nagad, Rocket, and bank transfers. International payment options are coming soon."
                            },
                            {
                                q: "How does payment protection work?",
                                a: "When a client hires you, funds are held in escrow. You get paid automatically once the work is approved. This protects both parties."
                            },
                            {
                                q: "Can international clients hire Bangladeshi talent?",
                                a: "Absolutely! fillxo connects global clients with Bangladesh's best talent. We're building bridges across borders."
                            }
                        ].map((faq, index) => (
                            <details
                                key={index}
                                className="group bg-gray-900/50 border border-gray-800/50 rounded-2xl overflow-hidden"
                            >
                                <summary className="cursor-pointer p-6 font-semibold text-gray-200 flex items-center justify-between hover:bg-gray-900/80 transition-colors">
                                    {faq.q}
                                    <CircleChevronDown className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" />
                                </summary>
                                <div className="px-6 pb-6 text-gray-400 leading-relaxed">{faq.a}</div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="relative overflow-hidden bg-linear-to-r from-blue-600 to-cyan-600 rounded-3xl p-12 text-center">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yIDItNCAyLTRzLTItMi00LTJjLTIgMC00IDItNCAyczIgNCA0IDRjMiAwIDQtMiA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
                        <div className="relative">
                            <h2 className="text-3xl md:text-5xl font-bold mb-4">Ready to Get Started?</h2>
                            <p className="text-lg text-blue-100 mb-8 max-w-xl mx-auto">
                                Join thousands of freelancers and clients already on fillxo
                            </p>
                            {!authCheckDone ? (
                                <div className="h-12" />
                            ) : isLoggedIn ? (
                                <button
                                    onClick={() => router.push("/dashboard")}
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-all hover:scale-105 active:scale-95 shadow-lg"
                                >
                                    Go to Dashboard
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            ) : (
                                <button
                                    onClick={() => router.push("/register")}
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-all hover:scale-105 active:scale-95 shadow-lg"
                                >
                                    Create Free Account
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 border-t border-gray-800/50">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-2">
                            <Image src="/favicon.svg" alt="fillxo" width={24} height={24} className="w-6 h-6" />
                            <span className="font-semibold text-gray-400">fillxo</span>
                        </div>
                        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
                            <button
                                onClick={() => router.push("/terms")}
                                className="hover:text-white transition-colors"
                            >
                                Terms
                            </button>
                            <button
                                onClick={() => router.push("/privacy")}
                                className="hover:text-white transition-colors"
                            >
                                Privacy
                            </button>
                            <button
                                onClick={() => router.push("/support")}
                                className="hover:text-white transition-colors"
                            >
                                Support
                            </button>
                            <button
                                onClick={() => router.push("/about")}
                                className="hover:text-white transition-colors"
                            >
                                About
                            </button>
                        </div>
                        <div className="text-sm text-gray-500">© 2025 fillxo. Made in Bangladesh 🇧🇩</div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
