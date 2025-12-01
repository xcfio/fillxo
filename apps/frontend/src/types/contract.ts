export type ContractStatus = "payment-required" | "active" | "completed" | "cancelled"

export interface Contract {
    id: string
    jobId: string
    proposalId: string
    clientId: string
    freelancerId: string
    amount: number
    status: ContractStatus
    completedAt: string | null
    startDate: string | null
    createdAt: string
}
