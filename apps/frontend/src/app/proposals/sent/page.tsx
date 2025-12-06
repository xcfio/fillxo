"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { PageContainer } from "@/components/ui/page-container"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import {
    FileText,
    DollarSign,
    Calendar,
    Clock,
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    XCircle,
    AlertCircle
} from "lucide-react"
import { getUser } from "@/utils/auth"
import { formatDate } from "@/utils/time"
import { formatBudget } from "@/utils/format"
import { Proposal, ProposalStatus } from "@/types/proposal"

export default function SentProposalsPage() {
    const router = useRouter()
    const [proposals, setProposals] = useState<Proposal[]>([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [statusFilter, setStatusFilter] = useState<ProposalStatus | "all">("all")
    const [user, setUser] = useState<any>(null)
    const itemsPerPage = 20

    useEffect(() => {
        const fetchUser = async () => {
            const user = await getUser()
            if (!user) return router.push("/login")
            if (user.role !== "freelancer") {
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

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/proposal/sent?${params}`, {
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
    }, [currentPage, statusFilter, user])

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
                                Sent <span className="text-blue-400">Proposals</span>
                            </h1>
                            <p className="text-gray-400">Track the proposals you&apos;ve submitted to job postings</p>
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
                                : "You haven't submitted any proposals yet"}
                        </p>
                        <Button onClick={() => router.push("/jobs")}>Browse Jobs</Button>
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
                                                    Proposal for Job
                                                </h3>
                                                {getStatusBadge(proposal.status)}
                                            </div>

                                            <p className="text-gray-400 mb-4 line-clamp-2 break-all">
                                                {proposal.coverLetter}
                                            </p>

                                            <div className="flex flex-wrap gap-6 text-sm text-gray-400">
                                                <div className="flex items-center gap-2">
                                                    <DollarSign className="w-4 h-4" />
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
                                                    <span>Submitted {formatDate(proposal.createdAt)}</span>
                                                </div>
                                            </div>
                                        </div>
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
