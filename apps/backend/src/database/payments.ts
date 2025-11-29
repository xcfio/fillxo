import { pgTable, uuid, timestamp, text, bigint, boolean, index } from "drizzle-orm/pg-core"
import { users } from "./users"
import { jobs } from "./jobs"
import { proposals } from "./proposals"
import { Type, Static } from "typebox"
import { v7 } from "uuid"

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
        clientId: uuid("client_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        freelancerId: uuid("freelancer_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        amount: bigint("amount", { mode: "number" }).notNull(),
        paymentMethod: text("payment_method").notNull(),
        transactionId: text("transaction_id").notNull(),
        senderNumber: text("sender_number"),
        receiverNumber: text("receiver_number").notNull(),
        proofUrl: text("proof_url"),
        notes: text("notes"),
        status: text("status").notNull().default("pending"),
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

export const PaymentMethodSchema = Type.Union([
    Type.Literal("bkash"),
    Type.Literal("nagad"),
    Type.Literal("rocket"),
    Type.Literal("bank")
])

export const PaymentStatusSchema = Type.Union([
    Type.Literal("pending"),
    Type.Literal("verified"),
    Type.Literal("rejected"),
    Type.Literal("refunded")
])

export const SubmitPaymentSchema = Type.Object({
    proposalId: Type.String({ format: "uuid" }),
    paymentMethod: PaymentMethodSchema,
    transactionId: Type.String({ minLength: 5, maxLength: 50 }),
    senderNumber: Type.Optional(Type.String({ pattern: "^\\+?[1-9]\\d{1,14}$" })),
    receiverNumber: Type.String({ pattern: "^\\+?[1-9]\\d{1,14}$" }),
    proofUrl: Type.Optional(Type.String({ format: "uri" })),
    notes: Type.Optional(Type.String({ maxLength: 500 }))
})

export const VerifyPaymentSchema = Type.Object({
    paymentId: Type.String({ format: "uuid" }),
    status: Type.Union([Type.Literal("verified"), Type.Literal("rejected")]),
    rejectionReason: Type.Optional(Type.String({ maxLength: 500 }))
})

export const MarkPaidOutSchema = Type.Object({
    paymentId: Type.String({ format: "uuid" })
})

export const GetPaymentsQuerySchema = Type.Object({
    status: Type.Optional(PaymentStatusSchema),
    clientId: Type.Optional(Type.String({ format: "uuid" })),
    freelancerId: Type.Optional(Type.String({ format: "uuid" })),
    jobId: Type.Optional(Type.String({ format: "uuid" })),
    limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 100, default: 20 })),
    offset: Type.Optional(Type.Integer({ minimum: 0, default: 0 }))
})

export type SubmitPayment = Static<typeof SubmitPaymentSchema>
export type VerifyPayment = Static<typeof VerifyPaymentSchema>
export type MarkPaidOut = Static<typeof MarkPaidOutSchema>
export type GetPaymentsQuery = Static<typeof GetPaymentsQuerySchema>
