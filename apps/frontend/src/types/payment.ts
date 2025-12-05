export type PaymentMethod = "bkash" | "mcash" | "rocket"
export type PaymentStatus = "pending" | "verified" | "rejected" | "paid_out" | "refunded"

export interface Payment {
    id: string
    contractId: string
    clientId: string
    freelancerId: string
    amount: number
    paymentMethod: PaymentMethod
    payoutMethod: PaymentMethod
    transactionId: string
    senderNumber: string
    receiverNumber: string
    status: PaymentStatus
    rejectReason: string | null
    notes: string | null
    isPaidOut: boolean
    verifiedBy: string | null
    verifiedAt: string | null
    paidOutAt: string | null
    createdAt: string
}
