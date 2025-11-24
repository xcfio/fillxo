"use client"

import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { PageContainer } from "@/components/ui/page-container"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Briefcase,
    DollarSign,
    Calendar,
    Users,
    ArrowLeft,
    Send,
    Edit,
    Trash2,
    Clock,
    CheckCircle2
} from "lucide-react"
import { getUser } from "@/utils/auth"
import { formatDateTime, isWithinHours } from "@/utils/time"

interface Job {
    id: string
    clientId: string
    title: string
    description: string
    category: string
    skills: string[]
    budget: string
    isOpen: boolean
    closedAt: string
    proposalCount: number
    createdAt: string
}

export default function JobDetailPage() {
    const router = useRouter()
    const params = useParams()
    const jobId = params.id as string

    const [job, setJob] = useState<Job | null>(null)
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<any>(null)
    const [isOwner, setIsOwner] = useState(false)

    useEffect(() => {
        const fetchUser = async () => setUser(await getUser())
        fetchUser()
    }, [])

    useEffect(() => {
        const fetchJob = async () => {
            setLoading(true)
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/job/${jobId}`, {
                    credentials: "include"
                })

                if (response.ok) {
                    const jobData = await response.json()
                    setJob(jobData)
                    setIsOwner(user?.id === jobData.clientId)
                } else if (response.status === 404) {
                    router.push("/jobs")
                } else {
                    console.error("Failed to fetch job")
                }
            } catch (error) {
                console.error("Error fetching job:", error)
            } finally {
                setLoading(false)
            }
        }

        if (jobId) {
            fetchJob()
        }
    }, [jobId, user, router])

    const formatBudget = (budget: string) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(parseFloat(budget))
    }

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this job posting?")) return

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/job/${jobId}`, {
                method: "DELETE",
                credentials: "include"
            })

            if (response.ok) {
                router.push("/jobs")
            } else {
                alert("Failed to delete job")
            }
        } catch (error) {
            console.error("Error deleting job:", error)
            alert("An error occurred while deleting the job")
        }
    }

    const handleSubmitProposal = () => {
        router.push(`/proposals/submit?jobId=${jobId}`)
    }

    if (loading) {
        return <LoadingSpinner />
    }

    if (!job) {
        return (
            <PageContainer>
                <div className="max-w-4xl mx-auto text-center py-20">
                    <h2 className="text-2xl font-bold mb-4">Job not found</h2>
                    <Button onClick={() => router.push("/jobs")} icon={ArrowLeft} iconPosition="left">
                        Back to Jobs
                    </Button>
                </div>
            </PageContainer>
        )
    }

    const isClosingSoon = isWithinHours(job.closedAt, 24)
    const isClosed = !job.isOpen || new Date(job.closedAt) < new Date()

    return (
        <PageContainer>
            <div className="max-w-5xl mx-auto">
                {/* Back Button */}
                <Button
                    variant="secondary"
                    onClick={() => router.push("/jobs")}
                    icon={ArrowLeft}
                    iconPosition="left"
                    className="mb-6"
                >
                    Back to Jobs
                </Button>

                {/* Job Header */}
                <Card className="mb-6">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex-1">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-16 h-16 bg-blue-600/20 border border-blue-700/50 rounded-xl flex items-center justify-center">
                                    <Briefcase className="w-8 h-8 text-blue-400" />
                                </div>
                                <div className="flex-1">
                                    <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
                                    <div className="flex flex-wrap gap-2">
                                        {job.isOpen && !isClosed ? (
                                            <Badge variant="success">
                                                <CheckCircle2 className="w-3.5 h-3.5 mr-1 inline" />
                                                Open
                                            </Badge>
                                        ) : (
                                            <Badge variant="danger">Closed</Badge>
                                        )}
                                        {isClosingSoon && !isClosed && (
                                            <Badge variant="warning">
                                                <Clock className="w-3.5 h-3.5 mr-1 inline" />
                                                Closing Soon
                                            </Badge>
                                        )}
                                        <Badge variant="info">{job.category}</Badge>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {isOwner ? (
                            <div className="flex gap-3">
                                <Button
                                    variant="secondary"
                                    icon={Edit}
                                    onClick={() => router.push(`/jobs/${jobId}/edit`)}
                                >
                                    Edit
                                </Button>
                                <Button variant="danger" icon={Trash2} onClick={handleDelete}>
                                    Delete
                                </Button>
                            </div>
                        ) : user && (user.role === "freelancer" || user.role === "both") && job.isOpen && !isClosed ? (
                            <Button icon={Send} onClick={handleSubmitProposal}>
                                Submit Proposal
                            </Button>
                        ) : null}
                    </div>

                    {/* Job Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-gray-900/50 border border-blue-900/20 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                                <DollarSign className="w-4 h-4" />
                                <span>Budget</span>
                            </div>
                            <p className="text-2xl font-bold text-blue-400">{formatBudget(job.budget)}</p>
                        </div>
                        <div className="bg-gray-900/50 border border-blue-900/20 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                                <Users className="w-4 h-4" />
                                <span>Proposals</span>
                            </div>
                            <p className="text-2xl font-bold">{job.proposalCount}</p>
                        </div>
                        <div className="bg-gray-900/50 border border-blue-900/20 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                                <Calendar className="w-4 h-4" />
                                <span>Posted</span>
                            </div>
                            <p className="text-sm font-medium">{formatDateTime(job.createdAt)}</p>
                        </div>
                        <div className="bg-gray-900/50 border border-blue-900/20 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                                <Calendar className="w-4 h-4" />
                                <span>Closes</span>
                            </div>
                            <p className="text-sm font-medium">{formatDateTime(job.closedAt)}</p>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <h2 className="text-xl font-bold mb-3">Description</h2>
                        <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{job.description}</p>
                    </div>

                    {/* Skills Required */}
                    <div>
                        <h2 className="text-xl font-bold mb-3">Skills Required</h2>
                        <div className="flex flex-wrap gap-2">
                            {job.skills.map((skill, index) => (
                                <Badge key={index} variant="primary">
                                    {skill}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </Card>

                {/* Proposals Section (for job owner) */}
                {isOwner && (
                    <Card>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Proposals ({job.proposalCount})</h2>
                            {job.proposalCount > 0 && (
                                <Button variant="secondary" onClick={() => router.push(`/jobs/${jobId}/proposals`)}>
                                    View All Proposals
                                </Button>
                            )}
                        </div>
                        {job.proposalCount === 0 ? (
                            <div className="text-center py-8 text-gray-400">
                                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p>No proposals yet. Share your job posting to get started!</p>
                            </div>
                        ) : (
                            <p className="text-gray-400">
                                You have received {job.proposalCount} proposal{job.proposalCount !== 1 ? "s" : ""} for
                                this job.
                            </p>
                        )}
                    </Card>
                )}

                {/* Call to Action for Non-logged in Users */}
                {!user && (
                    <Card className="bg-blue-600/10 border-blue-600/30">
                        <div className="text-center">
                            <h3 className="text-xl font-bold mb-3">Interested in this job?</h3>
                            <p className="text-gray-300 mb-6">
                                Sign up or log in to submit a proposal and start working on this project.
                            </p>
                            <div className="flex gap-4 justify-center">
                                <Button onClick={() => router.push("/register")}>Create Account</Button>
                                <Button variant="secondary" onClick={() => router.push("/login")}>
                                    Log In
                                </Button>
                            </div>
                        </div>
                    </Card>
                )}
            </div>
        </PageContainer>
    )
}
