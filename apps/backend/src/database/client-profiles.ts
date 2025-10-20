import { pgTable, text, integer, timestamp, decimal, uuid } from "drizzle-orm/pg-core"
import { users } from "./users"
import { v7 } from "uuid"

export const clientProfiles = pgTable("client_profiles", {
    id: uuid("id")
        .primaryKey()
        .$defaultFn(() => v7()),
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" })
        .unique(),
    companyName: text("company_name"),
    industry: text("industry"),
    totalJobsPosted: integer("total_jobs_posted").default(0),
    rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
    createdAt: timestamp("created_at").defaultNow().notNull()
})
