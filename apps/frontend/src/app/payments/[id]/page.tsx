"use client"

import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { PageContainer } from "@/components/ui/page-container"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    CreditCard,
    DollarSign,
    Calendar,
    ArrowLeft,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Clock,
    FileText,
    Copy,
    Check
} from "lucide-react"
import { getUser } from "@/utils/auth"
import { formatDateTime } from "@/utils/time"
import { formatBudget } from "@/utils/format"
import { Payment, PaymentStatus } from "@/types/payment"

export default function PaymentDetailPage() {
    const router = useRouter()
    const params = useParams()
    const paymentId = params.id as string

    const [payment, setPayment] = useState<Payment | null>(null)
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<any>(null)
    const [copied, setCopied] = useState(false)

    const copyToClipboard = async (text: string) => {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
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
        const fetchPayment = async () => {
            if (!user) return
            setLoading(true)
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/payments/${paymentId}`, {
                    credentials: "include"
                })

                if (response.ok) {
                    const data = await response.json()
                    setPayment(data)
                } else if (response.status === 404) {
                    router.push("/payments")
                } else {
                    console.error("Failed to fetch payment")
                }
            } catch (error) {
                console.error("Error fetching payment:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchPayment()
    }, [paymentId, user, router])

    const getStatusBadge = (status: PaymentStatus) => {
        switch (status) {
            case "verified":
                return (
                    <Badge variant="success">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1 inline" />
                        Verified
                    </Badge>
                )
            case "paid_out":
                return (
                    <Badge variant="primary">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1 inline" />
                        Paid Out
                    </Badge>
                )
            case "rejected":
                return (
                    <Badge variant="danger">
                        <XCircle className="w-3.5 h-3.5 mr-1 inline" />
                        Rejected
                    </Badge>
                )
            case "refunded":
                return (
                    <Badge variant="info">
                        <ArrowLeft className="w-3.5 h-3.5 mr-1 inline" />
                        Refunded
                    </Badge>
                )
            default:
                return (
                    <Badge variant="warning">
                        <Clock className="w-3.5 h-3.5 mr-1 inline" />
                        Pending
                    </Badge>
                )
        }
    }

    const getPaymentMethodInfo = (method: string) => {
        const methods: Record<string, { label: string; color: string }> = {
            bkash: { label: "bKash", color: "bg-pink-600" },
            mcash: { label: "mCash", color: "bg-green-600" },
            rocket: { label: "Rocket", color: "bg-purple-600" }
        }
        return methods[method] || { label: method, color: "bg-gray-600" }
    }

    if (loading || !user) {
        return <LoadingSpinner />
    }

    if (!payment) {
        return (
            <PageContainer>
                <div className="max-w-4xl mx-auto text-center py-20">
                    <h2 className="text-2xl font-bold mb-4">Payment not found</h2>
                    <Button onClick={() => router.push("/payments")} icon={ArrowLeft} iconPosition="left">
                        Back to Payments
                    </Button>
                </div>
            </PageContainer>
        )
    }

    const isClient = payment.clientId === user.id
    const methodInfo = getPaymentMethodInfo(payment.paymentMethod)

    return (
        <PageContainer>
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <Button
                    variant="secondary"
                    onClick={() => router.push("/payments")}
                    icon={ArrowLeft}
                    iconPosition="left"
                    className="mb-6"
                >
                    Back to Payments
                </Button>

                {/* Payment Header */}
                <Card className="mb-6">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="w-16 h-16 bg-emerald-600/20 border border-emerald-700/50 rounded-xl flex items-center justify-center">
                            <CreditCard className="w-8 h-8 text-emerald-400" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                                <h1 className="text-2xl font-bold">Payment Details</h1>
                                {getStatusBadge(payment.status)}
                                <Badge variant={isClient ? "info" : "success"}>{isClient ? "Sent" : "Received"}</Badge>
                            </div>
                            <p className="text-gray-400 font-mono text-sm">ID: {payment.id}</p>
                        </div>
                    </div>

                    {/* Payment Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="bg-gray-900/50 border border-blue-900/20 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                                <DollarSign className="w-4 h-4" />
                                <span>Amount</span>
                            </div>
                            <p className="text-2xl font-bold text-blue-400">{formatBudget(payment.amount)}</p>
                        </div>
                        <div className="bg-gray-900/50 border border-blue-900/20 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                                <CreditCard className="w-4 h-4" />
                                <span>{isClient ? "Payment Method" : "Payout Method"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div
                                    className={`w-6 h-6 ${isClient ? methodInfo.color : getPaymentMethodInfo(payment.payoutMethod).color} rounded flex items-center justify-center`}
                                >
                                    <CreditCard className="w-3 h-3 text-white" />
                                </div>
                                <p className="text-lg font-semibold">
                                    {isClient ? methodInfo.label : getPaymentMethodInfo(payment.payoutMethod).label}
                                </p>
                            </div>
                        </div>
                        {isClient && (
                            <div className="bg-gray-900/50 border border-blue-900/20 rounded-lg p-4">
                                <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                                    <FileText className="w-4 h-4" />
                                    <span>Transaction ID</span>
                                </div>
                                <p className="text-sm font-mono font-medium break-all">{payment.transactionId}</p>
                            </div>
                        )}
                        {isClient && payment.senderNumber && (
                            <div className="bg-gray-900/50 border border-blue-900/20 rounded-lg p-4">
                                <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                                    <CreditCard className="w-4 h-4" />
                                    <span>Sender Number</span>
                                </div>
                                <p className="text-sm font-mono font-medium">{payment.senderNumber}</p>
                            </div>
                        )}
                        {!isClient && payment.receiverNumber && payment.receiverNumber !== "empty" && (
                            <div className="bg-gray-900/50 border border-blue-900/20 rounded-lg p-4">
                                <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                                    <CreditCard className="w-4 h-4" />
                                    <span>Receiver Number</span>
                                </div>
                                <p className="text-sm font-mono font-medium">{payment.receiverNumber}</p>
                            </div>
                        )}
                        <div className="bg-gray-900/50 border border-blue-900/20 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                                <Calendar className="w-4 h-4" />
                                <span>Created</span>
                            </div>
                            <p className="text-sm font-medium">{formatDateTime(payment.createdAt)}</p>
                        </div>
                    </div>

                    {/* Additional Info */}
                    {payment.notes && (
                        <div className="bg-gray-900/50 border border-blue-900/20 rounded-lg p-4 mb-4">
                            <p className="text-gray-400 text-sm mb-1">Notes</p>
                            <p className="text-gray-300">{payment.notes}</p>
                        </div>
                    )}

                    {payment.verifiedAt && (
                        <div className="bg-gray-900/50 border border-emerald-900/20 rounded-lg p-4 mb-4">
                            <p className="text-gray-400 text-sm mb-1">Verified At</p>
                            <p className="text-emerald-400 font-medium">{formatDateTime(payment.verifiedAt)}</p>
                        </div>
                    )}

                    {payment.paidOutAt && (
                        <div className="bg-gray-900/50 border border-emerald-900/20 rounded-lg p-4 mb-4">
                            <p className="text-gray-400 text-sm mb-1">Paid Out At</p>
                            <p className="text-emerald-400 font-medium">{formatDateTime(payment.paidOutAt)}</p>
                        </div>
                    )}

                    {/* View Contract Button */}
                    <Button
                        variant="secondary"
                        icon={FileText}
                        onClick={() => router.push(`/contracts/${payment.contractId}`)}
                    >
                        View Contract
                    </Button>
                </Card>

                {/* Status Messages */}
                {payment.status === "pending" && (
                    <Card className="bg-yellow-600/10 border-yellow-600/30">
                        <div className="flex items-start gap-4">
                            <Clock className="w-8 h-8 text-yellow-400 flex-shrink-0" />
                            <div>
                                <h3 className="text-lg font-bold mb-2 text-yellow-400">Payment Pending</h3>
                                <p className="text-gray-300">
                                    This payment is awaiting verification. Our team will verify the transaction shortly.
                                </p>
                            </div>
                        </div>
                    </Card>
                )}

                {payment.status === "verified" && (
                    <Card className="bg-emerald-600/10 border-emerald-600/30">
                        <div className="flex items-start gap-4">
                            <CheckCircle2 className="w-8 h-8 text-emerald-400 flex-shrink-0" />
                            <div>
                                <h3 className="text-lg font-bold mb-2 text-emerald-400">Payment Verified</h3>
                                <p className="text-gray-300">
                                    This payment has been verified successfully. The contract is now active.
                                </p>
                            </div>
                        </div>
                    </Card>
                )}

                {payment.status === "rejected" && (
                    <Card className="bg-red-600/10 border-red-600/30">
                        <div className="flex items-start gap-4">
                            <XCircle className="w-8 h-8 text-red-400 flex-shrink-0" />
                            <div>
                                <h3 className="text-lg font-bold mb-2 text-red-400">Payment Rejected</h3>
                                {payment.rejectionReason && (
                                    <p className="text-gray-300 mb-3">Reason: {payment.rejectionReason}</p>
                                )}
                                <div className="bg-red-900/20 border border-red-800/30 rounded-lg p-4 mt-2">
                                    <p className="text-gray-300 mb-2">
                                        If you believe this is an error, please contact us with your payment ID:
                                    </p>
                                    <div className="flex items-center gap-2 mb-3">
                                        <p className="font-mono text-sm bg-gray-900/50 px-3 py-2 rounded break-all flex-1">
                                            {payment.id}
                                        </p>
                                        <button
                                            onClick={() => copyToClipboard(payment.id)}
                                            className="p-2 bg-gray-800 hover:bg-gray-700 rounded transition-colors"
                                            title="Copy Payment ID"
                                        >
                                            {copied ? (
                                                <Check className="w-4 h-4 text-emerald-400" />
                                            ) : (
                                                <Copy className="w-4 h-4 text-gray-400" />
                                            )}
                                        </button>
                                    </div>
                                    <p className="text-gray-300">
                                        Email us at:{" "}
                                        <a
                                            href={`mailto:omarfaruksxp@gmail.com?subject=Payment Issue - ${payment.id}&body=Payment ID: ${payment.id}%0A%0APlease describe your issue:`}
                                            className="text-blue-400 hover:text-blue-300 underline"
                                        >
                                            omarfaruksxp@gmail.com
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>
                )}

                {payment.status === "refunded" && (
                    <Card className="bg-blue-600/10 border-blue-600/30">
                        <div className="flex items-start gap-4">
                            <AlertCircle className="w-8 h-8 text-blue-400 flex-shrink-0" />
                            <div>
                                <h3 className="text-lg font-bold mb-2 text-blue-400">Payment Refunded</h3>
                                <p className="text-gray-300">
                                    This payment has been refunded to the original payment method.
                                </p>
                            </div>
                        </div>
                    </Card>
                )}

                {payment.status === "paid_out" && (
                    <Card className="bg-emerald-600/10 border-emerald-600/30">
                        <div className="flex items-start gap-4">
                            <CheckCircle2 className="w-8 h-8 text-emerald-400 flex-shrink-0" />
                            <div>
                                <h3 className="text-lg font-bold mb-2 text-emerald-400">Payment Paid Out</h3>
                                <p className="text-gray-300">
                                    This payment has been successfully paid out to the freelancer.
                                    {payment.paidOutAt && ` Paid out on ${formatDateTime(payment.paidOutAt)}`}
                                </p>
                            </div>
                        </div>
                    </Card>
                )}
            </div>
        </PageContainer>
    )
}
