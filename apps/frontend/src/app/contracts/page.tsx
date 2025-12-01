"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { PageContainer } from "@/components/ui/page-container"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Calendar, ArrowLeft, CheckCircle2, XCircle, AlertCircle, Clock, CreditCard } from "lucide-react"
import { getUser } from "@/utils/auth"
import { formatDateTime } from "@/utils/time"
import { formatBudget } from "@/utils/format"
import { Contract, ContractStatus } from "@/types/contract"

export default function ContractsPage() {
    const router = useRouter()
    const [contracts, setContracts] = useState<Contract[]>([])
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<any>(null)
    const [filter, setFilter] = useState<ContractStatus | "all">("all")

    useEffect(() => {
        const fetchUser = async () => {
            const user = await getUser()
            if (!user) return router.push("/login")
            setUser(user)
        }
        fetchUser()
    }, [router])

    useEffect(() => {
        const fetchContracts = async () => {
            if (!user) return
            setLoading(true)
            try {
                const url =
                    filter === "all"
                        ? `${process.env.NEXT_PUBLIC_API_ENDPOINT}/contracts`
                        : `${process.env.NEXT_PUBLIC_API_ENDPOINT}/contracts?status=${filter}`

                const response = await fetch(url, {
                    credentials: "include"
                })

                if (response.ok) {
                    const data = await response.json()
                    setContracts(data)
                } else {
                    console.error("Failed to fetch contracts")
                }
            } catch (error) {
                console.error("Error fetching contracts:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchContracts()
    }, [user, filter])

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

    const isClient = (contract: Contract) => contract.clientId === user?.id

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
                        <h1 className="text-3xl font-bold">My Contracts</h1>
                        <p className="text-gray-400 mt-1">Manage your contracts and payments</p>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 mb-6 flex-wrap">
                    {(["all", "payment-required", "active", "completed", "cancelled"] as const).map((status) => (
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
                                : status === "payment-required"
                                  ? "Payment Required"
                                  : status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Contracts List */}
                {contracts.length === 0 ? (
                    <Card className="text-center py-12">
                        <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold mb-2">No contracts found</h2>
                        <p className="text-gray-400">
                            {filter === "all"
                                ? "You don't have any contracts yet."
                                : `You don't have any ${filter.replace("-", " ")} contracts.`}
                        </p>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {contracts.map((contract) => (
                            <Card
                                key={contract.id}
                                hover
                                onClick={() => router.push(`/contracts/${contract.id}`)}
                                className="cursor-pointer"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className="w-12 h-12 bg-blue-600/20 border border-blue-700/50 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <FileText className="w-6 h-6 text-blue-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                <h3 className="font-semibold">Contract #{contract.id.slice(0, 8)}</h3>
                                                {getStatusBadge(contract.status)}
                                                <Badge variant={isClient(contract) ? "info" : "success"}>
                                                    {isClient(contract) ? "Client" : "Freelancer"}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-gray-400 flex-wrap">
                                                <span className="flex items-center gap-1">
                                                    {formatBudget(contract.amount)}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {formatDateTime(contract.createdAt)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    {contract.status === "payment-required" && isClient(contract) && (
                                        <Button
                                            icon={CreditCard}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                router.push(`/contracts/${contract.id}/pay`)
                                            }}
                                        >
                                            Pay Now
                                        </Button>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </PageContainer>
    )
}
