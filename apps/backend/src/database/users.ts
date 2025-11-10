import { uuid, pgTable, text, timestamp, pgEnum, char, check, boolean, jsonb } from "drizzle-orm/pg-core"
import { Type, Static } from "typebox"
import { sql } from "drizzle-orm"
import { v7 } from "uuid"

export const Role = pgEnum("role", ["freelancer", "client"])
export const Privilege = pgEnum("privilege", ["moderator", "admin"])

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
        phone: text("phone").notNull(),
        phoneVerified: boolean("phone_verified").notNull().default(false),
        password: char("password", { length: 64 }).notNull(),
        role: Role("role").notNull(),
        privilege: Privilege("privilege"),
        isBanned: boolean("is_banned").notNull().default(false),
        country: text("country"),
        timezone: text("timezone"),
        rating: jsonb("rating").$type<{ id: string; review: 1 | 2 | 3 | 4 | 5; comment?: string }>(),
        client: jsonb("client").$type<{ companyName?: string; industry?: string }>(),
        freelancer: jsonb("freelancer").$type<{
            title?: string
            bio?: string
            skills?: Array<string>
            portfolio?: Array<{ title: string; description: string; images: string; link: string }>
        }>(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .notNull()
            .$onUpdateFn(() => new Date())
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
            pattern: "^[a-zA-Z][a-zA-Z0-9_-]*$",
            description:
                "Unique username (3-20 characters, must start with a letter, can contain letters, numbers, underscores, and hyphens)",
            examples: ["cool_cake"]
        }),
        name: Type.String({
            minLength: 2,
            maxLength: 100,
            description: "User's full name",
            examples: ["Cool Cake"]
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
        phone: Type.String({
            pattern: "^\\+[1-9]\\d{1,14}$",
            description: "User's phone number in E.164 format (e.g., +1234567890)",
            examples: ["+1234567890"]
        }),
        phoneVerified: Type.Boolean({
            description: "Whether the user's phone number has been verified"
        }),
        role: Type.Union([Type.Literal("freelancer"), Type.Literal("client")], {
            description: "User's role on the platform"
        }),
        privilege: Type.Union([Type.Literal("moderator"), Type.Literal("admin"), Type.Null()], {
            description: "User's privilege level for staff access (null for regular users)"
        }),
        isBanned: Type.Boolean({
            description: "Whether the user account is banned"
        }),
        country: Type.Union(
            [
                Type.String({
                    minLength: 2,
                    maxLength: 2,
                    pattern: "^[A-Z]{2}$",
                    description: "ISO 3166-1 alpha-2 country code (e.g., US, GB, CA)",
                    examples: ["US", "GB", "CA"]
                }),
                Type.Null({
                    description: "Null if no country is set"
                })
            ],
            {
                description: "User's country (optional, ISO 3166-1 alpha-2 code)"
            }
        ),
        timezone: Type.Union(
            [
                Type.String({
                    description: "User's timezone in IANA format (e.g., America/New_York, Europe/London)",
                    examples: ["America/New_York", "Europe/London", "Asia/Tokyo"]
                }),
                Type.Null({
                    description: "Null if no timezone is set"
                })
            ],
            {
                description: "User's timezone (optional, IANA timezone format)"
            }
        ),
        rating: Type.Union(
            [
                Type.Object({
                    id: Type.String({ description: "ID of the reviewer" }),
                    review: Type.Union([
                        Type.Literal(1),
                        Type.Literal(2),
                        Type.Literal(3),
                        Type.Literal(4),
                        Type.Literal(5)
                    ]),
                    comment: Type.Optional(Type.String({ description: "Optional review comment" }))
                }),
                Type.Null()
            ],
            {
                description: "User's rating information (optional)"
            }
        ),
        client: Type.Union(
            [
                Type.Object({
                    companyName: Type.Optional(Type.String({ description: "Client's company name" })),
                    industry: Type.Optional(Type.String({ description: "Client's industry" }))
                }),
                Type.Null()
            ],
            {
                description: "Client profile information (optional, only for clients)"
            }
        ),
        freelancer: Type.Union(
            [
                Type.Object({
                    title: Type.Optional(Type.String({ description: "Professional title" })),
                    bio: Type.Optional(Type.String({ description: "Professional bio" })),
                    skills: Type.Optional(Type.Array(Type.String(), { description: "Array of skill names" })),
                    portfolio: Type.Optional(
                        Type.Array(
                            Type.Object({
                                title: Type.String({ description: "Portfolio project title" }),
                                description: Type.String({ description: "Portfolio project description" }),
                                images: Type.String({ description: "Portfolio project image URL" }),
                                link: Type.String({ description: "Portfolio project link" })
                            }),
                            { description: "Array of portfolio items" }
                        )
                    )
                }),
                Type.Null()
            ],
            {
                description: "Freelancer profile information (optional, only for freelancers)"
            }
        ),
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
