import { pgTable, text, timestamp, integer, decimal, jsonb, uuid } from "drizzle-orm/pg-core"
import { users } from "./users"

export const freelancer = pgTable("freelancer", {
    id: uuid("id")
        .primaryKey()
        .references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    skills: text("skills").array().default([]),
    bio: text("bio"),
    portfolio: jsonb("portfolio")
        .default([])
        .$type<Array<{ title: string; description: string; images: string; link: string }>>(),
    rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
    jobsCompleted: integer("jobs_completed").default(0),
    createdAt: timestamp("created_at").defaultNow().notNull()
})
