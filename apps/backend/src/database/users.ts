import { sql } from "drizzle-orm"
import { uuid, pgTable, text, timestamp, pgEnum, char, check } from "drizzle-orm/pg-core"
import { Type, Static } from "typebox"
import { v7 } from "uuid"

export const Role = pgEnum("user_role", ["freelancer", "client", "both"])

export const users = pgTable(
    "users",
    {
        id: uuid("id")
            .primaryKey()
            .$defaultFn(() => v7()),
        email: text("email").notNull().unique(),
        username: text("username").unique().notNull(),
        name: text("name").notNull(),
        avatar: text("avatar"),
        bio: text("bio"),
        password: char("password", { length: 64 }).notNull(),
        role: Role("role").notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .notNull()
            .$defaultFn(() => new Date())
    },
    (table) => [check("password_length_check", sql`length(${table.password}) = 64`)]
)

export type User = Static<typeof User>
export const User = Type.Object(
    {
        id: Type.String({
            examples: [v7()],
            pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$",
            description: "Unique identifier for the user"
        }),
        email: Type.String({
            format: "email",
            pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
            description: "User's email address",
            examples: ["user@example.com"]
        }),
        username: Type.String({
            minLength: 3,
            maxLength: 20,
            pattern: "^[a-zA-Z0-9_-]+$",
            description: "Unique username (3-20 characters, letters, numbers, underscores, and hyphens)",
            examples: ["john_doe"]
        }),
        name: Type.String({
            minLength: 2,
            maxLength: 100,
            description: "User's full name",
            examples: ["John Doe"]
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
        bio: Type.Union([Type.String(), Type.Null()]),
        role: Type.Union([Type.Literal("freelancer"), Type.Literal("client"), Type.Literal("both")]),
        createdAt: Type.String({ format: "date-time", description: "ISO timestamp of when user account was created" }),
        updatedAt: Type.String({
            format: "date-time",
            description: "ISO timestamp of when user account was last updated"
        })
    },
    {
        description: "User profile information"
    }
)
