import { xcf } from "../../function"
import { ErrorResponse } from "../../type"
import { main } from "../../"
import { Type } from "typebox"

export default function Logout(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.route({
        method: "POST",
        url: "/auth/logout",
        schema: {
            description: "Logout the authenticated user by clearing the authentication cookie",
            tags: ["Authentication"],
            response: {
                200: Type.Object({ success: Type.Boolean(), message: Type.String() }),
                401: ErrorResponse(401, "Unauthorized - authentication required"),
                429: ErrorResponse(429, "Too many requests - rate limit exceeded"),
                500: ErrorResponse(500, "Internal server error")
            }
        },
        preHandler: fastify.auth,
        handler: async (_, reply) => {
            try {
                reply.clearCookie("auth", {
                    path: "/",
                    signed: true,
                    sameSite: "strict"
                })

                return reply.send({
                    success: true,
                    message: "Successfully logged out"
                })
            } catch (error) {
                await xcf(error as any)
            }
        }
    })
}
