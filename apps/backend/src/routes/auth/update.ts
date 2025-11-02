import { CreateError, isFastifyError } from "../../function"
import { ErrorResponse, User } from "../../type"
import { db, table } from "../../database"
import { main } from "../.."
import { eq, or } from "drizzle-orm"
import Type from "typebox"

export default function Update(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.route({
        method: "PATCH",
        url: "/auth/me",
        config: {
            rateLimit: {
                max: 5,
                timeWindow: 3600000,
                groupId: "Auth"
            }
        },
        schema: {
            description: "Update user profile information",
            tags: ["Authentication"],
            body: Type.Partial(Type.Omit(User, ["id", "createdAt", "isBanned", "", "updatedAt"])),
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
                const { avatar, email, name, role, username } = request.body
                const { id } = request.user

                if (!avatar && !email && !name && !role && !username) {
                    throw CreateError(400, "BAD_REQUEST", "At least one field must be provided for update")
                }

                if (email || username) {
                    const conditions = []
                    if (email) conditions.push(eq(table.users.email, email))
                    if (username) conditions.push(eq(table.users.username, username))

                    const existingUser = await db
                        .select({ id: table.users.id })
                        .from(table.users)
                        .where(or(...conditions))
                        .limit(1)

                    if (existingUser.length > 0 && existingUser[0].id !== id) {
                        throw CreateError(400, "DUPLICATE_ENTRY", "Username or email already exists")
                    }
                }

                await db
                    .update(table.users)
                    .set({ ...request.body, updatedAt: new Date() })
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
