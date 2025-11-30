import { CreateError, isFastifyError, SendNotification, toTypeBox } from "../../function"
import { ErrorResponse, Proposal } from "../../type"
import { db, table } from "../../database"
import { UUID } from "../../typebox"
import { main } from "../.."
import { eq } from "drizzle-orm"
import { Type } from "typebox"

export default function AcceptProposal(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.route({
        method: "PUT",
        url: "/proposal/:id/accept",
        schema: {
            description: "Accept a proposal for a job",
            tags: ["Proposal"],
            params: Type.Object({
                id: UUID
            }),
            response: {
                200: Proposal,
                400: ErrorResponse(400, "Bad Request - Validation error"),
                403: ErrorResponse(403, "Forbidden - You do not have permission to accept this proposal"),
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
                    throw CreateError(403, "FORBIDDEN", "You do not have permission to accept this proposal")
                }

                const [proposal] = await db
                    .update(table.proposals)
                    .set({ status: "accepted" })
                    .where(eq(table.proposals.id, id))
                    .returning()

                await SendNotification(
                    OldProposal.proposals.freelancerId,
                    "Proposal Accepted",
                    `Your proposal for the job "${OldProposal.jobs?.title}" has been accepted.`,
                    `/jobs/${OldProposal.jobs?.id}`
                )

                return reply.status(200).send(toTypeBox(proposal))
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
