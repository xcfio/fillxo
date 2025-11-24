import { pgTable, text, integer, timestamp, uuid } from "drizzle-orm/pg-core"
import { contracts } from "./contracts"
import { users } from "./users"
import { v7 } from "uuid"

export const reviews = pgTable("reviews", {
    id: uuid("id")
        .primaryKey()
        .$defaultFn(() => v7()),
    contractId: uuid("contract_id")
        .notNull()
        .references(() => contracts.id),
    reviewerId: uuid("reviewer_id")
        .notNull()
        .references(() => users.id),
    revieweeId: uuid("reviewee_id")
        .notNull()
        .references(() => users.id),
    rating: integer("rating").notNull(),
    comment: text("comment").notNull(),
    createdAt: timestamp("created_at", { withTimezone: false }).defaultNow().notNull()
})
