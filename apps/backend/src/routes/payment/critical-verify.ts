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
            body: Type.Object({
                auth: UUID,
                status: Type.Union([Type.Literal("verified"), Type.Literal("rejected"), Type.Literal("refunded")]),
                rejectionReason: Type.Optional(Type.String())
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
                const { auth, status, rejectionReason } = request.body

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
                        .set({ status, rejectionReason })
                        .where(eq(table.payments.id, id))
                        .returning()

                    switch (status) {
                        case "verified": {
                            const [contract] = await tx
                                .update(table.contracts)
                                .set({ status: "active", startDate: new Date() })
                                .where(eq(table.contracts.id, exist.contractId))
                                .returning()

                            const [{ proposals, jobs }] = await tx
                                .select()
                                .from(table.proposals)
                                .leftJoin(table.jobs, eq(table.jobs.id, table.proposals.jobId))
                                .where(eq(table.proposals.id, contract.proposalId))

                            const [message] = await tx
                                .insert(table.messages)
                                .values({
                                    contracts: contract.id,
                                    content: [
                                        "Contract Details:",
                                        `> Contract ID: ${contract.id}`,
                                        `> Freelancer ID: ${contract.freelancerId}`,
                                        `> Client ID: ${contract.clientId}`,
                                        `> Job ID: ${contract.jobId}`,
                                        "",
                                        `> Job Title: ${jobs?.title}`,
                                        `> Job Description: ${jobs?.description}`,
                                        `> Job Category: ${jobs?.category}`,
                                        "",
                                        `> Agreed Amount: $${proposals.bidAmount}`,
                                        `> Payment Status: ${payment.status}`,
                                        `> Start Date: ${contract.startDate?.toDateString()}`,
                                        `> Estimated Delivery Days: ${proposals.deliveryDays} days`,
                                        "\n",
                                        `If you are the freelancer, you can now start working on the job. If you are the client, you can monitor the progress through this chat`
                                    ].join("\n")
                                })
                                .returning()

                            fastify.io.to(contract.freelancerId).emit("message_created", toTypeBox(message))
                            fastify.io.to(contract.clientId).emit("message_created", toTypeBox(message))

                            await SendNotification(
                                exist.clientId,
                                "Payment Verified",
                                `Your payment with transaction ID "${payment.id}" has been verified. The contract for your job: ${contract.jobId} is now active. You can communicate with the freelancer through the contract chat.`,
                                `/messages/${contract.id}`
                            )

                            await SendNotification(
                                payment.freelancerId,
                                "Contract Activated",
                                `A new contract has been activated for your job: ${contract.jobId}. You can now start working on the job and communicate with the client through the contract chat.`,
                                `/messages/${contract.id}`
                            )
                            break
                        }

                        case "rejected": {
                            await SendNotification(
                                exist.clientId,
                                "Payment Rejected",
                                `Your payment with transaction ID "${payment.id}" has been rejected for reason: ${rejectionReason ?? "No reason provided"}. If you believe this is a mistake, please contact support.`,
                                `/payments/${payment.id}`
                            )
                            break
                        }

                        case "refunded": {
                            await SendNotification(
                                exist.clientId,
                                "Payment Refunded",
                                `Your payment with transaction ID "${payment.id}" has been refunded. The amount should reflect in your account within 5-7 business days.`,
                                `/payments/${payment.id}`
                            )
                            break
                        }

                        default:
                            break
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
