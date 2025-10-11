import { uuid, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import Type, { Static } from "typebox"
import { v7 } from "uuid"

export const user = pgTable("user", {
    id: uuid("id")
        .unique()
        .primaryKey()
        .$defaultFn(() => v7()),
    token: text("token").notNull(),
    type: text("type").notNull().$type<"client" | "worker" | "supporter">(),
    email: text("email").notNull().unique(),
    username: text("username").notNull().unique(),
    name: text("name").notNull(),
    avatar: text("avatar"),
    createdAt: timestamp("created_at", { withTimezone: false }).notNull().defaultNow()
})

export type User = Static<typeof User>
export const User = Type.Object(
    {
        id: Type.String({
            examples: [v7()],
            pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$",
            description: "Unique identifier for the user"
        }),
        type: Type.Union([[Type.Literal("client"), Type.Literal("worker"), Type.Literal("supporter")]]),
        email: Type.String({
            examples: ["me@example.com"],
            pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
            description: "User's email address"
        }),
        username: Type.String({
            description: "Unique username for the user account"
        }),
        name: Type.String({
            description: "User's display name"
        }),
        avatar: Type.Union(
            [
                Type.String({
                    examples: ["https://avatars.githubusercontent.com/u/119097812"],
                    pattern: "^https?://.+",
                    description: "URL to the user's avatar image if it exists"
                }),
                Type.Null({
                    description: "Null if no avatar is set"
                })
            ],
            {
                description: "User's avatar image (optional)"
            }
        ),
        createdAt: Type.String({
            format: "date-time",
            description: "ISO timestamp of when user account was created"
        })
    },
    {
        description: "User profile information"
    }
)
