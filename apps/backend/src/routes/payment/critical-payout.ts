import { CreateError, SendNotification, toTypeBox, xcf } from "../../function"
import { ErrorResponse, Payments } from "../../type"
import { db, table } from "../../database"
import { UUID } from "../../typebox"
import { main } from "../../"
import { eq } from "drizzle-orm"
import { Type } from "typebox"

export default function Payout(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.route({
        method: "PUT",
        url: "/payments/:id/payout",
        config: {
            rateLimit: {
                max: 10,
                timeWindow: "1 minute"
            }
        },
        schema: {
            description: "Payout a payment (Critical - Protected by auth key)",
            tags: ["Payments"],
            params: Type.Object({ id: UUID }),
            querystring: Type.Object({ auth: UUID }),
            response: {
                200: Payments,
                400: ErrorResponse(400, "Bad Request - Validation error"),
                402: ErrorResponse(402, "Payment not verified - Payment must be verified before payout"),
                404: ErrorResponse(404, "Not Found - Proposal not found"),
                429: ErrorResponse(429, "Too many requests - rate limit exceeded"),
                500: ErrorResponse(500, "Internal server error")
            }
        },

        handler: async (request, reply) => {
            try {
                const { id } = request.params
                const { auth } = request.query

                if (auth !== process.env.PAYMENT_SECRET) {
                    return reply.status(404).send({
                        message: `Route PUT:/payments/${id}/payout not found`,
                        error: "Not Found",
                        statusCode: 404
                    })
                }

                const [exist] = await db.select().from(table.payments).where(eq(table.payments.id, id))

                if (!exist) throw CreateError(404, "PAYMENT_NOT_FOUND", "Payment not found")
                if (exist.status !== "verified") {
                    throw CreateError(402, "PAYMENT_NOT_VERIFIED", "Payment must be verified before payout")
                }

                const [payment] = await db
                    .update(table.payments)
                    .set({ status: "paid_out", isPaidOut: true, paidOutAt: new Date() })
                    .where(eq(table.payments.id, id))
                    .returning()

                await SendNotification(
                    exist.freelancerId,
                    "Payment Payout Successful",
                    `Your payment of amount ${exist.amount} has been successfully paid out. Thank you for using our platform!`,
                    `/payments/${exist.id}`
                )

                await SendNotification(
                    payment.clientId,
                    "Payment Payout Successful",
                    `Your payment of amount ${payment.amount} has been successfully paid out. Thank you for using our platform!`,
                    `/payments/${payment.id}`
                )

                return reply.status(200).send(toTypeBox(payment))
            } catch (error) {
                await xcf(error as any)
            }
        }
    })
}
