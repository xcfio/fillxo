import { CreateError, isFastifyError, HmacPassword, toTypeBox } from "../../function"
import { ErrorResponse, Payload, User } from "../../type"
import { db, table } from "../../database"
import { main } from "../../"
import { timingSafeEqual } from "node:crypto"
import { eq, or } from "drizzle-orm"
import Type from "typebox"

export default function Login(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.route({
        method: "POST",
        url: "/auth/login",
        schema: {
            description: "Authenticate user and initiate a session",
            tags: ["Authentication"],
            body: Type.Object({
                input: Type.String(),
                password: Type.String(),
                remember: Type.Optional(Type.Boolean())
            }),
            response: {
                200: User,
                403: ErrorResponse(403, "Forbidden - Incorrect username/email or password"),
                404: ErrorResponse(404, "Not Found - User Not found"),
                429: ErrorResponse(429, "Too many requests - rate limit exceeded"),
                500: ErrorResponse(500, "Internal server error")
            }
        },
        handler: async (request, reply) => {
            try {
                const { input, password, remember } = request.body

                const [user] = await db
                    .select()
                    .from(table.users)
                    .where(or(eq(table.users.email, input), eq(table.users.username, input)))

                if (!user) {
                    throw CreateError(404, "USER_NOT_FOUND", "User not found")
                }

                if (!timingSafeEqual(Buffer.from(user.password), Buffer.from(HmacPassword(password)))) {
                    throw CreateError(403, "INCORRECT_INPUTTED_DATA", "Incorrect username/email or password")
                }

                const exp = remember ? 30 * 24 * 60 * 60 : 24 * 60 * 60
                const payload: Payload = {
                    id: user.id,
                    iat: Math.floor(Date.now() / 1000),
                    exp: Math.floor(Date.now() / 1000) + exp
                }

                const jwt = fastify.jwt.sign(payload)
                reply.setCookie("auth", jwt, {
                    signed: true,
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    maxAge: exp,
                    path: "/"
                })

                return reply.status(200).send(toTypeBox(user))
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
