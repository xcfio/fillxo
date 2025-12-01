import { CreateError, isFastifyError, SendNotification, toTypeBox } from "../../function"
import { ErrorResponse, Contract } from "../../type"
import { db, table } from "../../database"
import { main } from "../../"
import { Type } from "typebox"
import { eq } from "drizzle-orm"

export default function PostContract(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.route({
        method: "POST",
        url: "/contracts/",
        schema: {
            description: "Create a new contract for an accepted proposal",
            tags: ["Contract"],
            body: Type.Pick(Contract, ["proposalId"]),
            response: {
                201: Contract,
                400: ErrorResponse(400, "Bad Request - Validation error"),
                403: ErrorResponse(403, "Forbidden - You are not authorized to make a contract for this proposal"),
                404: ErrorResponse(404, "Not Found - Proposal not found"),
                409: ErrorResponse(409, "Conflict - Contract already exists for this proposal"),
                429: ErrorResponse(429, "Too many requests - rate limit exceeded"),
                500: ErrorResponse(500, "Internal server error")
            }
        },
        preHandler: fastify.auth,
        handler: async (request, reply) => {
            try {
                const { id } = request.user
                const { proposalId } = request.body

                const [query] = await db
                    .select()
                    .from(table.proposals)
                    .where(eq(table.proposals.id, proposalId))
                    .leftJoin(table.jobs, eq(table.proposals.jobId, table.jobs.id))

                if (!query) {
                    throw CreateError(404, "PROPOSAL_NOT_FOUND", "Proposal not found")
                }

                if (query.jobs?.clientId !== id) {
                    throw CreateError(403, "FORBIDDEN", "You are not authorized to make a contract for this proposal")
                }

                const [exist] = await db
                    .select()
                    .from(table.contracts)
                    .where(eq(table.contracts.proposalId, query.proposals.id))

                if (exist) {
                    throw CreateError(409, "CONFLICT", "Contract already exists for this proposal")
                }

                const [contract] = await db
                    .insert(table.contracts)
                    .values({
                        amount: query.proposals.bidAmount,
                        clientId: query.jobs.clientId,
                        freelancerId: query.proposals.freelancerId,
                        jobId: query.jobs.id,
                        proposalId: query.proposals.id,
                        status: "payment-required"
                    })
                    .returning()

                await db.update(table.jobs).set({ isOpen: false }).where(eq(table.jobs.id, query.jobs.id))
                await SendNotification(
                    query.jobs.clientId,
                    "Contract Created",
                    `A new contract has been created for your job: ${query.jobs.title}. Please proceed with the payment to start the work.`,
                    `/contracts/${contract.id}`
                )

                await SendNotification(
                    query.proposals.freelancerId,
                    "New Contract Created",
                    `A new contract has been created for your proposal on job: ${query.jobs.title}. You can now proceed with the work upon payment.`,
                    `/contracts/${contract.id}`
                )

                return reply.status(201).send(toTypeBox(contract))
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
