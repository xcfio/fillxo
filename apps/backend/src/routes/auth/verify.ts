import { CreateError, isFastifyError, SendOTP, VerifyOTP } from "../../function"
import { ErrorResponse } from "../../type"
import { main } from "../../"
import Type from "typebox"

export default function Verify(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.route({
        method: "POST",
        url: "/auth/verify",
        config: {
            rateLimit: {
                max: 3,
                timeWindow: 600000,
                groupId: "Auth-OTP"
            }
        },
        schema: {
            description: "Verify user email",
            tags: ["Authentication"],
            body: Type.Object({ email: Type.String({ format: "email", pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$" }) }),
            response: {
                200: Type.Object({ success: Type.Boolean() }),
                429: ErrorResponse(429, "Too many requests - rate limit exceeded"),
                500: ErrorResponse(500, "Internal server error")
            }
        },
        handler: async (request, reply) => {
            try {
                await SendOTP(request.body.email)
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
