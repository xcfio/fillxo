import { CreateError, toTypeBox, xcf } from "../../function"
import { ErrorResponse, Review } from "../../type"
import { db, table } from "../../database"
import { UUID } from "../../typebox"
import { main } from "../../"
import { and, eq } from "drizzle-orm"
import { Type } from "typebox"

export default function PostReview(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.route({
        method: "POST",
        url: "/reviews",
        schema: {
            description: "Create a review for a completed contract",
            tags: ["Reviews"],
            body: Type.Object({
                userId: UUID,
                contractId: UUID,
                rating: Type.Integer({ minimum: 1, maximum: 5 }),
                comment: Type.Optional(Type.String({ minLength: 10, maxLength: 1000 }))
            }),
            response: {
                201: Review,
                400: ErrorResponse(400, "Bad Request - Validation error"),
                403: ErrorResponse(403, "Forbidden - You are not allowed to review for this contract"),
                404: ErrorResponse(404, "Not Found - Contract not found"),
                409: ErrorResponse(409, "Conflict - Review already exists for this contract"),
                429: ErrorResponse(429, "Too many requests - rate limit exceeded"),
                500: ErrorResponse(500, "Internal server error")
            }
        },
        preHandler: fastify.auth,
        handler: async (request, reply) => {
            try {
                const { id } = request.user
                const { contractId, userId, rating, comment } = request.body

                if (id === userId) {
                    throw CreateError(400, "INVALID_REVIEWEE", "Reviewer and reviewee cannot be the same user")
                }

                const [contracts] = await db.select().from(table.contracts).where(eq(table.contracts.id, contractId))

                if (!contracts) {
                    throw CreateError(404, "CONTRACT_NOT_FOUND", "Contract not found")
                }

                if (contracts.clientId !== id && contracts.freelancerId !== id) {
                    throw CreateError(403, "FORBIDDEN", "You are not allowed to review for this contract")
                }

                if (contracts.status !== "completed") {
                    throw CreateError(400, "CONTRACT_NOT_COMPLETED", "Cannot review a contract that is not completed")
                }

                const exist = await db
                    .select()
                    .from(table.reviews)
                    .where(and(eq(table.reviews.reviewerId, id), eq(table.reviews.revieweeId, userId)))

                if (exist) {
                    throw CreateError(409, "REVIEW_EXISTS", "Review already exists for this contract")
                }

                const [review] = await db
                    .insert(table.reviews)
                    .values({
                        contractId: contractId,
                        reviewerId: id,
                        revieweeId: userId,
                        rating: rating,
                        comment: comment,
                        type: contracts.clientId === id ? "client_to_freelancer" : "freelancer_to_client"
                    })
                    .returning()

                return reply.status(201).send(toTypeBox(review))
            } catch (error) {
                await xcf(error as any)
            }
        }
    })
}
