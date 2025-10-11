import { drizzle } from "drizzle-orm/postgres-js"
import { user } from "./user"
import postgres from "postgres"

export const db = drizzle({ client: postgres(process.env.DATABASE_URI) })
export const table = { user } as const
