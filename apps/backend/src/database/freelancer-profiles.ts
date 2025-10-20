import { pgTable, text, integer, timestamp, decimal, jsonb, uuid } from "drizzle-orm/pg-core"
import { users } from "./users"
import { v7 } from "uuid"

export const freelancerProfiles = pgTable("freelancer_profiles", {
    id: uuid("id")
        .primaryKey()
        .$defaultFn(() => v7()),
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" })
        .unique(),
    title: text("title").notNull(),
    hourlyRate: decimal("hourly_rate", { precision: 10, scale: 2 }),
    skills: text("skills").array().default([]),
    bio: text("bio"),
    portfolio: jsonb("portfolio")
        .default([])
        .$type<Array<{ title: string; description: string; images: string; link: string }>>(),
    rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
    totalJobs: integer("total_jobs").default(0),
    createdAt: timestamp("created_at").defaultNow().notNull()
})
