import { CreateError, SendNotification, toTypeBox, xcf } from "../../function"
import { ErrorResponse, Proposal } from "../../type"
import { db, table } from "../../database"
import { UUID } from "../../typebox"
import { main } from "../../"
import { eq } from "drizzle-orm"
import { Type } from "typebox"

export default function RejectProposal(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.route({
        method: "PUT",
        url: "/proposal/:id/reject",
        schema: {
            description: "Reject a proposal",
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
                const { id: clientId } = request.user
                const { id } = request.params

                const [OldProposal] = await db
                    .select()
                    .from(table.proposals)
                    .leftJoin(table.jobs, eq(table.proposals.jobId, table.jobs.id))
                    .where(eq(table.proposals.id, id))

                if (!OldProposal) throw CreateError(404, "NOT_FOUND", "Proposal not found")
                if (OldProposal.jobs?.clientId !== clientId) {
                    throw CreateError(403, "FORBIDDEN", "You do not have permission to reject this proposal")
                }

                const [proposal] = await db
                    .update(table.proposals)
                    .set({ status: "rejected" })
                    .where(eq(table.proposals.id, id))
                    .returning()

                await SendNotification(
                    OldProposal.proposals.freelancerId,
                    "Proposal Rejected",
                    `Your proposal for the job "${OldProposal.jobs?.title}" has been rejected.`,
                    `/jobs/${OldProposal.jobs?.id}`
                )

                return reply.status(200).send(toTypeBox(proposal))
            } catch (error) {
                await xcf(error as any)
            }
        }
    })
}
