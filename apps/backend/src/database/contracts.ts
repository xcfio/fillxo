import { pgTable, timestamp, decimal, uuid, index, pgEnum } from "drizzle-orm/pg-core"
import { proposals } from "./proposals"
import { users } from "./users"
import { jobs } from "./jobs"
import { v7 } from "uuid"

export const contractStatusEnum = pgEnum("contract", ["active", "completed", "cancelled"])

export const contracts = pgTable(
    "contracts",
    {
        id: uuid("id")
            .primaryKey()
            .$defaultFn(() => v7()),
        jobId: uuid("job_id")
            .notNull()
            .references(() => jobs.id),
        proposalId: uuid("proposal_id")
            .notNull()
            .references(() => proposals.id),
        clientId: uuid("client_id")
            .notNull()
            .references(() => users.id),
        freelancerId: uuid("freelancer_id")
            .notNull()
            .references(() => users.id),
        amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
        status: contractStatusEnum("status").default("active"),
        startDate: timestamp("start_date").defaultNow(),
        completedAt: timestamp("completed_at"),
        createdAt: timestamp("created_at").defaultNow().notNull()
    },
    (table) => [
        index("contract_client_idx").on(table.clientId),
        index("contract_freelancer_idx").on(table.freelancerId)
    ]
)
