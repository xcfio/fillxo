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
        schema: {
            description: "Register a new user account",
            tags: ["Authentication"],
            body: Type.Object(
                {
                    email: Type.String({
                        format: "email",
                        pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
                        description: "User's email address",
                        examples: ["user@example.com"]
                    }),
                    otp: Type.String({
                        minLength: 6,
                        maxLength: 6,
                        pattern: "^[0-9]{6}$",
                        description: "One-time verification code (6 numeric digits)",
                        examples: ["420960"]
                    }),
                    username: Type.String({
                        minLength: 3,
                        maxLength: 20,
                        pattern: "^[a-zA-Z0-9_-]+$",
                        description: "Unique username (3-20 characters, letters, numbers, underscores, and hyphens)",
                        examples: ["john_doe"]
                    }),
                    name: Type.String({
                        minLength: 2,
                        maxLength: 100,
                        description: "User's full name",
                        examples: ["John Doe"]
                    }),
                    password: Type.String({
                        minLength: 8,
                        maxLength: 128,
                        description: "User's password (min 8 characters)",
                        examples: ["CoolCake!==Bad"]
                    }),
                    role: Type.Union([Type.Literal("freelancer"), Type.Literal("client"), Type.Literal("both")])
                },
                {
                    description: "User registration data"
                }
            ),
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
                const { otp, name, username, email, password, role } = request.body

                if (!VerifyOTP(email, otp)) {
                    throw CreateError(403, "INVALID_OTP", "The provided OTP is incorrect or has expired")
                }

                const [exist] = await db
                    .select({ email: table.users.email, username: table.users.username })
                    .from(table.users)
                    .where(or(eq(table.users.email, email), eq(table.users.username, username)))

                if (exist) {
                    if (exist.email === email) {
                        throw CreateError(409, "EMAIL_ALREADY_EXISTS", "This email is already registered")
                    }
                    if (exist.username === username) {
                        throw CreateError(409, "USERNAME_ALREADY_EXISTS", "This username is already taken")
                    }
                }

                const [user] = await db
                    .insert(table.users)
                    .values({ name, username, email, password: HmacPassword(password), role })
                    .returning()

                if (!user) {
                    throw CreateError(500, "USER_CREATION_FAILED", "Failed to create user account")
                }

                return reply
                    .status(201)
                    .send({ ...user, updatedAt: user.updatedAt.toISOString(), createdAt: user.createdAt.toISOString() })
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
