import { db, table } from "../database"

export async function SendNotification(userId: string, title: string, message: string, link?: string) {
    return (await db.insert(table.notifications).values({ userId, title, message, link }).returning())[0]
}
