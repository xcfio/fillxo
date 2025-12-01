"use client"

import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { PageContainer } from "@/components/ui/page-container"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    FileText,
    DollarSign,
    Calendar,
    Clock,
    ArrowLeft,
    Edit,
    Trash2,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Check,
    X,
    Briefcase,
    CreditCard,
    Plus
} from "lucide-react"
import { getUser } from "@/utils/auth"
import { formatDateTime } from "@/utils/time"
import { formatBudget } from "@/utils/format"
import { Proposal, ProposalStatus } from "@/types/proposal"
import { Contract } from "@/types/contract"
import { Payment } from "@/types/payment"

export default function ProposalDetailPage() {
    const router = useRouter()
    const params = useParams()
    const proposalId = params.id as string

    const [proposal, setProposal] = useState<Proposal | null>(null)
    const [contract, setContract] = useState<Contract | null>(null)
    const [payment, setPayment] = useState<Payment | null>(null)
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<any>(null)
    const [actionLoading, setActionLoading] = useState(false)
    const [isOwner, setIsOwner] = useState(false)
    const [isJobOwner, setIsJobOwner] = useState(false)

    useEffect(() => {
        const fetchUser = async () => {
            const user = await getUser()
            if (!user) return router.push("/login")
            setUser(user)
        }
        fetchUser()
    }, [router])

    useEffect(() => {
        const fetchProposal = async () => {
            if (!user) return
            setLoading(true)
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/proposal/${proposalId}`, {
                    credentials: "include"
                })

                if (response.ok) {
                    const data = await response.json()
                    setProposal(data)
                    setIsOwner(data.freelancerId === user.id)
                    // Note: isJobOwner would need to be determined from the job data
                    // For now, we'll allow clients to see accept/reject buttons
                    setIsJobOwner(user.role === "client" || user.role === "both")
                    // Fetch contract if proposal is accepted
                    if (data.status === "accepted") {
                        fetchContract(data.id)
                    }
                } else if (response.status === 404) {
                    router.push("/proposals")
                } else if (response.status === 403) {
                    router.push("/proposals")
                } else {
                    console.error("Failed to fetch proposal")
                }
            } catch (error) {
                console.error("Error fetching proposal:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchProposal()
    }, [proposalId, user, router])

    const fetchContract = async (proposalId: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/contracts?status=payment-required`, {
                credentials: "include"
            })
            if (response.ok) {
                const contracts: Contract[] = await response.json()
                const foundContract = contracts.find((c) => c.proposalId === proposalId)
                if (foundContract) {
                    setContract(foundContract)
                    // Fetch payment for the contract
                    fetchPayment(foundContract.id)
                } else {
                    // Also check for active/completed contracts
                    const activeResponse = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/contracts`, {
                        credentials: "include"
                    })
                    if (activeResponse.ok) {
                        const allContracts: Contract[] = await activeResponse.json()
                        const existingContract = allContracts.find((c) => c.proposalId === proposalId)
                        if (existingContract) {
                            setContract(existingContract)
                            fetchPayment(existingContract.id)
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Error fetching contract:", error)
        }
    }

    const fetchPayment = async (contractId: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/payments/contract/${contractId}`, {
                credentials: "include"
            })
            if (response.ok) {
                const data = await response.json()
                setPayment(data)
            }
        } catch (error) {
            console.error("Error fetching payment:", error)
        }
    }

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this proposal?")) return

        setActionLoading(true)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/proposal/${proposalId}`, {
                method: "DELETE",
                credentials: "include"
            })

            if (response.ok) {
                router.push("/proposals/sent")
            } else {
                alert("Failed to delete proposal")
            }
        } catch (error) {
            console.error("Error deleting proposal:", error)
            alert("An error occurred while deleting the proposal")
        } finally {
            setActionLoading(false)
        }
    }

    const handleAccept = async () => {
        if (!confirm("Are you sure you want to accept this proposal?")) return

        setActionLoading(true)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/proposal/${proposalId}/accept`, {
                method: "PUT",
                credentials: "include"
            })

            if (response.ok) {
                setProposal((prev) => (prev ? { ...prev, status: "accepted" } : null))
                // Create a contract for the accepted proposal
                const contractResponse = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/contracts/`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ proposalId })
                })

                if (contractResponse.ok) {
                    const contractData = await contractResponse.json()
                    setContract(contractData)
                } else {
                    console.error("Failed to create contract")
                }
            } else {
                alert("Failed to accept proposal")
            }
        } catch (error) {
            console.error("Error accepting proposal:", error)
            alert("An error occurred while accepting the proposal")
        } finally {
            setActionLoading(false)
        }
    }

    const handleReject = async () => {
        if (!confirm("Are you sure you want to reject this proposal?")) return

        setActionLoading(true)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/proposal/${proposalId}/reject`, {
                method: "PUT",
                credentials: "include"
            })

            if (response.ok) {
                setProposal((prev) => (prev ? { ...prev, status: "rejected" } : null))
            } else {
                alert("Failed to reject proposal")
            }
        } catch (error) {
            console.error("Error rejecting proposal:", error)
            alert("An error occurred while rejecting the proposal")
        } finally {
            setActionLoading(false)
        }
    }

    const handleCreateContract = async () => {
        if (!confirm("Are you sure you want to create a contract for this proposal?")) return

        setActionLoading(true)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/contracts/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ proposalId })
            })

            if (response.ok) {
                const contractData = await response.json()
                setContract(contractData)
            } else {
                const data = await response.json()
                alert(data.message || "Failed to create contract")
            }
        } catch (error) {
            console.error("Error creating contract:", error)
            alert("An error occurred while creating the contract")
        } finally {
            setActionLoading(false)
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

    if (loading) {
        return <LoadingSpinner />
    }

    if (!proposal) {
        return (
            <PageContainer>
                <div className="max-w-4xl mx-auto text-center py-20">
                    <h2 className="text-2xl font-bold mb-4">Proposal not found</h2>
                    <Button onClick={() => router.push("/proposals")} icon={ArrowLeft} iconPosition="left">
                        Back to Proposals
                    </Button>
                </div>
            </PageContainer>
        )
    }

    return (
        <PageContainer>
            <div className="max-w-5xl mx-auto">
                {/* Back Button */}
                <Button
                    variant="secondary"
                    onClick={() => router.push(isOwner ? "/proposals/sent" : "/proposals/received")}
                    icon={ArrowLeft}
                    iconPosition="left"
                    className="mb-6"
                >
                    Back to {isOwner ? "Sent" : "Received"} Proposals
                </Button>

                {/* Proposal Header */}
                <Card className="mb-6">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex-1">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-16 h-16 bg-blue-600/20 border border-blue-700/50 rounded-xl flex items-center justify-center">
                                    <FileText className="w-8 h-8 text-blue-400" />
                                </div>
                                <div className="flex-1">
                                    <h1 className="text-3xl font-bold mb-2">Proposal Details</h1>
                                    <div className="flex flex-wrap gap-2">{getStatusBadge(proposal.status)}</div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {isOwner && proposal.status === "pending" ? (
                            <div className="flex gap-3">
                                <Button
                                    variant="secondary"
                                    icon={Edit}
                                    onClick={() => router.push(`/proposals/${proposalId}/edit`)}
                                >
                                    Edit
                                </Button>
                                <Button variant="danger" icon={Trash2} onClick={handleDelete} disabled={actionLoading}>
                                    Delete
                                </Button>
                            </div>
                        ) : isJobOwner && !isOwner && proposal.status === "pending" ? (
                            <div className="flex gap-3">
                                <Button variant="primary" icon={Check} onClick={handleAccept} disabled={actionLoading}>
                                    Accept
                                </Button>
                                <Button variant="danger" icon={X} onClick={handleReject} disabled={actionLoading}>
                                    Reject
                                </Button>
                            </div>
                        ) : null}
                    </div>

                    {/* Proposal Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-gray-900/50 border border-blue-900/20 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                                <DollarSign className="w-4 h-4" />
                                <span>Bid Amount</span>
                            </div>
                            <p className="text-2xl font-bold text-blue-400">{formatBudget(proposal.bidAmount)}</p>
                        </div>
                        <div className="bg-gray-900/50 border border-blue-900/20 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                                <Clock className="w-4 h-4" />
                                <span>Delivery Time</span>
                            </div>
                            <p className="text-2xl font-bold">
                                {proposal.deliveryDays} day{proposal.deliveryDays !== 1 ? "s" : ""}
                            </p>
                        </div>
                        <div className="bg-gray-900/50 border border-blue-900/20 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                                <Calendar className="w-4 h-4" />
                                <span>Submitted</span>
                            </div>
                            <p className="text-sm font-medium">{formatDateTime(proposal.createdAt)}</p>
                        </div>
                    </div>

                    {/* Cover Letter */}
                    <div className="mb-6">
                        <h2 className="text-xl font-bold mb-3">Cover Letter</h2>
                        <div className="bg-gray-900/50 border border-blue-900/20 rounded-lg p-6 overflow-hidden">
                            <p className="text-gray-300 whitespace-pre-wrap leading-relaxed break-words">
                                {proposal.coverLetter}
                            </p>
                        </div>
                    </div>

                    {/* View Job Button */}
                    <Button variant="secondary" icon={Briefcase} onClick={() => router.push(`/jobs/${proposal.jobId}`)}>
                        View Job Posting
                    </Button>
                </Card>

                {/* Status Info */}
                {proposal.status === "accepted" && (
                    <Card className="bg-emerald-600/10 border-emerald-600/30">
                        <div className="flex items-start gap-4">
                            <CheckCircle2 className="w-8 h-8 text-emerald-400 flex-shrink-0" />
                            <div className="flex-1">
                                <h3 className="text-lg font-bold mb-2 text-emerald-400">Proposal Accepted!</h3>
                                {payment ? (
                                    <div>
                                        <p className="text-gray-300 mb-3">
                                            {isOwner
                                                ? "The client has submitted payment for this project."
                                                : "You have submitted payment for this project."}
                                        </p>
                                        <div className="bg-gray-900/50 border border-emerald-900/20 rounded-lg p-4">
                                            <div className="flex items-center justify-between flex-wrap gap-2">
                                                <div>
                                                    <p className="text-sm text-gray-400">Payment Status</p>
                                                    <p className="font-semibold capitalize">
                                                        {payment.status === "pending" && (
                                                            <span className="text-yellow-400">
                                                                ⏳ Pending Verification
                                                            </span>
                                                        )}
                                                        {payment.status === "verified" && (
                                                            <span className="text-emerald-400">✓ Verified</span>
                                                        )}
                                                        {payment.status === "rejected" && (
                                                            <span className="text-red-400">✗ Rejected</span>
                                                        )}
                                                        {payment.status === "refunded" && (
                                                            <span className="text-blue-400">↩ Refunded</span>
                                                        )}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-400">Transaction ID</p>
                                                    <p className="font-mono text-sm">{payment.transactionId}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-400">Method</p>
                                                    <p className="font-semibold capitalize">{payment.paymentMethod}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-gray-300 mb-4">
                                            {isOwner
                                                ? "Congratulations! Your proposal has been accepted. The client will contact you soon to discuss the project details."
                                                : contract
                                                  ? "You have accepted this proposal. Complete the payment to start working with the freelancer."
                                                  : "You have accepted this proposal. Create a contract to proceed with payment."}
                                        </p>
                                        {isJobOwner && !isOwner && (
                                            <div className="flex gap-3">
                                                {contract ? (
                                                    <Button
                                                        icon={CreditCard}
                                                        onClick={() => router.push(`/contracts/${contract.id}/pay`)}
                                                    >
                                                        Make Payment
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        icon={Plus}
                                                        onClick={handleCreateContract}
                                                        disabled={actionLoading}
                                                    >
                                                        {actionLoading ? "Creating..." : "Create Contract"}
                                                    </Button>
                                                )}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </Card>
                )}

                {proposal.status === "rejected" && (
                    <Card className="bg-red-600/10 border-red-600/30">
                        <div className="flex items-start gap-4">
                            <XCircle className="w-8 h-8 text-red-400 flex-shrink-0" />
                            <div>
                                <h3 className="text-lg font-bold mb-2 text-red-400">Proposal Rejected</h3>
                                <p className="text-gray-300">
                                    {isOwner
                                        ? "Unfortunately, your proposal was not accepted for this project. Don't be discouraged - keep applying to other jobs!"
                                        : "You have rejected this proposal."}
                                </p>
                            </div>
                        </div>
                    </Card>
                )}
            </div>
        </PageContainer>
    )
}
