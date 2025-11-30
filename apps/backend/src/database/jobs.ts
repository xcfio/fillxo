import { pgTable, boolean, text, timestamp, bigint, uuid } from "drizzle-orm/pg-core"
import { amount, UUID } from "../typebox"
import { users } from "./users"
import { Static, Type } from "typebox"
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
    skills: text("skills").array().notNull().default([]),
    budget: bigint("budget", { mode: "number" }).notNull(),
    isOpen: boolean("is_open").notNull().default(true),
    closedAt: timestamp("closed_at", { withTimezone: false }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: false })
        .notNull()
        .$defaultFn(() => new Date())
})

export type Job = Static<typeof Job>
export const Job = Type.Object({
    id: UUID,
    clientId: UUID,
    title: Type.String(),
    description: Type.String(),
    category: Type.String(),
    skills: Type.Array(Type.String(), { default: [] }),
    budget: amount,
    isOpen: Type.Boolean({ default: true }),
    closedAt: Type.String({ format: "date-time" }),
    createdAt: Type.String({ format: "date-time" })
})
