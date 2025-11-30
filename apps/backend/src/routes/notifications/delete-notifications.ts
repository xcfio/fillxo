import { CreateError, isFastifyError, toTypeBox } from "../../function"
import { ErrorResponse, Notifications } from "../../type"
import { db, table } from "../../database"
import { main } from "../.."
import { eq } from "drizzle-orm"
import { Type } from "typebox"
import { UUID } from "../../typebox"

export default function DeleteNotifications(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.route({
        method: "DELETE",
        url: "/notifications/:id",
        schema: {
            description: "Delete a notification by ID",
            tags: ["Notification"],
            params: Type.Object({ id: UUID }),
            response: {
                200: Type.Object({ success: Type.Boolean() }),
                400: ErrorResponse(400, "Bad Request - Validation error"),
                403: ErrorResponse(403, "Forbidden - You do not have permission to delete this notification"),
                404: ErrorResponse(404, "Not Found - Notification not found"),
                429: ErrorResponse(429, "Too many requests - rate limit exceeded"),
                500: ErrorResponse(500, "Internal server error")
            }
        },
        preHandler: fastify.auth,
        handler: async (request, reply) => {
            try {
                const { id: userId } = request.user
                const { id } = request.params

                const [nct] = await db.select().from(table.notifications).where(eq(table.notifications.id, id))
                if (!nct) throw CreateError(404, "NOTIFICATION_NOT_FOUND", "Notification not found")

                if (nct.userId !== userId) {
                    throw CreateError(403, "FORBIDDEN", "You do not have permission to delete this notification")
                }

                await db.delete(table.notifications).where(eq(table.notifications.id, id))
                return reply.status(200).send({ success: true })
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
