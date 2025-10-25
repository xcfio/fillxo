import { CreateError, isFastifyError, HmacPassword, VerifyOTP } from "../../function"
import { ErrorResponse } from "../../type"
import { db, table } from "../../database"
import { main } from "../.."
import { eq } from "drizzle-orm"
import Type from "typebox"

export default function Reset(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.route({
        method: "POST",
        url: "/auth/reset",
        schema: {
            description: "Reset Password",
            tags: ["Authentication"],
            body: Type.Object({
                email: Type.String({ format: "email", pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$" }),
                otp: Type.String({ minLength: 6, maxLength: 6, pattern: "^[0-9]{6}$" }),
                password: Type.String({ minLength: 8, maxLength: 128 })
            }),
            response: {
                200: Type.Object({ success: Type.Boolean() }),
                429: ErrorResponse(429, "Too many requests - rate limit exceeded"),
                500: ErrorResponse(500, "Internal server error")
            }
        },
        handler: async (request, reply) => {
            try {
                const { email, otp, password } = request.body
                if (!VerifyOTP(email, otp)) {
                    throw CreateError(403, "INVALID_OTP", "The provided OTP is incorrect or has expired")
                }

                await db
                    .update(table.users)
                    .set({ password: HmacPassword(password) })
                    .where(eq(table.users.email, email))

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
