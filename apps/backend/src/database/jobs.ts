import { pgTable, boolean, text, integer, timestamp, decimal, uuid } from "drizzle-orm/pg-core"
import { users } from "./users"
import { v7 } from "uuid"

export const jobs = pgTable("jobs", {
    id: uuid("id")
        .primaryKey()
        .$defaultFn(() => v7()),
    clientId: uuid("client_id")
        .notNull()
        .references(() => users.id),
    title: text("title").notNull(),
    description: text("description").notNull(),
    category: text("category").notNull(),
    skills: text("skills").array().default([]),
    budget: decimal("budget", { precision: 10, scale: 2 }).notNull(),
    isOpen: boolean("is_open").notNull().default(true),
    closedAt: timestamp("closed_at").notNull(),
    proposalCount: integer("proposal_count").default(0),
    createdAt: timestamp("created_at").defaultNow().notNull()
})
