import { CreateError, isFastifyError } from "../../function"
import { ErrorResponse, User } from "../../type"
import { db, table } from "../../database"
import { main } from "../.."
import { eq, or } from "drizzle-orm"
import Type from "typebox"

export default function Update(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.route({
        method: "PATCH",
        url: "/users/me",
        config: {
            rateLimit: {
                max: 5,
                timeWindow: 3600000,
                groupId: "Auth"
            }
        },
        schema: {
            description: "Update user profile information",
            tags: ["User"],
            body: Type.Partial(
                Type.Pick(User, ["name", "avatar", "phone", "country", "timezone", "client", "freelancer"])
            ),
            response: {
                200: Type.Object({ success: Type.Boolean() }),
                400: ErrorResponse(400, "Invalid input or duplicate username/email"),
                429: ErrorResponse(429, "Too many requests - rate limit exceeded"),
                500: ErrorResponse(500, "Internal server error")
            }
        },
        preHandler: fastify.auth,
        handler: async (request, reply) => {
            try {
                const { id } = request.user

                await db
                    .update(table.users)
                    .set({ ...request.body, client: request.body.client, freelancer: request.body.freelancer })
                    .where(eq(table.users.id, id))

                return reply.send({ success: true })
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
