import { pgTable, text, boolean, timestamp, uuid, index } from "drizzle-orm/pg-core"
import { users } from "./users"
import { v7 } from "uuid"

export const messages = pgTable(
    "messages",
    {
        id: uuid("id")
            .primaryKey()
            .$defaultFn(() => v7()),
        senderId: uuid("sender_id")
            .notNull()
            .references(() => users.id),
        receiverId: uuid("receiver_id")
            .notNull()
            .references(() => users.id),
        content: text("content").notNull(),
        isRead: boolean("is_read").default(false),
        createdAt: timestamp("created_at").defaultNow().notNull()
    },
    (table) => [index("message_sender_idx").on(table.senderId), index("message_receiver_idx").on(table.receiverId)]
)
