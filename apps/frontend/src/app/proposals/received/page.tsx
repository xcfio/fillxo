"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import { PageContainer } from "@/components/ui/page-container"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import {
    FileText,
    Calendar,
    Clock,
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Check,
    X
} from "lucide-react"
import { getUser } from "@/utils/auth"
import { formatDate } from "@/utils/time"
import { formatBudget } from "@/utils/format"
import { Proposal, ProposalStatus } from "@/types/proposal"

function ReceivedProposalsContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const jobIdParam = searchParams.get("jobId")

    const [proposals, setProposals] = useState<Proposal[]>([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [statusFilter, setStatusFilter] = useState<ProposalStatus | "all">("all")
    const [user, setUser] = useState<any>(null)
    const [actionLoading, setActionLoading] = useState<string | null>(null)
    const itemsPerPage = 20

    useEffect(() => {
        const fetchUser = async () => {
            const user = await getUser()
            if (!user) return router.push("/login")
            if (user.role !== "client" && user.role !== "both") {
                return router.push("/proposals")
            }
            setUser(user)
        }
        fetchUser()
    }, [router])

    useEffect(() => {
        const fetchProposals = async () => {
            if (!user) return
            setLoading(true)
            try {
                const params = new URLSearchParams({
                    page: currentPage.toString(),
                    limit: itemsPerPage.toString()
                })
                if (statusFilter !== "all") {
                    params.append("status", statusFilter)
                }
                if (jobIdParam) {
                    params.append("jobId", jobIdParam)
                }

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/proposal/received?${params}`, {
                    credentials: "include"
                })

                if (response.ok) {
                    setProposals(await response.json())
                } else {
                    console.error("Failed to fetch proposals")
                }
            } catch (error) {
                console.error("Error fetching proposals:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchProposals()
    }, [currentPage, statusFilter, user, jobIdParam])

    const handleAccept = async (proposalId: string, e: React.MouseEvent) => {
        e.stopPropagation()
        if (!confirm("Are you sure you want to accept this proposal?")) return

        setActionLoading(proposalId)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/proposal/${proposalId}/accept`, {
                method: "PUT",
                credentials: "include"
            })

            if (response.ok) {
                setProposals((prev) =>
                    prev.map((p) => (p.id === proposalId ? { ...p, status: "accepted" as ProposalStatus } : p))
                )
            } else {
                alert("Failed to accept proposal")
            }
        } catch (error) {
            console.error("Error accepting proposal:", error)
            alert("An error occurred while accepting the proposal")
        } finally {
            setActionLoading(null)
        }
    }

    const handleReject = async (proposalId: string, e: React.MouseEvent) => {
        e.stopPropagation()
        if (!confirm("Are you sure you want to reject this proposal?")) return

        setActionLoading(proposalId)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/proposal/${proposalId}/reject`, {
                method: "PUT",
                credentials: "include"
            })

            if (response.ok) {
                setProposals((prev) =>
                    prev.map((p) => (p.id === proposalId ? { ...p, status: "rejected" as ProposalStatus } : p))
                )
            } else {
                alert("Failed to reject proposal")
            }
        } catch (error) {
            console.error("Error rejecting proposal:", error)
            alert("An error occurred while rejecting the proposal")
        } finally {
            setActionLoading(null)
        }
    }

    const getStatusBadge = (status: ProposalStatus) => {
        switch (status) {
            case "accepted":
                return (
                    <Badge variant="success">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1 inline" />
                        Accepted
                    </Badge>
                )
            case "rejected":
                return (
                    <Badge variant="danger">
                        <XCircle className="w-3.5 h-3.5 mr-1 inline" />
                        Rejected
                    </Badge>
                )
            default:
                return (
                    <Badge variant="warning">
                        <AlertCircle className="w-3.5 h-3.5 mr-1 inline" />
                        Pending
                    </Badge>
                )
        }
    }

    if (loading && !user) {
        return <LoadingSpinner />
    }

    return (
        <PageContainer>
            <div className="max-w-7xl mx-auto">
                {/* Back Button */}
                <Button
                    variant="secondary"
                    onClick={() => router.push("/proposals")}
                    icon={ArrowLeft}
                    iconPosition="left"
                    className="mb-6"
                >
                    Back to Proposals
                </Button>

                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-4xl font-bold mb-2">
                                Received <span className="text-blue-400">Proposals</span>
                            </h1>
                            <p className="text-gray-400">
                                {jobIdParam
                                    ? "Proposals received for this job posting"
                                    : "Review proposals from freelancers for your job postings"}
                            </p>
                        </div>
                    </div>

                    {/* Filter */}
                    <div className="flex gap-4">
                        <Select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value as ProposalStatus | "all")
                                setCurrentPage(1)
                            }}
                            options={[
                                { value: "all", label: "All Status" },
                                { value: "pending", label: "Pending" },
                                { value: "accepted", label: "Accepted" },
                                { value: "rejected", label: "Rejected" }
                            ]}
                        />
                    </div>
                </div>

                {/* Loading State */}
                {loading ? (
                    <LoadingSpinner />
                ) : proposals.length === 0 ? (
                    <Card className="text-center py-12">
                        <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No proposals found</h3>
                        <p className="text-gray-400 mb-6">
                            {statusFilter !== "all"
                                ? "Try changing your filter settings"
                                : "You haven't received any proposals yet"}
                        </p>
                        <Button onClick={() => router.push("/jobs/post")}>Post a Job</Button>
                    </Card>
                ) : (
                    <>
                        {/* Proposals List */}
                        <div className="grid gap-6 mb-8">
                            {proposals.map((proposal) => (
                                <Card
                                    key={proposal.id}
                                    hover
                                    className="cursor-pointer transition-all"
                                    onClick={() => router.push(`/proposals/${proposal.id}`)}
                                >
                                    <div className="flex flex-col md:flex-row justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-3">
                                                <h3 className="text-xl font-bold hover:text-blue-400 transition-colors">
                                                    Proposal from Freelancer
                                                </h3>
                                                {getStatusBadge(proposal.status)}
                                            </div>

                                            <p className="text-gray-400 mb-4 line-clamp-2 break-all">
                                                {proposal.coverLetter}
                                            </p>

                                            <div className="flex flex-wrap gap-6 text-sm text-gray-400">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-blue-400">
                                                        {formatBudget(proposal.bidAmount)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4" />
                                                    <span>
                                                        {proposal.deliveryDays} day
                                                        {proposal.deliveryDays !== 1 ? "s" : ""} delivery
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>Received {formatDate(proposal.createdAt)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        {proposal.status === "pending" && (
                                            <div className="flex gap-2 md:flex-col">
                                                <Button
                                                    variant="primary"
                                                    icon={Check}
                                                    onClick={(e) => handleAccept(proposal.id, e)}
                                                    disabled={actionLoading === proposal.id}
                                                    className="!px-4 !py-2"
                                                >
                                                    Accept
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    icon={X}
                                                    onClick={(e) => handleReject(proposal.id, e)}
                                                    disabled={actionLoading === proposal.id}
                                                    className="!px-4 !py-2"
                                                >
                                                    Reject
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-center gap-4 items-center">
                            <Button
                                variant="secondary"
                                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                icon={ChevronLeft}
                                iconPosition="left"
                            >
                                Previous
                            </Button>
                            <span className="text-gray-400">Page {currentPage}</span>
                            <Button
                                variant="secondary"
                                onClick={() => setCurrentPage((prev) => prev + 1)}
                                disabled={proposals.length < itemsPerPage}
                                icon={ChevronRight}
                            >
                                Next
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </PageContainer>
    )
}

export default function ReceivedProposalsPage() {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <ReceivedProposalsContent />
        </Suspense>
    )
}
