"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { PageContainer } from "@/components/ui/page-container"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CreditCard, Calendar, ArrowLeft, CheckCircle2, XCircle, AlertCircle, Clock, FileText } from "lucide-react"
import { getUser } from "@/utils/auth"
import { formatDateTime } from "@/utils/time"
import { formatBudget } from "@/utils/format"
import { Payment, PaymentStatus } from "@/types/payment"

export default function PaymentsPage() {
    const router = useRouter()
    const [payments, setPayments] = useState<Payment[]>([])
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<any>(null)
    const [filter, setFilter] = useState<PaymentStatus | "all">("all")

    useEffect(() => {
        const fetchUser = async () => {
            const user = await getUser()
            if (!user) return router.push("/login")
            setUser(user)
        }
        fetchUser()
    }, [router])

    useEffect(() => {
        const fetchPayments = async () => {
            if (!user) return
            setLoading(true)
            try {
                const url =
                    filter === "all"
                        ? `${process.env.NEXT_PUBLIC_API_ENDPOINT}/payments`
                        : `${process.env.NEXT_PUBLIC_API_ENDPOINT}/payments?status=${filter}`

                const response = await fetch(url, {
                    credentials: "include"
                })

                if (response.ok) {
                    const data = await response.json()
                    setPayments(data)
                } else {
                    console.error("Failed to fetch payments")
                }
            } catch (error) {
                console.error("Error fetching payments:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchPayments()
    }, [user, filter])

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

    const getPaymentMethodBadge = (method: string) => {
        const colors: Record<string, string> = {
            bkash: "bg-pink-600/20 text-pink-400 border-pink-600/30",
            mcash: "bg-green-600/20 text-green-400 border-green-600/30",
            rocket: "bg-purple-600/20 text-purple-400 border-purple-600/30"
        }
        return (
            <span
                className={`px-2 py-1 rounded text-xs font-medium border ${colors[method] || "bg-gray-600/20 text-gray-400"}`}
            >
                {method.charAt(0).toUpperCase() + method.slice(1)}
            </span>
        )
    }

    const isClient = (payment: Payment) => payment.clientId === user?.id

    if (loading || !user) {
        return <LoadingSpinner />
    }

    return (
        <PageContainer>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <Button
                            variant="secondary"
                            onClick={() => router.push("/dashboard")}
                            icon={ArrowLeft}
                            iconPosition="left"
                            className="mb-4"
                        >
                            Back to Dashboard
                        </Button>
                        <h1 className="text-3xl font-bold">Payment History</h1>
                        <p className="text-gray-400 mt-1">View all your payment transactions</p>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 mb-6 flex-wrap">
                    {(["all", "pending", "verified", "paid_out", "rejected", "refunded"] as const).map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                                filter === status
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                            }`}
                        >
                            {status === "all"
                                ? "All"
                                : status === "paid_out"
                                  ? "Paid Out"
                                  : status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Payments List */}
                {payments.length === 0 ? (
                    <Card className="text-center py-12">
                        <CreditCard className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold mb-2">No payments found</h2>
                        <p className="text-gray-400">
                            {filter === "all"
                                ? "You don't have any payment transactions yet."
                                : `You don't have any ${filter} payments.`}
                        </p>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {payments.map((payment) => (
                            <Card
                                key={payment.id}
                                hover
                                onClick={() => router.push(`/payments/${payment.id}`)}
                                className="cursor-pointer"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className="w-12 h-12 bg-emerald-600/20 border border-emerald-700/50 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <CreditCard className="w-6 h-6 text-emerald-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                <h3 className="font-semibold">Payment #{payment.id}</h3>
                                                {getStatusBadge(payment.status)}
                                                {getPaymentMethodBadge(payment.paymentMethod)}
                                                <Badge variant={isClient(payment) ? "info" : "success"}>
                                                    {isClient(payment) ? "Sent" : "Received"}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-gray-400 flex-wrap">
                                                <span className="flex items-center gap-1">
                                                    {formatBudget(payment.amount)}
                                                </span>
                                                <span className="flex items-center gap-1 font-mono text-xs">
                                                    TxID: {payment.transactionId}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {formatDateTime(payment.createdAt)}
                                                </span>
                                            </div>
                                            {payment.rejectionReason && (
                                                <p className="mt-2 text-sm text-red-400">
                                                    <AlertCircle className="w-4 h-4 inline mr-1" />
                                                    {payment.rejectionReason}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* View Contract Button */}
                                    <Button
                                        variant="secondary"
                                        icon={FileText}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            router.push(`/contracts/${payment.contractId}`)
                                        }}
                                    >
                                        View Contract
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </PageContainer>
    )
}
