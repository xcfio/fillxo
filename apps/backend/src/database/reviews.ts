import { pgTable, uuid, timestamp, text, integer, index, pgEnum } from "drizzle-orm/pg-core"
import { UUID, Nullable } from "../typebox"
import { contracts } from "./contracts"
import { users } from "./users"
import { Type, Static } from "typebox"
import { v7 } from "uuid"

export const reviewTypeEnum = pgEnum("review_type", ["client_to_freelancer", "freelancer_to_client"])
export const StatusEnum = pgEnum("review_status", ["visible", "hidden", "deleted"])

export const reviews = pgTable(
    "reviews",
    {
        id: uuid("id")
            .primaryKey()
            .$defaultFn(() => v7()),
        contractId: uuid("contract_id")
            .notNull()
            .references(() => contracts.id, { onDelete: "cascade" }),
        reviewerId: uuid("reviewer_id")
            .notNull()
            .references(() => users.id),
        revieweeId: uuid("reviewee_id")
            .notNull()
            .references(() => users.id),
        type: reviewTypeEnum("type").notNull(),
        rating: integer("rating").notNull(),
        comment: text("comment"),
        status: StatusEnum("status").notNull().default("visible"),
        createdAt: timestamp("created_at", { withTimezone: false })
            .notNull()
            .$defaultFn(() => new Date()),
        updatedAt: timestamp("updated_at", { withTimezone: false })
    },
    (table) => [
        index("reviews_contract_idx").on(table.contractId),
        index("reviews_reviewer_idx").on(table.reviewerId),
        index("reviews_reviewee_idx").on(table.revieweeId),
        index("reviews_type_idx").on(table.type)
    ]
)

export type Review = Static<typeof Review>
export const Review = Type.Object({
    id: UUID,
    contractId: UUID,
    reviewerId: UUID,
    revieweeId: UUID,
    type: Type.Union([Type.Literal("client_to_freelancer"), Type.Literal("freelancer_to_client")]),
    rating: Type.Integer({ minimum: 1, maximum: 5 }),
    comment: Nullable(Type.String({ minLength: 10, maxLength: 1000 })),
    status: Type.Union([Type.Literal("visible"), Type.Literal("hidden"), Type.Literal("deleted")]),
    createdAt: Type.String({ format: "date-time" }),
    updatedAt: Nullable(Type.String({ format: "date-time" }))
})
