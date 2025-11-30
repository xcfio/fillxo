export type PaymentMethod = "bkash" | "mcash" | "rocket"
export type PaymentStatus = "pending" | "verified" | "rejected" | "refunded"

export interface Payment {
    id: string
    proposalId: string
    amount: number
    paymentMethod: PaymentMethod
    transactionId: string
    notes: string | null
    status: PaymentStatus
    isPaidOut: boolean
    verifiedBy: string | null
    verifiedAt: string | null
    paidOutAt: string | null
    createdAt: string
}
