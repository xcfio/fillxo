import { CreateError, isFastifyError, SendOTP, VerifyOTP } from "../../function"
import { ErrorResponse } from "../../type"
import { main } from "../../"
import Type from "typebox"

export default function Verify(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.route({
        method: "POST",
        url: "/auth/verify",
        schema: {
            description: "Verify user email",
            tags: ["Authentication"],
            body: Type.Union([
                Type.Object({
                    email: Type.String({
                        format: "email",
                        pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
                        description: "User's email address",
                        examples: ["user@example.com"]
                    })
                }),
                Type.Object({
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
                    })
                })
            ]),
            response: {
                200: Type.Object(
                    {
                        success: Type.Boolean({ description: "Indicates if OTP send successful" }),
                        email: Type.String({ description: "User's email address" })
                    },
                    {
                        description: "Response schema for successful verification operation"
                    }
                ),
                403: ErrorResponse(403, "Forbidden - Invalid OTP"),
                429: ErrorResponse(429, "Too many requests - rate limit exceeded"),
                500: ErrorResponse(500, "Internal server error")
            }
        },
        handler: async (request, reply) => {
            try {
                if ("otp" in request.body) {
                    const { email, otp } = request.body
                    if (!VerifyOTP(email, otp)) {
                        throw CreateError(403, "INVALID_OTP", "The provided OTP is incorrect or has expired")
                    } else {
                        return reply.send({ success: true, email })
                    }
                } else {
                    const { email } = await SendOTP(request.body.email)
                    return reply.send({ success: true, email })
                }
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
