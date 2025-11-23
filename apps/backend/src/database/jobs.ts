import { pgTable, boolean, text, integer, timestamp, decimal, uuid } from "drizzle-orm/pg-core"
import { Static } from "typebox"
import { v7 } from "uuid"
import { users } from "./users"
import { UUID } from "../type"
import Type from "typebox"

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
    skills: text("skills").array().notNull().default([]),
    budget: decimal("budget", { precision: 10, scale: 2 }).notNull(),
    isOpen: boolean("is_open").notNull().default(true),
    closedAt: timestamp("closed_at").notNull(),
    proposalCount: integer("proposal_count").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow().notNull()
})

export type Job = Static<typeof Job>
export const Job = Type.Object({
    id: UUID,
    clientId: UUID,
    title: Type.String(),
    description: Type.String(),
    category: Type.String(),
    skills: Type.Array(Type.String(), { default: [] }),
    budget: Type.String(),
    isOpen: Type.Boolean({ default: true }),
    closedAt: Type.String({ format: "date-time" }),
    proposalCount: Type.Integer({ default: 0 }),
    createdAt: Type.String({ format: "date-time" })
})
