import { notifications } from "./notifications"
import { contracts } from "./contracts"
import { proposals } from "./proposals"
import { messages } from "./messages"
import { reviews } from "./reviews"
import { users } from "./users"
import { jobs } from "./jobs"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

export const db = drizzle({ client: postgres(process.env.DATABASE_URI) })
export const table = {
    contracts,
    jobs,
    messages,
    notifications,
    proposals,
    reviews,
    users
} as const
