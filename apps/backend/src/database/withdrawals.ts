import { pgTable, uuid, timestamp, text, bigint, index, pgEnum } from "drizzle-orm/pg-core"
import { UUID, Nullable } from "../typebox"
import { users } from "./users"
import { Type, Static } from "typebox"
import { v7 } from "uuid"
import { paymentMethodEnum, payments } from "./payments"
import { contracts } from "./contracts"

export const withdrawalStatusEnum = pgEnum("withdrawal_status", ["pending", "processing", "completed", "rejected"])

export const withdrawals = pgTable(
    "withdrawals",
    {
        id: uuid("id")
            .primaryKey()
            .$defaultFn(() => v7()),
        freelancerId: uuid("freelancer_id")
            .notNull()
            .references(() => users.id),
        contractsId: uuid("contracts_id")
            .notNull()
            .references(() => contracts.id),
        paymentId: uuid("payment_id")
            .notNull()
            .references(() => payments.id),
        amount: bigint("amount", { mode: "number" }).notNull(),
        paymentMethod: paymentMethodEnum("payment_method").notNull(),
        accountNumber: text("account_number").notNull(),
        status: withdrawalStatusEnum("status").notNull().default("pending"),
        rejectReason: text("reject_reason"),
        notes: text("notes"),
        processedBy: uuid("processed_by").references(() => users.id),
        processedAt: timestamp("processed_at"),
        transactionId: text("transaction_id"),
        createdAt: timestamp("created_at", { withTimezone: false })
            .notNull()
            .$defaultFn(() => new Date())
    },
    (table) => [
        index("withdrawals_freelancer_idx").on(table.freelancerId),
        index("withdrawals_contracts_idx").on(table.contractsId),
        index("withdrawals_payments_idx").on(table.paymentId),
        index("withdrawals_status_idx").on(table.status)
    ]
)

// TypeBox schema
export type Withdrawal = Static<typeof Withdrawal>
export const Withdrawal = Type.Object({
    id: UUID,
    freelancerId: UUID,
    amount: Type.Integer({ minimum: 1000 }), // Minimum 1000 cents = $10
    paymentMethod: Type.Union([Type.Literal("bkash"), Type.Literal("mcash"), Type.Literal("rocket")]),
    accountNumber: Type.String({ minLength: 11, maxLength: 11, pattern: "^01[0-9]{9}$" }), // BD phone format
    status: Type.Union([
        Type.Literal("pending"),
        Type.Literal("processing"),
        Type.Literal("completed"),
        Type.Literal("rejected")
    ]),
    rejectReason: Nullable(Type.String()),
    notes: Nullable(Type.String()),
    transactionId: Nullable(Type.String()),
    processedBy: Nullable(UUID),
    processedAt: Nullable(Type.String({ format: "date-time" })),
    createdAt: Type.String({ format: "date-time" })
})
