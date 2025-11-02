import { pgTable, pgEnum, text, integer, timestamp, decimal, uuid, index } from "drizzle-orm/pg-core"
import { users } from "./users"
import { jobs } from "./jobs"
import { v7 } from "uuid"

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
    bidAmount: decimal("bid_amount", { precision: 10, scale: 2 }).notNull(),
    deliveryDays: integer("delivery_days").notNull(),
    status: ProposalStatus("status").default("pending"),
    createdAt: timestamp("created_at").defaultNow().notNull()
})
