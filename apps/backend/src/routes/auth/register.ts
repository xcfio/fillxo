import { CreateError, isFastifyError, HmacPassword, VerifyOTP } from "../../function"
import { ErrorResponse, User } from "../../type"
import { db, table } from "../../database"
import { main } from "../../"
import { eq, or } from "drizzle-orm"
import Type from "typebox"

export default function Register(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.route({
        method: "POST",
        url: "/auth/register",
        config: {
            rateLimit: {
                max: 3,
                timeWindow: 3600000,
                groupId: "Auth"
            }
        },
        schema: {
            description: "Register a new user account",
            tags: ["Authentication"],
            body: Type.Object({
                password: Type.String({ minLength: 8, maxLength: 128 }),
                otp: Type.String({ minLength: 6, maxLength: 6, pattern: "^[0-9]{6}$" }),
                email: Type.Index(User, ["email"]),
                username: Type.Index(User, ["username"]),
                name: Type.Index(User, ["name"]),
                phone: Type.Index(User, ["phone"]),
                country: Type.Index(User, ["country"]),
                timezone: Type.Index(User, ["timezone"]),
                role: Type.Exclude(
                    Type.Index(User, ["role"]),
                    Type.Union([Type.Literal("moderator"), Type.Literal("admin")])
                )
            }),
            response: {
                201: User,
                400: ErrorResponse(400, "Bad Request - Invalid input data"),
                403: ErrorResponse(403, "Forbidden - Invalid OTP"),
                409: ErrorResponse(409, "Conflict - Email or username already exists"),
                429: ErrorResponse(429, "Too many requests - rate limit exceeded"),
                500: ErrorResponse(500, "Internal server error")
            }
        },
        handler: async (request, reply) => {
            try {
                const { otp, username, email, password, phone } = request.body

                if (!VerifyOTP(email, otp)) {
                    throw CreateError(403, "INVALID_OTP", "The provided OTP is incorrect or has expired")
                }

                const [exist] = await db
                    .select({ email: table.users.email, phone: table.users.phone, username: table.users.username })
                    .from(table.users)
                    .where(
                        or(
                            eq(table.users.email, email),
                            eq(table.users.phone, phone),
                            eq(table.users.username, username)
                        )
                    )

                if (exist) {
                    if (exist.email === email) {
                        throw CreateError(409, "EMAIL_ALREADY_EXISTS", "This email is already registered")
                    }

                    if (exist.phone === phone) {
                        throw CreateError(409, "PHONE_ALREADY_EXISTS", "This phone is already registered")
                    }

                    if (exist.username === username) {
                        throw CreateError(409, "USERNAME_ALREADY_EXISTS", "This username is already taken")
                    }
                }

                const [user] = await db
                    .insert(table.users)
                    .values({ ...request.body, password: HmacPassword(password) })
                    .returning()

                if (!user) {
                    throw CreateError(500, "USER_CREATION_FAILED", "Failed to create user account")
                }

                return reply.status(201).send({
                    ...user,
                    createdAt: user.createdAt.toISOString(),
                    updatedAt: user.updatedAt.toISOString()
                })
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
