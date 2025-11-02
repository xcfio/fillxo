import { pgTable, text, timestamp, decimal, uuid } from "drizzle-orm/pg-core"
import { users } from "./users"

export const client = pgTable("client", {
    id: uuid("id")
        .primaryKey()
        .references(() => users.id, { onDelete: "cascade" }),
    companyName: text("company_name"),
    industry: text("industry"),
    rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
    createdAt: timestamp("created_at").defaultNow().notNull()
})
