import { db, table } from "../database"
import { io } from "../"

export async function SendNotification(userId: string, title: string, message: string, link?: string) {
    const [notification] = await db.insert(table.notifications).values({ userId, title, message, link }).returning()

    if (io) {
        io.to(userId).emit("notification_created", {
            id: notification.id,
            userId: notification.userId,
            title: notification.title,
            message: notification.message,
            link: notification.link,
            isRead: notification.isRead,
            createdAt: notification.createdAt.toISOString()
        })
    }

    return notification
}
