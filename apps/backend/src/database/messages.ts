import { pgEnum, uuid, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { contracts } from "./contracts"
import { users } from "./users"
import { Nullable, UUID } from "../typebox"
import { Static, Type } from "typebox"
import { v7 } from "uuid"

export const MessageStatus = pgEnum("message_status", ["sent", "delivered", "read", "deleted"])
export const messages = pgTable("message", {
    id: uuid("id")
        .unique()
        .primaryKey()
        .$defaultFn(() => v7()),
    content: text("content").notNull(),
    sender: uuid("sender").references(() => users.id, { onDelete: "cascade" }),
    contracts: uuid("contracts")
        .notNull()
        .references(() => contracts.id, { onDelete: "cascade" }),
    status: MessageStatus("status").notNull().default("sent"),
    editedAt: timestamp("edited_at", { withTimezone: false }).$onUpdateFn(() => new Date()),
    createdAt: timestamp("created_at", { withTimezone: false })
        .notNull()
        .$defaultFn(() => new Date())
})

export type Message = Static<typeof Message>
export const Message = Type.Object(
    {
        id: UUID,
        content: Type.String({
            maxLength: 2000,
            description: "The text content of the message, limited to 2000 characters"
        }),
        sender: Nullable(UUID, { description: "The user ID of the sender, or null for system messages" }),
        contracts: UUID,
        status: Type.Union(
            [
                Type.Literal("sent", {
                    description: "Message has been sent but not yet delivered to recipient"
                }),
                Type.Literal("delivered", {
                    description: "Message has been successfully delivered to the recipient's device"
                }),
                Type.Literal("read", {
                    description: "Message has been opened and read by the recipient"
                }),
                Type.Literal("deleted", {
                    description: "Message has been deleted by sender or recipient"
                })
            ],
            {
                description:
                    "Message delivery and read status tracking the lifecycle of a message from sending to final state"
            }
        ),
        createdAt: Type.String({
            format: "date-time",
            description: "ISO timestamp when the message was first created"
        }),
        editedAt: Type.Union([
            Type.String({
                format: "date-time",
                description: "ISO timestamp of when the message was last edited"
            }),
            Type.Null({
                description: "Indicates the message has never been edited"
            })
        ])
    },
    {
        description: "Schema for a message entity representing communication between users"
    }
)
