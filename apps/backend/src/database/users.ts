import { uuid, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { userRoleEnum } from "./common"
import { Static } from "typebox"
import { v7 } from "uuid"
import Type from "typebox"

export const users = pgTable("users", {
    id: uuid("id")
        .primaryKey()
        .$defaultFn(() => v7()),
    email: text("email").notNull().unique(),
    username: text("username").unique(),
    name: text("name"),
    avatar: text("avatar"),
    bio: text("bio"),
    role: userRoleEnum("role").default("freelancer"),
    githubId: text("github_id").unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull()
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
