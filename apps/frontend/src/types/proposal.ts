export type ProposalStatus = "pending" | "accepted" | "rejected"

export interface Proposal {
    id: string
    jobId: string
    freelancerId: string
    bidAmount: number
    coverLetter: string
    deliveryDays: number
    status: ProposalStatus
    createdAt: string
}
