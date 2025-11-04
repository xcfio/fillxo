import { CreateError, isFastifyError } from "../../function"
import { ErrorResponse, User } from "../../type"
import { db, table } from "../../database"
import { main } from "../.."
import { eq } from "drizzle-orm"
import Type from "typebox"

export default function Profile(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.route({
        method: "GET",
        url: "/users/:username",
        schema: {
            description: "Get user profile by username",
            tags: ["User"],
            params: Type.Object({
                username: Type.String()
            }),
            response: {
                200: Type.Object({
                    id: Type.Index(User, ["id"]),
                    username: Type.Index(User, ["username"]),
                    name: Type.Index(User, ["name"]),
                    avatar: Type.Index(User, ["avatar"]),
                    role: Type.Index(User, ["role"]),
                    country: Type.Index(User, ["country"]),
                    timezone: Type.Index(User, ["timezone"]),
                    createdAt: Type.String()
                }),
                404: ErrorResponse(404, "Not found - User not found"),
                429: ErrorResponse(429, "Too many requests - rate limit exceeded"),
                500: ErrorResponse(500, "Internal server error")
            }
        },
        handler: async (request, reply) => {
            try {
                const { username } = request.params
                const [user] = await db.select().from(table.users).where(eq(table.users.username, username))
                if (!user) throw CreateError(404, "USER_NOT_FOUND", "User not found")
                return reply.send({ ...user, createdAt: user.createdAt.toISOString() })
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
