import { CreateError, isFastifyError, toTypeBox } from "../../function"
import { ErrorResponse, Notifications } from "../../type"
import { db, table } from "../../database"
import { main } from "../../"
import { eq, desc, and } from "drizzle-orm"
import { Type } from "typebox"

export default function GetNotifications(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.route({
        method: "GET",
        url: "/notifications",
        schema: {
            description: "Get user notifications with pagination and filtering",
            tags: ["Notification"],
            querystring: Type.Partial(
                Type.Object({
                    isRead: Type.Boolean({ description: "Filter by read status" }),
                    page: Type.Integer({ minimum: 1, default: 1, description: "Page number" }),
                    limit: Type.Integer({
                        minimum: 1,
                        maximum: 100,
                        default: 10,
                        description: "Notifications per page"
                    })
                })
            ),
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
                const { isRead, limit = 10, page = 1 } = request.query

                const conditions = [eq(table.notifications.userId, id)]
                if (isRead !== undefined) conditions.push(eq(table.notifications.isRead, isRead))

                const notification = await db
                    .select()
                    .from(table.notifications)
                    .where(and(...conditions))
                    .orderBy(desc(table.notifications.createdAt))
                    .limit(limit)
                    .offset((page - 1) * limit)

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
