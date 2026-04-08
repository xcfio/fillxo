import { CreateError, toTypeBox, xcf } from "../../function"
import { ErrorResponse, Payments } from "../../type"
import { db, table } from "../../database"
import { main } from "../../"
import { Type } from "typebox"
import { eq } from "drizzle-orm"

export default function PostPayment(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.route({
        method: "POST",
        url: "/payments",
        schema: {
            description: "Create a new payment for an accepted proposal",
            tags: ["Payments"],
            body: Type.Pick(Payments, [
                "contractId",
                "rate",
                "paymentMethod",
                "transactionId",
                "senderNumber",
                "notes"
            ]),
            response: {
                201: Payments,
                400: ErrorResponse(400, "Bad Request - Validation error"),
                403: ErrorResponse(403, "Forbidden - You are not authorized to make payment for this contract"),
                404: ErrorResponse(404, "Not Found - Contract not found"),
                409: ErrorResponse(409, "Conflict - Payment already exists for this contract"),
                429: ErrorResponse(429, "Too many requests - rate limit exceeded"),
                500: ErrorResponse(500, "Internal server error")
            }
        },
        preHandler: fastify.auth,
        handler: async (request, reply) => {
            try {
                const { id } = request.user
                const { rate, contractId, paymentMethod, transactionId, senderNumber, notes = null } = request.body

                const [contracts] = await db.select().from(table.contracts).where(eq(table.contracts.id, contractId))

                if (!contracts) {
                    throw CreateError(404, "CONTRACT_NOT_FOUND", "Contract not found")
                }

                if (contracts.clientId !== id) {
                    throw CreateError(403, "FORBIDDEN", "You are not authorized to make payment for this contract")
                }

                if (contracts.status !== "payment-required") {
                    throw CreateError(400, "INVALID_STATUS", "Contract is not awaiting payment")
                }

                const exist = await db.select().from(table.payments).where(eq(table.payments.contractId, contracts.id))

                if (exist.filter((x) => x.status === "pending").length > 0) {
                    throw CreateError(409, "PAYMENT_EXISTS", "Payment already exists for this contract")
                }

                const [payment] = await db
                    .insert(table.payments)
                    .values({
                        rate: rate,
                        amount: contracts.amount,
                        clientId: contracts.clientId,
                        contractId: contracts.id,
                        freelancerId: contracts.freelancerId,
                        jobId: contracts.jobId,
                        paymentMethod: paymentMethod,
                        payoutMethod: paymentMethod,
                        proposalId: contracts.proposalId,
                        receiverNumber: "empty",
                        senderNumber: senderNumber,
                        transactionId: transactionId,
                        status: "pending",
                        notes: notes
                    })
                    .returning()

                return reply.status(201).send(toTypeBox(payment))
            } catch (error) {
                await xcf(error as any)
            }
        }
    })
}
