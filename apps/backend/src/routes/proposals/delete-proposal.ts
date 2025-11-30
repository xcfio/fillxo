import { CreateError, isFastifyError } from "../../function"
import { ErrorResponse } from "../../type"
import { db, table } from "../../database"
import { UUID } from "../../typebox"
import { main } from "../../"
import { eq } from "drizzle-orm"
import { Type } from "typebox"

export default function DeleteProposal(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.route({
        method: "DELETE",
        url: "/proposal/:id",
        schema: {
            description: "Delete a proposal",
            tags: ["Proposal"],
            params: Type.Object({ id: UUID }),
            response: {
                200: Type.Object({ success: Type.Boolean() }),
                400: ErrorResponse(400, "Bad Request - Validation error"),
                403: ErrorResponse(403, "Forbidden - You do not have permission to delete this proposal"),
                404: ErrorResponse(404, "Not Found - Proposal not found"),
                429: ErrorResponse(429, "Too many requests - rate limit exceeded"),
                500: ErrorResponse(500, "Internal server error")
            }
        },
        preHandler: fastify.auth,
        handler: async (request, reply) => {
            try {
                const { id: freelancer } = request.user
                const { id } = request.params

                const [OldProposal] = await db.select().from(table.proposals).where(eq(table.proposals.id, id))
                if (!OldProposal) throw CreateError(404, "NOT_FOUND", "Proposal not found")

                if (OldProposal.freelancerId !== freelancer) {
                    throw CreateError(403, "FORBIDDEN", "You do not have permission to delete this proposal")
                }

                await db.delete(table.proposals).where(eq(table.proposals.id, id))
                return reply.status(200).send({ success: true })
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
