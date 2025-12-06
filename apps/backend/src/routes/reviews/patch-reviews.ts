import { CreateError, toTypeBox, xcf } from "../../function"
import { ErrorResponse, Review } from "../../type"
import { db, table } from "../../database"
import { UUID } from "../../typebox"
import { main } from "../../"
import { and, eq } from "drizzle-orm"
import { Type } from "typebox"

export default function PatchReview(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.route({
        method: "PATCH",
        url: "/reviews/:id",
        schema: {
            description: "Update a review for a completed contract",
            tags: ["Reviews"],
            params: Type.Object({ id: UUID }),
            body: Type.Object({
                rating: Type.Optional(Type.Integer({ minimum: 1, maximum: 5 })),
                comment: Type.Optional(Type.String({ minLength: 10, maxLength: 1000 }))
            }),
            response: {
                200: Review,
                400: ErrorResponse(400, "Bad Request - Validation error"),
                403: ErrorResponse(403, "Forbidden - You are not allowed to review for this contract"),
                404: ErrorResponse(404, "Not Found - Contract not found"),
                429: ErrorResponse(429, "Too many requests - rate limit exceeded"),
                500: ErrorResponse(500, "Internal server error")
            }
        },
        preHandler: fastify.auth,
        handler: async (request, reply) => {
            try {
                const { id } = request.params
                const { id: userId } = request.user
                const { rating, comment } = request.body

                const [OldReview] = await db
                    .select()
                    .from(table.reviews)
                    .where(and(eq(table.reviews.id, id), eq(table.reviews.status, "visible")))

                if (!OldReview) {
                    throw CreateError(404, "REVIEW_NOT_FOUND", "Review not found")
                }

                if (OldReview.reviewerId !== userId) {
                    throw CreateError(403, "FORBIDDEN", "You are not allowed to edit this review")
                }

                const [review] = await db
                    .update(table.reviews)
                    .set({ rating: rating, comment: comment?.trim() })
                    .where(eq(table.reviews.id, id))
                    .returning()

                return reply.status(200).send(toTypeBox(review))
            } catch (error) {
                await xcf(error as any)
            }
        }
    })
}
