import { CreateError, isFastifyError, toTypeBox } from "../../function"
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
            body: Type.Pick(Payments, ["contractId", "paymentMethod", "transactionId"]),
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
                const { paymentMethod, contractId, transactionId } = request.body

                const [query] = await db
                    .select()
                    .from(table.contracts)
                    .where(eq(table.contracts.id, contractId))
                    .leftJoin(table.proposals, eq(table.contracts.proposalId, table.proposals.id))

                if (!query) {
                    throw CreateError(404, "CONTRACT_NOT_FOUND", "Contract not found")
                }

                if (!query.proposals) {
                    throw CreateError(404, "PROPOSAL_NOT_FOUND", "Proposal not found")
                }

                if (query.contracts.clientId !== id) {
                    throw CreateError(403, "FORBIDDEN", "You are not authorized to make payment for this contract")
                }

                const [exist] = await db
                    .select()
                    .from(table.payments)
                    .where(eq(table.payments.contractId, query.contracts.id))

                if (exist) {
                    throw CreateError(409, "CONFLICT", "Payment already exists for this contract")
                }

                if (query.contracts.status !== "payment-required") {
                    throw CreateError(400, "INVALID_STATUS", "Contract is not awaiting payment")
                }

                const [payment] = await db
                    .insert(table.payments)
                    .values({
                        clientId: id,
                        freelancerId: query.contracts.freelancerId,
                        paymentMethod,
                        contractId,
                        transactionId,
                        amount: query.proposals.bidAmount
                    })
                    .returning()

                return reply.status(201).send(toTypeBox(payment))
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
