"use client"

import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { PageContainer } from "@/components/ui/page-container"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import {
    ArrowLeft,
    DollarSign,
    CreditCard,
    Send,
    CheckCircle2,
    AlertCircle,
    Smartphone,
    Copy,
    Check
} from "lucide-react"
import { getUser } from "@/utils/auth"
import { formatBudget, formatBDTBudget } from "@/utils/format"
import { Contract } from "@/types/contract"
import { PaymentMethod } from "@/types/payment"

const PAYMENT_METHODS: { value: PaymentMethod; label: string; color: string; merchantNumber: string }[] = [
    { value: "bkash", label: "bKash", color: "bg-pink-600", merchantNumber: "01857224363" },
    { value: "mcash", label: "mCash", color: "bg-green-600", merchantNumber: "018572243638" },
    { value: "rocket", label: "Rocket", color: "bg-purple-600", merchantNumber: "018572243639" }
]

export default function ContractPaymentPage() {
    const router = useRouter()
    const params = useParams()
    const contractId = params.id as string

    const [contract, setContract] = useState<Contract | null>(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [user, setUser] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    // Form state
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("bkash")
    const [transactionId, setTransactionId] = useState("")
    const [senderNumber, setSenderNumber] = useState("")
    const [notes, setNotes] = useState("")
    const [copied, setCopied] = useState(false)

    // Exchange rate
    const [bdtAmount, setBdtAmount] = useState<number | null>(null)
    const [exchangeRate, setExchangeRate] = useState<number | null>(null)
    const [loadingRate, setLoadingRate] = useState(false)

    useEffect(() => {
        const fetchUser = async () => {
            const userData = await getUser()
            if (!userData) return router.push("/login")
            if (userData.role !== "client") {
                router.push("/dashboard")
                return
            }
            setUser(userData)
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
                    // Only allow payment for contracts that require payment
                    if (data.status !== "payment-required") {
                        router.push(`/contracts/${contractId}`)
                        return
                    }
                    setContract(data)
                    // Fetch exchange rate
                    fetchExchangeRate(data.amount)
                } else if (response.status === 404 || response.status === 403) {
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

    const fetchExchangeRate = async (amountInCents: number) => {
        setLoadingRate(true)
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_ENDPOINT}/payments/rate?amount=${amountInCents}`,
                { credentials: "include" }
            )

            if (response.ok) {
                const data = await response.json()
                setBdtAmount(data.bdt)
                setExchangeRate(data.rate)
            }
        } catch (error) {
            console.error("Error fetching exchange rate:", error)
        } finally {
            setLoadingRate(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (!transactionId.trim()) {
            setError("Please enter a transaction ID")
            return
        }

        if (transactionId.length < 5) {
            setError("Transaction ID must be at least 5 characters")
            return
        }

        if (!senderNumber.trim()) {
            setError("Please enter your sender phone number")
            return
        }

        if (!senderNumber.match(/^01[0-9]{9}$/)) {
            setError("Sender number must be a valid Bangladesh mobile number (e.g., 01712345678)")
            return
        }

        setSubmitting(true)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/payments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    rate: exchangeRate,
                    contractId,
                    paymentMethod,
                    transactionId: transactionId.trim(),
                    senderNumber: `+88${senderNumber.trim()}`,
                    notes: notes.trim() || null
                })
            })

            if (response.ok) {
                setSuccess(true)
            } else {
                const data = await response.json()
                setError(data.message || "Failed to submit payment")
            }
        } catch (error) {
            console.error("Error submitting payment:", error)
            setError("An error occurred while submitting payment")
        } finally {
            setSubmitting(false)
        }
    }

    if (loading || !user) {
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

    if (success) {
        return (
            <PageContainer>
                <div className="max-w-2xl mx-auto">
                    <Card className="text-center py-12">
                        <CheckCircle2 className="w-20 h-20 text-emerald-400 mx-auto mb-6" />
                        <h2 className="text-3xl font-bold mb-4">Payment Submitted!</h2>
                        <p className="text-gray-400 mb-8 max-w-md mx-auto">
                            Your payment has been submitted successfully. Our team will verify your transaction and
                            update the status shortly.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Button
                                variant="secondary"
                                onClick={() => router.push(`/contracts/${contractId}`)}
                                icon={ArrowLeft}
                                iconPosition="left"
                            >
                                Back to Contract
                            </Button>
                            <Button onClick={() => router.push("/dashboard")}>Go to Dashboard</Button>
                        </div>
                    </Card>
                </div>
            </PageContainer>
        )
    }

    return (
        <PageContainer>
            <div className="max-w-3xl mx-auto">
                {/* Back Button */}
                <Button
                    variant="secondary"
                    onClick={() => router.push(`/proposals/${contract.proposalId}`)}
                    icon={ArrowLeft}
                    iconPosition="left"
                    className="mb-6"
                >
                    Back to Proposal
                </Button>

                {/* Header */}
                <Card className="mb-6">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="w-16 h-16 bg-emerald-600/20 border border-emerald-700/50 rounded-xl flex items-center justify-center">
                            <CreditCard className="w-8 h-8 text-emerald-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Make Payment</h1>
                            <p className="text-gray-400">Complete your payment to start the project</p>
                        </div>
                    </div>

                    {/* Amount Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-gray-900/50 border border-blue-900/20 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                                <DollarSign className="w-4 h-4" />
                                <span>Amount (USD)</span>
                            </div>
                            <p className="text-2xl font-bold text-blue-400">{formatBudget(contract.amount)}</p>
                        </div>
                        <div className="bg-gray-900/50 border border-emerald-900/20 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                                <Smartphone className="w-4 h-4" />
                                <span>Amount (BDT)</span>
                            </div>
                            {loadingRate ? (
                                <div className="h-8 w-24 bg-gray-700 animate-pulse rounded"></div>
                            ) : bdtAmount !== null ? (
                                <p className="text-2xl font-bold text-emerald-400">{formatBDTBudget(bdtAmount)}</p>
                            ) : (
                                <p className="text-gray-500">--</p>
                            )}
                            {exchangeRate && (
                                <p className="text-xs text-gray-500 mt-1">
                                    Rate: 1 USD = {exchangeRate.toFixed(2)} BDT
                                </p>
                            )}
                        </div>
                    </div>
                </Card>

                {/* Payment Form */}
                <Card>
                    <form onSubmit={handleSubmit}>
                        <h2 className="text-xl font-bold mb-6">Payment Details</h2>

                        {/* Payment Method Selection */}
                        <div className="mb-6">
                            <Select
                                id="paymentMethod"
                                label="Payment Method"
                                labelIcon={Smartphone}
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                                options={PAYMENT_METHODS.map((method) => ({
                                    value: method.value,
                                    label: method.label
                                }))}
                            />
                        </div>

                        {/* Payment Instructions */}
                        <div className="mb-6 p-4 bg-blue-900/20 border border-blue-700/30 rounded-lg">
                            <h3 className="font-semibold mb-2 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-blue-400" />
                                Payment Instructions
                            </h3>
                            <ol className="text-sm text-gray-300 space-y-2 list-decimal list-inside">
                                <li>
                                    Open your{" "}
                                    <strong>{PAYMENT_METHODS.find((m) => m.value === paymentMethod)?.label}</strong> app
                                </li>
                                <li>
                                    Send {bdtAmount ? formatBDTBudget(bdtAmount) : "the amount"} to our merchant number
                                </li>
                                <li>Copy the transaction ID from your payment confirmation</li>
                                <li>Paste the transaction ID below and submit</li>
                            </ol>
                            <div className="mt-3 p-3 bg-gray-900/50 rounded-lg">
                                <p className="text-sm text-gray-400">Merchant Number:</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-lg font-mono font-bold text-emerald-400">
                                        {PAYMENT_METHODS.find((m) => m.value === paymentMethod)?.merchantNumber}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const number = PAYMENT_METHODS.find(
                                                (m) => m.value === paymentMethod
                                            )?.merchantNumber
                                            if (number) {
                                                navigator.clipboard.writeText(number)
                                                setCopied(true)
                                                setTimeout(() => setCopied(false), 2000)
                                            }
                                        }}
                                        className="p-1.5 rounded-md hover:bg-gray-700 transition-colors"
                                        title="Copy merchant number"
                                    >
                                        {copied ? (
                                            <Check className="w-4 h-4 text-emerald-400" />
                                        ) : (
                                            <Copy className="w-4 h-4 text-gray-400" />
                                        )}
                                    </button>
                                    {copied && <span className="text-xs text-emerald-400">Copied!</span>}
                                </div>
                            </div>
                        </div>

                        {/* Transaction ID Input */}
                        <div className="mb-6">
                            <label htmlFor="transactionId" className="block text-sm font-medium text-gray-300 mb-2">
                                Transaction ID <span className="text-red-400">*</span>
                            </label>
                            <input
                                id="transactionId"
                                type="text"
                                value={transactionId}
                                onChange={(e) => setTransactionId(e.target.value)}
                                placeholder="Enter your transaction ID"
                                className="w-full px-4 py-3 bg-gray-900/50 border border-blue-900/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-600/50 transition-colors font-mono"
                                maxLength={50}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                You can find this in your payment confirmation message
                            </p>
                        </div>

                        {/* Sender Number Input */}
                        <div className="mb-6">
                            <label htmlFor="senderNumber" className="block text-sm font-medium text-gray-300 mb-2">
                                Sender Phone Number <span className="text-red-400">*</span>
                            </label>
                            <input
                                id="senderNumber"
                                type="text"
                                value={senderNumber}
                                onChange={(e) => setSenderNumber(e.target.value)}
                                placeholder="01XXXXXXXXX"
                                className="w-full px-4 py-3 bg-gray-900/50 border border-blue-900/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-600/50 transition-colors"
                                maxLength={11}
                            />
                            <p className="text-xs text-gray-500 mt-1">The phone number you used to send the payment</p>
                        </div>

                        {/* Notes Input (Optional) */}
                        <div className="mb-6">
                            <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-2">
                                Notes <span className="text-gray-500">(optional)</span>
                            </label>
                            <textarea
                                id="notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Any additional information about your payment..."
                                className="w-full px-4 py-3 bg-gray-900/50 border border-blue-900/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-600/50 transition-colors resize-none"
                                rows={3}
                                maxLength={500}
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-600/10 border border-red-600/30 rounded-lg flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                <p className="text-red-400">{error}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={submitting || !transactionId.trim() || !senderNumber.trim()}
                            icon={Send}
                            className="w-full"
                        >
                            {submitting ? "Submitting..." : "Submit Payment"}
                        </Button>
                    </form>
                </Card>

                {/* Notice */}
                <div className="mt-6 text-center text-sm text-gray-500">
                    <p>Your payment will be held securely until the project is completed.</p>
                    <p>Refunds are available if the project is not delivered as agreed.</p>
                </div>
            </div>
        </PageContainer>
    )
}
