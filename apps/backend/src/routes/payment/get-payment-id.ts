import { CreateError, isFastifyError, toTypeBox } from "../../function"
import { ErrorResponse, Payments } from "../../type"
import { db, table } from "../../database"
import { UUID } from "../../typebox"
import { main } from "../../"
import { eq, and, or } from "drizzle-orm"
import { Type } from "typebox"

export default function GetPaymentId(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.route({
        method: "GET",
        url: "/payments/:id",
        schema: {
            description: "Get a payment by ID for the authenticated client",
            tags: ["Payments"],
            params: Type.Object({ id: UUID }),
            response: {
                200: Payments,
                400: ErrorResponse(400, "Bad Request - Validation error"),
                404: ErrorResponse(404, "Not Found - No payments found"),
                429: ErrorResponse(429, "Too many requests - rate limit exceeded"),
                500: ErrorResponse(500, "Internal server error")
            }
        },
        preHandler: fastify.auth,
        handler: async (request, reply) => {
            try {
                const { id: clientId } = request.user
                const { id } = request.params

                const [payment] = await db
                    .select()
                    .from(table.payments)
                    .where(
                        and(
                            eq(table.payments.id, id),
                            or(
                                eq(table.payments.clientId, clientId),
                                and(eq(table.payments.freelancerId, clientId), eq(table.payments.status, "paid_out"))
                            )
                        )
                    )

                if (!payment) throw CreateError(404, "NOT_FOUND", "No payments found")

                return reply.status(200).send(toTypeBox(payment))
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
