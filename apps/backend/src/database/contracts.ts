import { pgTable, timestamp, bigint, uuid, index, pgEnum } from "drizzle-orm/pg-core"
import { UUID, Nullable, amount } from "../typebox"
import { proposals } from "./proposals"
import { users } from "./users"
import { jobs } from "./jobs"
import { Type, Static } from "typebox"
import { v7 } from "uuid"

export const contractStatusEnum = pgEnum("contract", ["payment-required", "active", "completed", "cancelled"])

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
        amount: bigint("amount", { mode: "number" }).notNull(),
        status: contractStatusEnum("status").notNull().default("payment-required"),
        completedAt: timestamp("completed_at", { withTimezone: false }),
        startDate: timestamp("start_date", { withTimezone: false }).defaultNow(),
        createdAt: timestamp("created_at", { withTimezone: false })
            .notNull()
            .$defaultFn(() => new Date())
    },
    (table) => [
        index("contract_client_idx").on(table.clientId),
        index("contract_freelancer_idx").on(table.freelancerId)
    ]
)

export type Contract = Static<typeof Contract>
export const Contract = Type.Object({
    id: UUID,
    jobId: UUID,
    proposalId: UUID,
    clientId: UUID,
    freelancerId: UUID,
    amount: amount,
    status: Type.Union([
        Type.Literal("payment-required"),
        Type.Literal("active"),
        Type.Literal("completed"),
        Type.Literal("cancelled")
    ]),
    completedAt: Nullable(Type.String({ format: "date-time" })),
    startDate: Nullable(Type.String({ format: "date-time" })),
    createdAt: Type.String({ format: "date-time" })
})
