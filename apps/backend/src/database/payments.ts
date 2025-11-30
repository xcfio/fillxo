import { pgTable, uuid, timestamp, text, bigint, boolean, index, pgEnum } from "drizzle-orm/pg-core"
import { UUID, Nullable } from "../typebox"
import { proposals } from "./proposals"
import { users } from "./users"
import { Type, Static } from "typebox"
import { v7 } from "uuid"

export const paymentMethodEnum = pgEnum("payment_method", ["mcash", "bkash", "rocket"])
export const paymentStatusEnum = pgEnum("payment_status", ["pending", "verified", "rejected", "refunded"])

export const payments = pgTable(
    "payments",
    {
        id: uuid("id")
            .primaryKey()
            .$defaultFn(() => v7()),
        proposalId: uuid("proposal_id")
            .notNull()
            .references(() => proposals.id, { onDelete: "cascade" }),
        clientId: uuid("client_id")
            .notNull()
            .references(() => users.id),
        freelancerId: uuid("freelancer_id")
            .notNull()
            .references(() => users.id),
        amount: bigint("amount", { mode: "number" }).notNull(),
        paymentMethod: paymentMethodEnum("payment_method").notNull(),
        transactionId: text("transaction_id").notNull(),
        notes: text("notes"),
        status: paymentStatusEnum("status").notNull().default("pending"),
        verifiedBy: uuid("verified_by").references(() => users.id),
        verifiedAt: timestamp("verified_at"),
        isPaidOut: boolean("is_paid_out").notNull().default(false),
        paidOutAt: timestamp("paid_out_at"),
        createdAt: timestamp("created_at", { withTimezone: false })
            .notNull()
            .$defaultFn(() => new Date())
    },
    (table) => [index("payments_proposal_idx").on(table.proposalId), index("payments_status_idx").on(table.status)]
)

export type Payments = Static<typeof Payments>
export const Payments = Type.Object({
    id: UUID,
    proposalId: UUID,
    amount: Type.Integer({ minimum: 100 }),
    paymentMethod: Type.Union([Type.Literal("bkash"), Type.Literal("mcash"), Type.Literal("rocket")]),
    transactionId: Type.String({ minLength: 5, maxLength: 50 }),
    notes: Nullable(Type.String({ maxLength: 500 })),
    status: Type.Union([
        Type.Literal("pending"),
        Type.Literal("verified"),
        Type.Literal("rejected"),
        Type.Literal("refunded")
    ]),
    isPaidOut: Type.Boolean({ default: false }),
    verifiedBy: Nullable(UUID),
    verifiedAt: Nullable(Type.String({ format: "date-time" })),
    paidOutAt: Nullable(Type.String({ format: "date-time" })),
    createdAt: Type.String({ format: "date-time" })
})
