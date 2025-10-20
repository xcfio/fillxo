import { pgTable, text, integer, timestamp, decimal, uuid, index } from "drizzle-orm/pg-core"
import { jobStatusEnum } from "./common"
import { users } from "./users"
import { v7 } from "uuid"

export const jobs = pgTable(
    "jobs",
    {
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
        status: jobStatusEnum("status").default("open"),
        proposalCount: integer("proposal_count").default(0),
        createdAt: timestamp("created_at").defaultNow().notNull()
    },
    (table) => [index("job_client_idx").on(table.clientId), index("job_status_idx").on(table.status)]
)
