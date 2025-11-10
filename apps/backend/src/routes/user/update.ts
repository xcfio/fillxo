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
                Type.Object({
                    avatar: Type.Index(User, ["avatar"]),
                    email: Type.Index(User, ["email"]),
                    username: Type.Index(User, ["username"]),
                    name: Type.Index(User, ["name"]),
                    phone: Type.Index(User, ["phone"]),
                    country: Type.Index(User, ["country"]),
                    timezone: Type.Index(User, ["timezone"]),
                    role: Type.Index(User, ["role"]),
                    client: Type.Partial(
                        Type.Object({
                            companyName: Type.String(),
                            industry: Type.String()
                        })
                    ),
                    freelancer: Type.Partial(
                        Type.Object({
                            title: Type.String(),
                            skills: Type.Array(Type.String()),
                            bio: Type.String(),
                            portfolio: Type.Array(
                                Type.Object({
                                    title: Type.String(),
                                    description: Type.String(),
                                    images: Type.String(),
                                    link: Type.String()
                                })
                            )
                        })
                    )
                })
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
                const { email, username } = request.body
                const { id } = request.user

                if (email || username) {
                    const [existingUser] = await db
                        .select({ id: table.users.id })
                        .from(table.users)
                        .where(
                            or(
                                email ? eq(table.users.email, email) : undefined,
                                username ? eq(table.users.username, username) : undefined
                            )
                        )

                    if (existingUser?.id !== id) {
                        throw CreateError(400, "DUPLICATE_ENTRY", "Username or email already exists")
                    }
                }

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
