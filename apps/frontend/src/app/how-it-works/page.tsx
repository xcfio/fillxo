"use client"

import { useRouter } from "next/navigation"
import { PageContainer } from "@/components/ui/page-container"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    UserPlus,
    Search,
    Send,
    CheckCircle2,
    DollarSign,
    Star,
    Briefcase,
    FileText,
    MessageSquare,
    Award,
    ArrowRight,
    Users,
    Zap
} from "lucide-react"

export default function HowItWorksPage() {
    const router = useRouter()

    const freelancerSteps = [
        {
            icon: UserPlus,
            title: "Create Your Profile",
            description: "Sign up and build a compelling profile showcasing your skills, experience, and portfolio."
        },
        {
            icon: Search,
            title: "Browse Jobs",
            description:
                "Explore hundreds of job postings that match your skills and interests. Use filters to find the perfect opportunities."
        },
        {
            icon: Send,
            title: "Submit Proposals",
            description: "Send tailored proposals to clients explaining why you're the best fit for their project."
        },
        {
            icon: MessageSquare,
            title: "Communicate & Negotiate",
            description: "Discuss project details, timelines, and budget with clients to ensure mutual understanding."
        },
        {
            icon: CheckCircle2,
            title: "Get Hired",
            description: "Once accepted, start working on the project according to the agreed terms and milestones."
        },
        {
            icon: DollarSign,
            title: "Get Paid",
            description: "Complete the project, get it approved, and receive payment securely through our platform."
        },
        {
            icon: Star,
            title: "Build Your Reputation",
            description: "Receive reviews and ratings to build credibility and attract more high-quality clients."
        }
    ]

    const clientSteps = [
        {
            icon: UserPlus,
            title: "Create Your Account",
            description: "Sign up as a client and set up your company profile to start hiring talented freelancers."
        },
        {
            icon: FileText,
            title: "Post a Job",
            description:
                "Describe your project, set your budget, required skills, and deadline to attract the right freelancers."
        },
        {
            icon: Users,
            title: "Review Proposals",
            description:
                "Receive proposals from qualified freelancers. Review their profiles, portfolios, and past work."
        },
        {
            icon: MessageSquare,
            title: "Interview Candidates",
            description: "Communicate with shortlisted freelancers to discuss project details and assess their fit."
        },
        {
            icon: CheckCircle2,
            title: "Hire & Start",
            description: "Accept the best proposal and begin working with your chosen freelancer on the project."
        },
        {
            icon: Award,
            title: "Track Progress",
            description: "Monitor project milestones, provide feedback, and ensure timely delivery of work."
        },
        {
            icon: Star,
            title: "Review & Rate",
            description: "Once completed, review the work, provide feedback, and rate the freelancer's performance."
        }
    ]

    const benefits = [
        {
            icon: Zap,
            title: "Fast & Easy",
            description: "Get started in minutes with our streamlined onboarding process."
        },
        {
            icon: DollarSign,
            title: "Fair Pricing",
            description: "Competitive rates with transparent pricing. No hidden fees or surprises."
        },
        {
            icon: CheckCircle2,
            title: "Quality Assured",
            description: "Verified profiles, ratings, and reviews ensure you work with trusted professionals."
        },
        {
            icon: MessageSquare,
            title: "Seamless Communication",
            description: "Built-in messaging system to keep all project communication in one place."
        }
    ]

    return (
        <PageContainer>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">
                        How <span className="text-blue-400">fillxo</span> Works
                    </h1>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        Whether you're a freelancer looking for work or a client seeking talent, fillxo makes it simple
                        to connect and collaborate.
                    </p>
                </div>

                {/* For Freelancers Section */}
                <div className="mb-20">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-blue-600/20 border border-blue-700/50 rounded-xl flex items-center justify-center">
                                <Briefcase className="w-6 h-6 text-blue-400" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold">For Freelancers</h2>
                        </div>
                        <p className="text-gray-400 text-lg">
                            Find opportunities, showcase your skills, and grow your freelance career
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        {freelancerSteps.map((step, index) => {
                            const Icon = step.icon
                            return (
                                <Card key={index} hover className="relative">
                                    <div className="flex gap-4">
                                        <div className="shrink-0">
                                            <div className="w-12 h-12 bg-blue-600/20 border border-blue-700/50 rounded-xl flex items-center justify-center">
                                                <Icon className="w-6 h-6 text-blue-400" />
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-2">
                                                <h3 className="text-xl font-bold">{step.title}</h3>
                                                <span className="text-sm font-bold text-blue-400 bg-blue-600/20 px-3 py-1 rounded-full">
                                                    Step {index + 1}
                                                </span>
                                            </div>
                                            <p className="text-gray-400 leading-relaxed">{step.description}</p>
                                        </div>
                                    </div>
                                </Card>
                            )
                        })}
                    </div>

                    <div className="text-center">
                        <Button
                            onClick={() => router.push("/register?role=freelancer")}
                            icon={ArrowRight}
                            className="text-lg"
                        >
                            Start as a Freelancer
                        </Button>
                    </div>
                </div>

                {/* For Clients Section */}
                <div className="mb-20">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-emerald-600/20 border border-emerald-700/50 rounded-xl flex items-center justify-center">
                                <Users className="w-6 h-6 text-emerald-400" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold">For Clients</h2>
                        </div>
                        <p className="text-gray-400 text-lg">
                            Post projects, find talented freelancers, and get your work done efficiently
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        {clientSteps.map((step, index) => {
                            const Icon = step.icon
                            return (
                                <Card key={index} hover className="relative">
                                    <div className="flex gap-4">
                                        <div className="shrink-0">
                                            <div className="w-12 h-12 bg-emerald-600/20 border border-emerald-700/50 rounded-xl flex items-center justify-center">
                                                <Icon className="w-6 h-6 text-emerald-400" />
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-2">
                                                <h3 className="text-xl font-bold">{step.title}</h3>
                                                <span className="text-sm font-bold text-emerald-400 bg-emerald-600/20 px-3 py-1 rounded-full">
                                                    Step {index + 1}
                                                </span>
                                            </div>
                                            <p className="text-gray-400 leading-relaxed">{step.description}</p>
                                        </div>
                                    </div>
                                </Card>
                            )
                        })}
                    </div>

                    <div className="text-center">
                        <Button
                            onClick={() => router.push("/register?role=client")}
                            icon={ArrowRight}
                            className="text-lg"
                        >
                            Start Hiring
                        </Button>
                    </div>
                </div>

                {/* Why Choose fillxo */}
                <div className="mb-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Why Choose <span className="text-blue-400">fillxo</span>?
                        </h2>
                        <p className="text-gray-400 text-lg">
                            Built specifically for the Bangladeshi freelance market with local needs in mind
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {benefits.map((benefit, index) => {
                            const Icon = benefit.icon
                            return (
                                <Card key={index} hover className="text-center">
                                    <div className="w-16 h-16 bg-blue-600/20 border border-blue-700/50 rounded-xl flex items-center justify-center mx-auto mb-4">
                                        <Icon className="w-8 h-8 text-blue-400" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                                    <p className="text-gray-400 leading-relaxed">{benefit.description}</p>
                                </Card>
                            )
                        })}
                    </div>
                </div>

                {/* CTA Section */}
                <Card className="bg-blue-600/10 border-blue-600/30 text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
                    <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                        Join thousands of freelancers and clients already using fillxo to build successful partnerships
                        and complete amazing projects.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button onClick={() => router.push("/register")} icon={ArrowRight} className="text-lg">
                            Create Your Account
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => router.push("/jobs")}
                            icon={Briefcase}
                            className="text-lg"
                        >
                            Browse Jobs
                        </Button>
                    </div>
                </Card>
            </div>
        </PageContainer>
    )
}
