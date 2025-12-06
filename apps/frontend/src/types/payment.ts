export type PaymentMethod = "bkash" | "mcash" | "rocket"
export type PaymentStatus = "pending" | "verified" | "rejected" | "paid_out" | "refunded"

export interface Payment {
    id: string
    jobId: string
    proposalId: string
    contractId: string
    clientId: string
    freelancerId: string
    amount: number
    rate: number
    paymentMethod: PaymentMethod
    payoutMethod: PaymentMethod
    transactionId: string
    senderNumber: string
    receiverNumber: string
    proofUrl: string | null
    notes: string | null
    status: PaymentStatus
    verifiedBy: string | null
    verifiedAt: string | null
    rejectionReason: string | null
    isPaidOut: boolean
    paidOutAt: string | null
    paidOutBy: string | null
    createdAt: string
    updatedAt: string
}
