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
            body: Type.Pick(Payments, ["proposalId", "paymentMethod", "transactionId"]),
            response: {
                201: Payments,
                400: ErrorResponse(400, "Bad Request - Validation error"),
                403: ErrorResponse(403, "Forbidden - You are not authorized to make payment for this proposal"),
                404: ErrorResponse(404, "Not Found - Proposal not found"),
                429: ErrorResponse(429, "Too many requests - rate limit exceeded"),
                500: ErrorResponse(500, "Internal server error")
            }
        },
        preHandler: fastify.auth,
        handler: async (request, reply) => {
            try {
                const { id } = request.user
                const { paymentMethod, proposalId, transactionId } = request.body

                const [query] = await db
                    .select()
                    .from(table.proposals)
                    .where(eq(table.proposals.id, proposalId))
                    .leftJoin(table.jobs, eq(table.proposals.jobId, table.jobs.id))

                if (!query) {
                    throw CreateError(404, "PROPOSAL_NOT_FOUND", "Proposal not found")
                }

                if (query.jobs?.clientId !== id) {
                    throw CreateError(403, "FORBIDDEN", "You are not authorized to make payment for this proposal")
                }

                const [exist] = await db
                    .select()
                    .from(table.payments)
                    .where(eq(table.payments.proposalId, query.proposals.id))

                if (exist) {
                    throw CreateError(400, "PAYMENT_EXISTS", "Payment already exists for this proposal")
                }

                const [payment] = await db
                    .insert(table.payments)
                    .values({
                        clientId: id,
                        freelancerId: query.proposals.freelancerId,
                        paymentMethod,
                        proposalId,
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
