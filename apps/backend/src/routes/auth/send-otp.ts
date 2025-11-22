import { CreateError, isFastifyError, SendOTP } from "../../function"
import { ErrorResponse } from "../../type"
import { main } from "../.."
import Type from "typebox"

export default function Send_OTP(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.route({
        method: "POST",
        url: "/auth/send-otp",
        config: {
            rateLimit: {
                max: 3,
                timeWindow: 600000
            }
        },
        schema: {
            description: "Send a One-Time Password (OTP) to the specified email address",
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
