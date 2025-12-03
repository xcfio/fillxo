import { pgTable, uuid, timestamp, text, bigint, boolean, index, pgEnum } from "drizzle-orm/pg-core"
import { UUID, Nullable } from "../typebox"
import { contracts } from "./contracts"
import { users } from "./users"
import { Type, Static } from "typebox"
import { v7 } from "uuid"
import { jobs } from "./jobs"
import { proposals } from "./proposals"
import { numeric } from "drizzle-orm/pg-core"

export const paymentMethodEnum = pgEnum("payment_method", ["mcash", "bkash", "rocket"])
export const paymentStatusEnum = pgEnum("payment_status", ["pending", "verified", "rejected", "paid_out", "refunded"])

export const payments = pgTable(
    "payments",
    {
        id: uuid("id")
            .primaryKey()
            .$defaultFn(() => v7()),
        jobId: uuid("job_id")
            .notNull()
            .references(() => jobs.id, { onDelete: "cascade" }),
        proposalId: uuid("proposal_id")
            .notNull()
            .references(() => proposals.id, { onDelete: "cascade" }),
        contractId: uuid("contract_id")
            .notNull()
            .references(() => contracts.id, { onDelete: "cascade" }),
        clientId: uuid("client_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        freelancerId: uuid("freelancer_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        amount: bigint("amount", { mode: "number" }).notNull(),
        rate: numeric("rate", { mode: "number" }).notNull(),
        transactionId: text("transaction_id").notNull(),
        senderNumber: text("sender_number").notNull(),
        receiverNumber: text("receiver_number").notNull(),
        paymentMethod: paymentMethodEnum("payment_method").notNull(),
        payoutMethod: paymentMethodEnum("payout_method").notNull(),
        proofUrl: text("proof_url"),
        notes: text("notes"),
        status: paymentStatusEnum("status").notNull().default("pending"),
        verifiedBy: uuid("verified_by").references(() => users.id),
        verifiedAt: timestamp("verified_at"),
        rejectionReason: text("rejection_reason"),
        isPaidOut: boolean("is_paid_out").notNull().default(false),
        paidOutAt: timestamp("paid_out_at"),
        paidOutBy: uuid("paid_out_by").references(() => users.id),
        createdAt: timestamp("created_at", { withTimezone: false })
            .notNull()
            .$defaultFn(() => new Date()),
        updatedAt: timestamp("updated_at", { withTimezone: false })
            .notNull()
            .$onUpdateFn(() => new Date())
    },
    (table) => [
        index("payments_client_idx").on(table.clientId),
        index("payments_freelancer_idx").on(table.freelancerId),
        index("payments_status_idx").on(table.status),
        index("payments_job_idx").on(table.jobId)
    ]
)

export type Payments = Static<typeof Payments>
export const Payments = Type.Object({
    id: UUID,
    jobId: UUID,
    proposalId: UUID,
    contractId: UUID,
    clientId: UUID,
    freelancerId: UUID,
    amount: Type.Integer({
        minimum: 100,
        description: "Amount in cents"
    }),
    rate: Type.Number({
        minimum: 0,
        description: "Exchange rate at the time of payment"
    }),
    transactionId: Type.String({ minLength: 5, maxLength: 50 }),
    senderNumber: Type.String({ pattern: "^\\+?[1-9]\\d{1,14}$" }),
    receiverNumber: Type.String({ pattern: "^\\+?[1-9]\\d{1,14}$" }),
    paymentMethod: Type.Union([Type.Literal("mcash"), Type.Literal("bkash"), Type.Literal("rocket")]),
    payoutMethod: Type.Union([Type.Literal("mcash"), Type.Literal("bkash"), Type.Literal("rocket")]),
    proofUrl: Nullable(Type.String({ format: "uri" })),
    notes: Nullable(Type.String({ maxLength: 500 })),
    status: Type.Union([
        Type.Literal("pending"),
        Type.Literal("verified"),
        Type.Literal("rejected"),
        Type.Literal("paid_out"),
        Type.Literal("refunded")
    ]),
    verifiedBy: Nullable(UUID),
    verifiedAt: Nullable(Type.String({ format: "date-time" })),
    rejectionReason: Nullable(Type.String({ maxLength: 500 })),
    isPaidOut: Type.Boolean({ default: false }),
    paidOutAt: Nullable(Type.String({ format: "date-time" })),
    paidOutBy: Nullable(UUID),
    createdAt: Type.String({ format: "date-time" }),
    updatedAt: Type.String({ format: "date-time" })
})
