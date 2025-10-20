import { pgTable, text, boolean, timestamp, uuid, index } from "drizzle-orm/pg-core"
import { users } from "./users"
import { v7 } from "uuid"

export const notifications = pgTable(
    "notifications",
    {
        id: uuid("id")
            .primaryKey()
            .$defaultFn(() => v7()),
        userId: uuid("user_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        title: text("title").notNull(),
        message: text("message").notNull(),
        link: text("link"),
        isRead: boolean("is_read").default(false),
        createdAt: timestamp("created_at").defaultNow().notNull()
    },
    (table) => [index("notification_user_idx").on(table.userId)]
)
