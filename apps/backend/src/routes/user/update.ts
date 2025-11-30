import { CreateError, isFastifyError, toTypeBox } from "../../function"
import { ErrorResponse, User } from "../../type"
import { db, table } from "../../database"
import { main } from "../../"
import { eq } from "drizzle-orm"
import { Type } from "typebox"

export default function Update(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.route({
        method: "PATCH",
        url: "/users/me",
        schema: {
            description: "Update user profile information",
            tags: ["User"],
            body: Type.Partial(
                Type.Pick(User, ["name", "gender", "avatar", "phone", "country", "timezone", "client", "freelancer"])
            ),
            response: {
                200: User,
                400: ErrorResponse(400, "Invalid input or duplicate username/email"),
                429: ErrorResponse(429, "Too many requests - rate limit exceeded"),
                500: ErrorResponse(500, "Internal server error")
            }
        },
        preHandler: fastify.auth,
        handler: async (request, reply) => {
            try {
                const { id } = request.user

                const [user] = await db
                    .update(table.users)
                    .set({ ...request.body, client: request.body.client, freelancer: request.body.freelancer })
                    .where(eq(table.users.id, id))
                    .returning()

                return reply.send(toTypeBox(user))
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
