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
                ]),
                notes: Type.Optional(Type.String()),
                rejectReason: Type.Optional(Type.String())
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
                const { auth, status, notes, rejectReason } = request.query

                if (auth !== process.env.PAYMENT_SECRET) {
                    return reply.status(404).send({
                        message: `Route PUT:/payments/${id}/verify not found`,
                        error: "Not Found",
                        statusCode: 404
                    })
                }

                const [exist] = await db.select().from(table.payments).where(eq(table.payments.id, id))
                if (!exist) throw CreateError(404, "PAYMENT_NOT_FOUND", "Payment not found")

                await db.transaction(async (tx) => {
                    const [payment] = await tx
                        .update(table.payments)
                        .set({ status, notes, rejectReason })
                        .where(eq(table.payments.id, id))
                        .returning()

                    if (status === "verified") {
                        await SendNotification(
                            exist.clientId,
                            "Payment Verified",
                            `Your payment with transaction ID "${payment.id}" has been verified. Now you can open contracts for the associated job.`,
                            `/payments/${payment.id}`
                        )

                        const [contract] = await tx
                            .update(table.contracts)
                            .set({ status: "active", startDate: new Date() })
                            .where(eq(table.contracts.id, exist.contractId))
                            .returning()

                        await SendNotification(
                            payment.freelancerId,
                            "Contract Activated",
                            `A new contract has been activated for your job: ${contract.jobId}. You can start working on it now.`,
                            `/contracts/${exist.contractId}`
                        )
                    } else if (status === "rejected") {
                        await SendNotification(
                            exist.clientId,
                            "Payment Rejected",
                            `Your payment with transaction ID "${payment.id}" has been rejected for reason: ${rejectReason ?? "No reason provided"}.`,
                            `/payments/${payment.id}`
                        )
                    } else if (status === "refunded") {
                        await SendNotification(
                            exist.clientId,
                            "Payment Refunded",
                            `Your payment with transaction ID "${payment.id}" has been refunded.`,
                            `/payments/${payment.id}`
                        )
                    } else if (status === "pending") {
                        await SendNotification(
                            exist.clientId,
                            "Payment Pending",
                            `Your payment with transaction ID "${payment.id}" is currently pending.`,
                            `/payments/${payment.id}`
                        )
                    }

                    return reply.status(200).send(toTypeBox(payment))
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
