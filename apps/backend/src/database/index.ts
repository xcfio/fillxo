import { drizzle } from "drizzle-orm/postgres-js"
import { notifications } from "./notifications"
import { contracts } from "./contracts"
import { proposals } from "./proposals"
import { payments } from "./payments"
import { messages } from "./messages"
import { reviews } from "./reviews"
import { users } from "./users"
import { jobs } from "./jobs"
import postgres from "postgres"

export const db = drizzle({ client: postgres(process.env.DATABASE_URI) })
export const table = {
    contracts,
    jobs,
    messages,
    notifications,
    payments,
    proposals,
    reviews,
    users
} as const
