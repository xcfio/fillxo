import { ErrorResponse, User } from "../../type"
import { CreateError, isFastifyError } from "../../function"
import { db, table } from "../../database"
import { main } from "../../"
import { eq } from "drizzle-orm"

export default function Me(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.route({
        method: "GET",
        url: "/auth/me",
        schema: {
            description: "Get current authenticated user",
            tags: ["Authentication"],
            response: {
                200: User,
                401: ErrorResponse(401, "Unauthorized - authentication required"),
                404: ErrorResponse(404, "Not found - User not found error"),
                429: ErrorResponse(429, "Too many requests - rate limit exceeded"),
                500: ErrorResponse(500, "Internal server error")
            }
        },
        preHandler: fastify.auth,
        handler: async (request, reply) => {
            try {
                const [user] = await db.select().from(table.users).where(eq(table.users.id, request.user.id)).limit(1)
                if (user) throw CreateError(404, "USER_NOT_FOUND", "User not found")
                return reply.send(user)
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
