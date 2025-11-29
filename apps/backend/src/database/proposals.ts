import { pgTable, pgEnum, text, integer, timestamp, bigint, uuid } from "drizzle-orm/pg-core"
import { Static, Type } from "typebox"
import { v7 } from "uuid"
import { users } from "./users"
import { amount, UUID } from "../typebox"
import { jobs } from "./jobs"

export const ProposalStatus = pgEnum("proposal", ["pending", "accepted", "rejected"])

export const proposals = pgTable("proposals", {
    id: uuid("id")
        .primaryKey()
        .$defaultFn(() => v7()),
    jobId: uuid("job_id")
        .notNull()
        .references(() => jobs.id, { onDelete: "cascade" }),
    freelancerId: uuid("freelancer_id")
        .notNull()
        .references(() => users.id),
    coverLetter: text("cover_letter").notNull(),
    bidAmount: bigint("bid_amount", { mode: "number" }).notNull(),
    deliveryDays: integer("delivery_days").notNull(),
    status: ProposalStatus("status").default("pending").notNull(),
    createdAt: timestamp("created_at", { withTimezone: false })
        .$defaultFn(() => new Date())
        .notNull()
})

const ProposalStatusEnum = Type.Union([Type.Literal("pending"), Type.Literal("accepted"), Type.Literal("rejected")], {
    description: "Proposal status"
})

export type Proposal = Static<typeof Proposal>
export const Proposal = Type.Object({
    id: UUID,
    jobId: UUID,
    freelancerId: UUID,
    coverLetter: Type.String({
        minLength: 50,
        maxLength: 2000,
        examples: ["I am interested in this project because..."],
        description: "Freelancer's cover letter"
    }),
    bidAmount: amount,
    deliveryDays: Type.Integer({
        minimum: 1,
        maximum: 365,
        examples: [7, 14, 30],
        description: "Estimated delivery time in days"
    }),
    status: ProposalStatusEnum,
    createdAt: Type.String({
        format: "date-time",
        examples: [new Date().toISOString()],
        description: "Proposal creation timestamp"
    })
})
