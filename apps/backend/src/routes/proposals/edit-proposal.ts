import { CreateError, isFastifyError, toTypeBox } from "../../function"
import { ErrorResponse, Proposal } from "../../type"
import { db, table } from "../../database"
import { amount, UUID } from "../../typebox"
import { main } from "../../"
import { eq } from "drizzle-orm"
import { Type } from "typebox"

export default function EditProposal(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.route({
        method: "PATCH",
        url: "/proposal/:id",
        schema: {
            description: "Update an existing proposal",
            tags: ["Proposal"],
            params: Type.Object({ id: UUID }),
            body: Type.Partial(
                Type.Object({
                    bidAmount: amount,
                    coverLetter: Type.String({
                        minLength: 50,
                        maxLength: 2000,
                        examples: ["I am interested in this project because..."],
                        description: "Freelancer's cover letter"
                    }),
                    deliveryDays: Type.Integer({
                        minimum: 1,
                        maximum: 365,
                        examples: [7, 14, 30],
                        description: "Estimated delivery time in days"
                    })
                })
            ),
            response: {
                200: Proposal,
                400: ErrorResponse(400, "Bad Request - Validation error"),
                403: ErrorResponse(403, "Forbidden - You do not have permission to edit this proposal"),
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
                    throw CreateError(403, "FORBIDDEN", "You do not have permission to edit this proposal")
                }

                if (OldProposal.status !== "pending") {
                    throw CreateError(400, "BAD_REQUEST", "Cannot edit a proposal that is not pending")
                }

                const [proposal] = await db
                    .update(table.proposals)
                    .set(request.body)
                    .where(eq(table.proposals.id, id))
                    .returning()

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
