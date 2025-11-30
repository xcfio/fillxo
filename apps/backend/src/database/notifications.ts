import { pgTable, text, boolean, timestamp, uuid, index } from "drizzle-orm/pg-core"
import { users } from "./users"
import { v7 } from "uuid"
import { Type, Static } from "typebox"
import { UUID } from "../typebox"

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
        isRead: boolean("is_read").notNull().default(false),
        createdAt: timestamp("created_at", { withTimezone: false })
            .notNull()
            .$defaultFn(() => new Date())
    },
    (table) => [index("notification_user_idx").on(table.userId)]
)

export type Notifications = Static<typeof Notifications>
export const Notifications = Type.Object({
    id: UUID,
    userId: UUID,
    title: Type.String(),
    message: Type.String(),
    link: Type.Union([Type.String(), Type.Null()]),
    isRead: Type.Boolean({ default: false }),
    createdAt: Type.String({ format: "date-time" })
})
