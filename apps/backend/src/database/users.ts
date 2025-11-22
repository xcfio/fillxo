import { uuid, pgTable, text, timestamp, pgEnum, char, check, boolean, jsonb } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"
import { v7 } from "uuid"

export const Role = pgEnum("role", ["freelancer", "client"])
export const Privilege = pgEnum("privilege", ["moderator", "admin"])
export const Gender = pgEnum("gender", ["male", "female", "other"])

export const users = pgTable(
    "users",
    {
        id: uuid("id")
            .primaryKey()
            .$defaultFn(() => v7()),
        email: text("email").notNull().unique(),
        username: text("username").unique().notNull(),
        name: text("name").notNull(),
        gender: Gender("gender").notNull(),
        avatar: text("avatar"),
        phone: text("phone").notNull(),
        phoneVerified: boolean("phone_verified").notNull().default(false),
        password: char("password", { length: 64 }).notNull(),
        role: Role("role").notNull(),
        privilege: Privilege("privilege"),
        isBanned: boolean("is_banned").notNull().default(false),
        country: text("country"),
        rating: jsonb("rating").$type<{ id: string; review: 1 | 2 | 3 | 4 | 5; comment?: string }>(),
        client: jsonb("client").$type<{ companyName?: string; industry?: string }>(),
        freelancer: jsonb("freelancer").$type<{
            title?: string
            bio?: string
            skills?: Array<string>
            portfolio?: Array<{ title: string; description: string; images?: string; link?: string }>
        }>(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at", { withTimezone: false })
            .notNull()
            .$onUpdateFn(() => new Date())
    },
    (table) => [check("password_length_check", sql`length(${table.password}) = 64`)]
)
