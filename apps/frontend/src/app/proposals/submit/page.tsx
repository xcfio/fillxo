"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import { PageContainer } from "@/components/ui/page-container"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ErrorAlert } from "@/components/ui/error-alert"
import { ArrowLeft, Send, DollarSign, Clock, FileText } from "lucide-react"
import { getUser } from "@/utils/auth"
import { formatBudget } from "@/utils/format"

interface Job {
    id: string
    title: string
    budget: number
}

function SubmitProposalContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const jobId = searchParams.get("jobId")

    const [user, setUser] = useState<any>(null)
    const [job, setJob] = useState<Job | null>(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string>("")

    const [formData, setFormData] = useState({
        bidAmount: "",
        deliveryDays: "",
        coverLetter: ""
    })

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await getUser()
                if (!user) return router.push("/login")

                if (user.role !== "freelancer") {
                    router.push("/jobs")
                    return
                }

                setUser(user)
            } catch (error) {
                router.push("/login")
            }
        }

        fetchUser()
    }, [router])

    useEffect(() => {
        const fetchJob = async () => {
            if (!jobId || !user) {
                if (!jobId) router.push("/jobs")
                return
            }

            setLoading(true)
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/job/${jobId}`, {
                    credentials: "include"
                })

                if (response.ok) {
                    const data = await response.json()
                    setJob(data)
                } else {
                    router.push("/jobs")
                }
            } catch (error) {
                console.error("Error fetching job:", error)
                router.push("/jobs")
            } finally {
                setLoading(false)
            }
        }

        fetchJob()
    }, [jobId, user, router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setSubmitting(true)

        try {
            // Validate form
            if (!formData.bidAmount || parseFloat(formData.bidAmount) <= 0) {
                setError("Please enter a valid bid amount")
                setSubmitting(false)
                return
            }

            if (!formData.deliveryDays || parseInt(formData.deliveryDays) < 1) {
                setError("Please enter a valid delivery time (minimum 1 day)")
                setSubmitting(false)
                return
            }

            if (parseInt(formData.deliveryDays) > 365) {
                setError("Delivery time cannot exceed 365 days")
                setSubmitting(false)
                return
            }

            if (!formData.coverLetter.trim() || formData.coverLetter.trim().length < 50) {
                setError("Cover letter must be at least 50 characters")
                setSubmitting(false)
                return
            }

            if (formData.coverLetter.trim().length > 2000) {
                setError("Cover letter cannot exceed 2000 characters")
                setSubmitting(false)
                return
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/proposal`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    jobId,
                    bidAmount: Math.round(parseFloat(formData.bidAmount) * 100),
                    deliveryDays: parseInt(formData.deliveryDays),
                    coverLetter: formData.coverLetter.trim()
                })
            })

            if (response.ok) {
                const proposal = await response.json()
                router.push(`/proposals/${proposal.id}`)
            } else {
                const errorData = await response.json()
                setError(errorData.message || "Failed to submit proposal")
            }
        } catch (error) {
            console.error("Error submitting proposal:", error)
            setError("An error occurred while submitting the proposal")
        } finally {
            setSubmitting(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    if (loading) {
        return <LoadingSpinner />
    }

    if (!user || !job) {
        return null
    }

    return (
        <PageContainer>
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <Button
                    variant="secondary"
                    onClick={() => router.push(`/jobs/${jobId}`)}
                    icon={ArrowLeft}
                    iconPosition="left"
                    className="mb-6"
                >
                    Back to Job
                </Button>

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-blue-600/20 border border-blue-700/50 rounded-xl flex items-center justify-center">
                            <Send className="w-8 h-8 text-blue-400" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold">
                                Submit <span className="text-blue-400">Proposal</span>
                            </h1>
                            <p className="text-gray-400">Apply to: {job.title}</p>
                        </div>
                    </div>
                </div>

                {/* Job Budget Info */}
                <Card className="mb-6 bg-blue-600/10 border-blue-600/30">
                    <div className="flex items-center gap-4">
                        <DollarSign className="w-8 h-8 text-blue-400" />
                        <div>
                            <p className="text-gray-400 text-sm">Client&apos;s Budget</p>
                            <p className="text-2xl font-bold text-blue-400">{formatBudget(job.budget)}</p>
                        </div>
                    </div>
                </Card>

                {/* Form */}
                <Card>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && <ErrorAlert message={error} />}

                        {/* Bid Amount */}
                        <div>
                            <label
                                htmlFor="bidAmount"
                                className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"
                            >
                                <DollarSign className="w-4 h-4 text-blue-400" />
                                Your Bid Amount (USD)
                            </label>
                            <input
                                id="bidAmount"
                                name="bidAmount"
                                type="number"
                                min="1"
                                step="0.01"
                                value={formData.bidAmount}
                                onChange={handleChange}
                                placeholder="Enter your bid amount"
                                className="w-full px-4 py-3 bg-gray-900/50 border border-blue-900/30 rounded-lg focus:outline-none focus:border-blue-600 transition-colors text-white placeholder-gray-500"
                                required
                            />
                            <p className="mt-2 text-sm text-gray-500">
                                How much do you want to charge for this project?
                            </p>
                        </div>

                        {/* Delivery Days */}
                        <div>
                            <label
                                htmlFor="deliveryDays"
                                className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"
                            >
                                <Clock className="w-4 h-4 text-blue-400" />
                                Delivery Time (Days)
                            </label>
                            <input
                                id="deliveryDays"
                                name="deliveryDays"
                                type="number"
                                min="1"
                                max="365"
                                value={formData.deliveryDays}
                                onChange={handleChange}
                                placeholder="Enter delivery time in days"
                                className="w-full px-4 py-3 bg-gray-900/50 border border-blue-900/30 rounded-lg focus:outline-none focus:border-blue-600 transition-colors text-white placeholder-gray-500"
                                required
                            />
                            <p className="mt-2 text-sm text-gray-500">
                                How many days will it take to complete this project?
                            </p>
                        </div>

                        {/* Cover Letter */}
                        <div>
                            <label
                                htmlFor="coverLetter"
                                className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"
                            >
                                <FileText className="w-4 h-4 text-blue-400" />
                                Cover Letter
                            </label>
                            <textarea
                                id="coverLetter"
                                name="coverLetter"
                                value={formData.coverLetter}
                                onChange={handleChange}
                                placeholder="Introduce yourself and explain why you're the best fit for this project..."
                                rows={8}
                                className="w-full px-4 py-3 bg-gray-900/50 border border-blue-900/30 rounded-lg focus:outline-none focus:border-blue-600 transition-colors text-white placeholder-gray-500 resize-none"
                                required
                            />
                            <div className="flex justify-between mt-2">
                                <p className="text-sm text-gray-500">Minimum 50 characters, maximum 2000 characters</p>
                                <p
                                    className={`text-sm ${
                                        formData.coverLetter.length > 2000 ? "text-red-400" : "text-gray-500"
                                    }`}
                                >
                                    {formData.coverLetter.length}/2000
                                </p>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex gap-4 pt-4">
                            <Button type="submit" icon={Send} isLoading={submitting} disabled={submitting}>
                                Submit Proposal
                            </Button>
                            <Button type="button" variant="secondary" onClick={() => router.push(`/jobs/${jobId}`)}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </PageContainer>
    )
}

export default function SubmitProposalPage() {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <SubmitProposalContent />
        </Suspense>
    )
}
