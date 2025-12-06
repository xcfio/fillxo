import { CreateError, toTypeBox, xcf } from "../../function"
import { ErrorResponse, Proposal } from "../../type"
import { db, table } from "../../database"
import { UUID } from "../../typebox"
import { main } from "../../"
import { eq } from "drizzle-orm"
import { Type } from "typebox"

export default function GetProposalID(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.route({
        method: "GET",
        url: "/proposal/:id",
        schema: {
            description: "Get a proposal by ID",
            tags: ["Proposal"],
            params: Type.Object({ id: UUID }),
            response: {
                200: Proposal,
                400: ErrorResponse(400, "Bad Request - Validation error"),
                403: ErrorResponse(403, "Forbidden - You do not have permission to reject this proposal"),
                404: ErrorResponse(404, "Not Found - Proposal not found"),
                429: ErrorResponse(429, "Too many requests - rate limit exceeded"),
                500: ErrorResponse(500, "Internal server error")
            }
        },
        preHandler: fastify.auth,
        handler: async (request, reply) => {
            try {
                const { id } = request.user
                const { id: proposal } = request.params

                const [query] = await db
                    .select()
                    .from(table.proposals)
                    .leftJoin(table.jobs, eq(table.proposals.jobId, table.jobs.id))
                    .where(eq(table.proposals.id, proposal))

                if (!query) throw CreateError(404, "NOT_FOUND", "Proposal not found")
                if (query.jobs?.clientId !== id && query.proposals.freelancerId !== id) {
                    throw CreateError(403, "FORBIDDEN", "You do not have permission to view this proposal")
                }

                return reply.status(200).send(toTypeBox(query.proposals))
            } catch (error) {
                await xcf(error as any)
            }
        }
    })
}
