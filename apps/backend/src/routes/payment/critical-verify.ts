import { CreateError, isFastifyError, SendNotification, toTypeBox } from "../../function"
import { ErrorResponse, Payments } from "../../type"
import { db, table } from "../../database"
import { UUID } from "../../typebox"
import { main } from "../../"
import { eq } from "drizzle-orm"
import { Type } from "typebox"

export default function Verify(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.route({
        method: "PUT",
        url: "/payments/:id/verify",
        config: {
            rateLimit: {
                max: 10,
                timeWindow: "1 minute"
            }
        },
        schema: {
            description: "Verify a payment (Critical - Protected by auth key)",
            tags: ["Payments"],
            params: Type.Object({ id: UUID }),
            querystring: Type.Object({
                auth: UUID,
                status: Type.Union([
                    Type.Literal("pending"),
                    Type.Literal("verified"),
                    Type.Literal("rejected"),
                    Type.Literal("refunded")
                ])
            }),
            response: {
                200: Payments,
                400: ErrorResponse(400, "Bad Request - Validation error"),
                404: ErrorResponse(404, "Not Found - Proposal not found"),
                429: ErrorResponse(429, "Too many requests - rate limit exceeded"),
                500: ErrorResponse(500, "Internal server error")
            }
        },

        handler: async (request, reply) => {
            try {
                const { id } = request.params
                const { auth, status } = request.query

                if (auth !== process.env.PAYMENT_SECRET) {
                    return reply.status(404).send({
                        message: `Route PUT:/payments/${id}/verify not found`,
                        error: "Not Found",
                        statusCode: 404
                    })
                }

                const [exist] = await db.select().from(table.payments).where(eq(table.payments.id, id))
                if (!exist) throw CreateError(404, "PAYMENT_NOT_FOUND", "Payment not found")

                const [payment] = await db
                    .update(table.payments)
                    .set({ status })
                    .where(eq(table.payments.id, id))
                    .returning()

                await SendNotification(
                    payment.clientId,
                    `Payment ${status}`,
                    `Your payment for proposal ${payment.proposalId} has been ${status}.`
                )

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
