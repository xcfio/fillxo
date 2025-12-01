export type PaymentMethod = "bkash" | "mcash" | "rocket"
export type PaymentStatus = "pending" | "verified" | "rejected" | "refunded"

export interface Payment {
    id: string
    contractId: string
    clientId: string
    freelancerId: string
    amount: number
    paymentMethod: PaymentMethod
    transactionId: string
    status: PaymentStatus
    rejectReason: string | null
    notes: string | null
    isPaidOut: boolean
    verifiedBy: string | null
    verifiedAt: string | null
    paidOutAt: string | null
    createdAt: string
}
