import { pgEnum } from "drizzle-orm/pg-core"

export const jobStatusEnum = pgEnum("job_status", ["open", "closed"])
export const proposalStatusEnum = pgEnum("proposal_status", ["pending", "accepted", "rejected"])
export const contractStatusEnum = pgEnum("contract_status", ["active", "completed", "cancelled"])
