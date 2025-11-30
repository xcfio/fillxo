import { CreateError, isFastifyError, toTypeBox } from "../../function"
import { ErrorResponse, Notifications } from "../../type"
import { db, table } from "../../database"
import { main } from "../.."
import { eq, desc, and } from "drizzle-orm"
import { Type } from "typebox"

export default function MarkAllReadNotifications(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.route({
        method: "PUT",
        url: "/notifications/read-all",
        schema: {
            description: "Mark all unread notifications as read for the authenticated user",
            tags: ["Notification"],
            response: {
                200: Type.Array(Notifications),
                400: ErrorResponse(400, "Bad Request - Validation error"),
                429: ErrorResponse(429, "Too many requests - rate limit exceeded"),
                500: ErrorResponse(500, "Internal server error")
            }
        },
        preHandler: fastify.auth,
        handler: async (request, reply) => {
            try {
                const { id } = request.user

                const notification = await db
                    .update(table.notifications)
                    .set({ isRead: true })
                    .where(and(eq(table.notifications.userId, id), eq(table.notifications.isRead, false)))
                    .returning()

                return reply.status(200).send(notification.map((data) => toTypeBox(data)))
            } catch (error) {
                if (isFastifyError(error)) {
                    throw error
                } else {
                    console.trace(error)
                    throw CreateError(500, "INTERNAL_SERVER_ERROR", "Internal Server Error")
                }
            }
        }
    })
}
