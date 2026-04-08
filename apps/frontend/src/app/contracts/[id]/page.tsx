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
    ArrowLeft,
    CheckCircle2,
    XCircle,
    AlertCircle,
    CreditCard,
    Clock,
    Briefcase,
    Copy,
    Check,
    Wallet,
    Send
} from "lucide-react"
import { getUser } from "@/utils/auth"
import { formatDateTime } from "@/utils/time"
import { formatBudget } from "@/utils/format"
import { Contract, ContractStatus } from "@/types/contract"
import { Payment } from "@/types/payment"

export default function ContractDetailPage() {
    const router = useRouter()
    const params = useParams()
    const contractId = params.id as string

    const [contract, setContract] = useState<Contract | null>(null)
    const [payments, setPayments] = useState<Payment[]>([])
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<any>(null)
    const [actionLoading, setActionLoading] = useState(false)
    const [isClient, setIsClient] = useState(false)
    const [isFreelancer, setIsFreelancer] = useState(false)
    const [copiedId, setCopiedId] = useState<string | null>(null)
    const [receiverNumber, setReceiverNumber] = useState("")
    const [payoutLoading, setPayoutLoading] = useState(false)
    const [payoutSubmitted, setPayoutSubmitted] = useState(false)
    const [payoutError, setPayoutError] = useState<string | null>(null)

    const copyToClipboard = async (text: string) => {
        await navigator.clipboard.writeText(text)
        setCopiedId(text)
        setTimeout(() => setCopiedId(null), 2000)
    }

    useEffect(() => {
        const fetchUser = async () => {
            const user = await getUser()
            if (!user) return router.push("/login")
            setUser(user)
        }
        fetchUser()
    }, [router])

    useEffect(() => {
        const fetchContract = async () => {
            if (!user) return
            setLoading(true)
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/contracts/${contractId}`, {
                    credentials: "include"
                })

                if (response.ok) {
                    const data = await response.json()
                    setContract(data)
                    setIsClient(data.clientId === user.id)
                    setIsFreelancer(data.freelancerId === user.id)
                    // Always fetch payments to show all payment history
                    fetchPayments()
                } else if (response.status === 404) {
                    router.push("/dashboard")
                } else if (response.status === 403) {
                    router.push("/dashboard")
                } else {
                    console.error("Failed to fetch contract")
                }
            } catch (error) {
                console.error("Error fetching contract:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchContract()
    }, [contractId, user, router])

    const fetchPayments = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/payments/contract/${contractId}`, {
                credentials: "include"
            })
            if (response.ok) {
                const data = await response.json()
                // Handle both array and single payment response
                const paymentList = Array.isArray(data) ? data : [data]
                setPayments(paymentList)
                // Check if payout was already submitted
                if (paymentList.some((p: Payment) => p.receiverNumber && p.receiverNumber !== "empty")) {
                    setPayoutSubmitted(true)
                }
            }
        } catch (error) {
            console.error("Error fetching payments:", error)
        }
    }

    const handleComplete = async () => {
        if (!confirm("Are you sure you want to mark this contract as completed?")) return

        setActionLoading(true)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/contracts/${contractId}/complete`, {
                method: "PUT",
                credentials: "include"
            })

            if (response.ok) {
                setContract((prev) => (prev ? { ...prev, status: "completed" } : null))
            } else {
                alert("Failed to complete contract")
            }
        } catch (error) {
            console.error("Error completing contract:", error)
            alert("An error occurred while completing the contract")
        } finally {
            setActionLoading(false)
        }
    }

    const handleReject = async () => {
        if (!confirm("Are you sure you want to reject this contract?")) return

        setActionLoading(true)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/contracts/${contractId}/reject`, {
                method: "PUT",
                credentials: "include"
            })

            if (response.ok) {
                setContract((prev) => (prev ? { ...prev, status: "cancelled" } : null))
            } else {
                alert("Failed to reject contract")
            }
        } catch (error) {
            console.error("Error rejecting contract:", error)
            alert("An error occurred while rejecting the contract")
        } finally {
            setActionLoading(false)
        }
    }

    const handleSubmitPayout = async () => {
        setPayoutError(null)

        if (!receiverNumber.trim()) {
            setPayoutError("Please enter your receiver number")
            return
        }

        if (!receiverNumber.match(/^01[0-9]{9}$/)) {
            setPayoutError("Receiver number must be a valid Bangladesh mobile number (e.g., 01712345678)")
            return
        }

        if (
            !confirm("Are you sure you want to submit your payout details? You will not be able to change this later.")
        ) {
            return
        }

        setPayoutLoading(true)
        try {
            // Use the client's payment method as the payout method
            const clientPaymentMethod = payments.length > 0 ? payments[0].paymentMethod : "Unknown"

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/payments/payout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    contractId,
                    payoutMethod: clientPaymentMethod,
                    receiverNumber: `+88${receiverNumber.trim()}`
                })
            })

            if (response.ok) {
                setPayoutSubmitted(true)
                fetchPayments()
            } else {
                const error = await response.json()
                setPayoutError(error.message || "Failed to submit payout details")
            }
        } catch (error) {
            console.error("Error submitting payout:", error)
            setPayoutError("An error occurred while submitting payout details")
        } finally {
            setPayoutLoading(false)
        }
    }

    const getStatusBadge = (status: ContractStatus) => {
        switch (status) {
            case "active":
                return (
                    <Badge variant="primary">
                        <Clock className="w-3.5 h-3.5 mr-1 inline" />
                        Active
                    </Badge>
                )
            case "completed":
                return (
                    <Badge variant="success">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1 inline" />
                        Completed
                    </Badge>
                )
            case "cancelled":
                return (
                    <Badge variant="danger">
                        <XCircle className="w-3.5 h-3.5 mr-1 inline" />
                        Cancelled
                    </Badge>
                )
            default:
                return (
                    <Badge variant="warning">
                        <AlertCircle className="w-3.5 h-3.5 mr-1 inline" />
                        Payment Required
                    </Badge>
                )
        }
    }

    if (loading) {
        return <LoadingSpinner />
    }

    if (!contract) {
        return (
            <PageContainer>
                <div className="max-w-4xl mx-auto text-center py-20">
                    <h2 className="text-2xl font-bold mb-4">Contract not found</h2>
                    <Button onClick={() => router.push("/dashboard")} icon={ArrowLeft} iconPosition="left">
                        Back to Dashboard
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
                    onClick={() => router.push("/dashboard")}
                    icon={ArrowLeft}
                    iconPosition="left"
                    className="mb-6"
                >
                    Back to Dashboard
                </Button>

                {/* Contract Header */}
                <Card className="mb-6">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex-1">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-16 h-16 bg-blue-600/20 border border-blue-700/50 rounded-xl flex items-center justify-center">
                                    <FileText className="w-8 h-8 text-blue-400" />
                                </div>
                                <div className="flex-1">
                                    <h1 className="text-3xl font-bold mb-2">Contract Details</h1>
                                    <div className="flex flex-wrap gap-2">{getStatusBadge(contract.status)}</div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {isClient && contract.status === "payment-required" && (
                            <div className="flex gap-3">
                                <Button
                                    variant="primary"
                                    icon={CreditCard}
                                    onClick={() => router.push(`/contracts/${contractId}/pay`)}
                                >
                                    Make Payment
                                </Button>
                                <Button variant="danger" icon={XCircle} onClick={handleReject} disabled={actionLoading}>
                                    Reject
                                </Button>
                            </div>
                        )}
                        {isClient && contract.status === "active" && (
                            <Button
                                variant="primary"
                                icon={CheckCircle2}
                                onClick={handleComplete}
                                disabled={actionLoading}
                            >
                                Mark Complete
                            </Button>
                        )}
                    </div>

                    {/* Contract Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-gray-900/50 border border-blue-900/20 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                                <DollarSign className="w-4 h-4" />
                                <span>Contract Amount</span>
                            </div>
                            <p className="text-2xl font-bold text-blue-400">{formatBudget(contract.amount)}</p>
                        </div>
                        <div className="bg-gray-900/50 border border-blue-900/20 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                                <Calendar className="w-4 h-4" />
                                <span>Start Date</span>
                            </div>
                            <p className="text-sm font-medium">
                                {contract.startDate ? formatDateTime(contract.startDate) : "Not started"}
                            </p>
                        </div>
                        <div className="bg-gray-900/50 border border-blue-900/20 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                                <Calendar className="w-4 h-4" />
                                <span>Created</span>
                            </div>
                            <p className="text-sm font-medium">{formatDateTime(contract.createdAt)}</p>
                        </div>
                    </div>

                    {/* View Related Items */}
                    <div className="flex gap-3">
                        <Button
                            variant="secondary"
                            icon={Briefcase}
                            onClick={() => router.push(`/jobs/${contract.jobId}`)}
                        >
                            View Job
                        </Button>
                        <Button
                            variant="secondary"
                            icon={FileText}
                            onClick={() => router.push(`/proposals/${contract.proposalId}`)}
                        >
                            View Proposal
                        </Button>
                    </div>
                </Card>

                {/* Payment Info */}
                {isClient && payments.length > 0 && (
                    <Card className="mb-6">
                        <h2 className="text-xl font-bold mb-4">Payment History ({payments.length})</h2>
                        <div className="space-y-4">
                            {payments.map((payment, index) => (
                                <div
                                    key={payment.id}
                                    className="bg-gray-900/50 border border-blue-900/20 rounded-lg p-4"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm text-gray-400">
                                            Payment #{payments.length - index}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-500 font-mono">
                                                {payment.id.slice(0, 8)}...
                                            </span>
                                            <button
                                                onClick={() => copyToClipboard(payment.id)}
                                                className="p-1 hover:bg-gray-700 rounded transition-colors"
                                                title="Copy Payment ID"
                                            >
                                                {copiedId === payment.id ? (
                                                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                                                ) : (
                                                    <Copy className="w-3.5 h-3.5 text-gray-400" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between flex-wrap gap-4">
                                        <div>
                                            <p className="text-sm text-gray-400">Status</p>
                                            <p className="font-semibold capitalize">
                                                {payment.status === "pending" && (
                                                    <span className="text-yellow-400">⏳ Pending Verification</span>
                                                )}
                                                {payment.status === "verified" && (
                                                    <span className="text-emerald-400">✓ Verified</span>
                                                )}
                                                {payment.status === "paid_out" && (
                                                    <span className="text-blue-400">💸 Paid Out</span>
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
                                        <div>
                                            <p className="text-sm text-gray-400">Amount</p>
                                            <p className="font-semibold">{formatBudget(payment.amount)}</p>
                                        </div>
                                    </div>
                                    {payment.rejectionReason && (
                                        <div className="mt-4 p-3 bg-red-600/10 border border-red-600/30 rounded-lg">
                                            <p className="text-sm text-red-400">
                                                <strong>Rejection Reason:</strong> {payment.rejectionReason}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-2">
                                                Contact us at{" "}
                                                <a
                                                    href={`mailto:cool@example.com?subject=Payment Issue - ${payment.id}`}
                                                    className="text-blue-400 hover:underline"
                                                >
                                                    cool@example.com
                                                </a>{" "}
                                                with payment ID: {payment.id}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </Card>
                )}

                {/* Status Messages */}
                {contract.status === "payment-required" && isClient && (
                    <Card className="bg-yellow-600/10 border-yellow-600/30">
                        <div className="flex items-start gap-4">
                            <AlertCircle className="w-8 h-8 text-yellow-400 shrink-0" />
                            <div>
                                <h3 className="text-lg font-bold mb-2 text-yellow-400">Payment Required</h3>
                                <p className="text-gray-300">
                                    Please complete the payment to activate this contract and start the project.
                                </p>
                            </div>
                        </div>
                    </Card>
                )}

                {contract.status === "payment-required" && isFreelancer && (
                    <Card className="bg-yellow-600/10 border-yellow-600/30">
                        <div className="flex items-start gap-4">
                            <AlertCircle className="w-8 h-8 text-yellow-400 shrink-0" />
                            <div>
                                <h3 className="text-lg font-bold mb-2 text-yellow-400">Awaiting Payment</h3>
                                <p className="text-gray-300">
                                    The client needs to complete the payment before the contract becomes active.
                                </p>
                            </div>
                        </div>
                    </Card>
                )}

                {contract.status === "active" && (
                    <Card className="bg-blue-600/10 border-blue-600/30">
                        <div className="flex items-start gap-4">
                            <Clock className="w-8 h-8 text-blue-400 shrink-0" />
                            <div>
                                <h3 className="text-lg font-bold mb-2 text-blue-400">Contract Active</h3>
                                <p className="text-gray-300">
                                    {isFreelancer
                                        ? "The contract is active. Work on the project and deliver as agreed."
                                        : "The contract is active. The freelancer is working on your project."}
                                </p>
                            </div>
                        </div>
                    </Card>
                )}

                {contract.status === "completed" && (
                    <Card className="bg-emerald-600/10 border-emerald-600/30">
                        <div className="flex items-start gap-4">
                            <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
                            <div>
                                <h3 className="text-lg font-bold mb-2 text-emerald-400">Contract Completed</h3>
                                <p className="text-gray-300">
                                    This contract has been completed successfully.
                                    {contract.completedAt && ` Completed on ${formatDateTime(contract.completedAt)}`}
                                </p>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Freelancer Payout Section */}
                {contract.status === "completed" && isFreelancer && (
                    <Card className="mt-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Wallet className="w-6 h-6 text-blue-400" />
                            <h2 className="text-xl font-bold">Receive Your Payment</h2>
                        </div>

                        {payments.length > 0 && payments.some((p) => p.isPaidOut) ? (
                            <div className="bg-emerald-600/10 border border-emerald-600/30 rounded-lg p-6 text-center">
                                <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-emerald-400 mb-2">Payment Sent!</h3>
                                <p className="text-gray-300 mb-2">Your payout has been processed successfully.</p>
                                <p className="text-gray-400 text-sm">
                                    Check your {payments.find((p) => p.isPaidOut)?.payoutMethod} account ending in{" "}
                                    <span className="font-mono">
                                        {payments.find((p) => p.isPaidOut)?.receiverNumber?.slice(-4)}
                                    </span>
                                </p>
                                {payments.find((p) => p.isPaidOut)?.paidOutAt && (
                                    <p className="text-gray-500 text-xs mt-2">
                                        Paid out on {formatDateTime(payments.find((p) => p.isPaidOut)!.paidOutAt!)}
                                    </p>
                                )}
                            </div>
                        ) : payoutSubmitted ||
                          (payments.length > 0 &&
                              payments.some((p) => p.receiverNumber && p.receiverNumber !== "empty")) ? (
                            <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-6 text-center">
                                <Clock className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-blue-400 mb-2">Payout Processing</h3>
                                <p className="text-gray-300 mb-2">
                                    Your payout details have been submitted successfully.
                                </p>
                                <p className="text-gray-400 text-sm">
                                    You will receive your payment within 24-48 hours.
                                </p>
                            </div>
                        ) : (
                            <div>
                                {/* Amount Summary */}
                                <div className="bg-gray-900/50 border border-emerald-900/20 rounded-lg p-4 mb-6">
                                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                                        <DollarSign className="w-4 h-4" />
                                        <span>Payout Amount</span>
                                    </div>
                                    <p className="text-2xl font-bold text-emerald-400">
                                        {formatBudget(contract.amount)}
                                    </p>
                                </div>

                                {/* Payout Method Display (must match client's payment method) */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Payout Method
                                    </label>
                                    <div className="w-full px-4 py-3 bg-gray-900/50 border border-blue-900/30 rounded-lg text-white capitalize">
                                        {payments.length > 0 ? payments[0].paymentMethod : "Unknown"}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Payout method must match the client's payment method
                                    </p>
                                </div>

                                {/* Receiver Number Input */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Receiver Phone Number <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={receiverNumber}
                                        onChange={(e) => setReceiverNumber(e.target.value)}
                                        placeholder="01XXXXXXXXX"
                                        className="w-full px-4 py-3 bg-gray-900/50 border border-blue-900/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-600/50 transition-colors"
                                        maxLength={11}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        The phone number where you want to receive your payment
                                    </p>
                                </div>

                                {/* Error Message */}
                                {payoutError && (
                                    <div className="mb-6 p-4 bg-red-600/10 border border-red-600/30 rounded-lg flex items-start gap-3">
                                        <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                        <p className="text-red-400">{payoutError}</p>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <Button
                                    variant="primary"
                                    icon={Send}
                                    onClick={handleSubmitPayout}
                                    disabled={payoutLoading || !receiverNumber.trim()}
                                    className="w-full"
                                >
                                    {payoutLoading ? "Submitting..." : "Submit Payout Details"}
                                </Button>

                                {/* Notice */}
                                <p className="text-center text-xs text-gray-500 mt-4">
                                    Make sure to enter the correct phone number. You will not be able to change this
                                    later.
                                </p>
                            </div>
                        )}
                    </Card>
                )}

                {contract.status === "cancelled" && (
                    <Card className="bg-red-600/10 border-red-600/30">
                        <div className="flex items-start gap-4">
                            <XCircle className="w-8 h-8 text-red-400 shrink-0" />
                            <div>
                                <h3 className="text-lg font-bold mb-2 text-red-400">Contract Cancelled</h3>
                                <p className="text-gray-300">This contract has been cancelled.</p>
                            </div>
                        </div>
                    </Card>
                )}
            </div>
        </PageContainer>
    )
}
