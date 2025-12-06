import { CreateError, xcf } from "../../function"
import { ErrorResponse } from "../../type"
import { db, table } from "../../database"
import { UUID } from "../../typebox"
import { main } from "../../"
import { and, eq } from "drizzle-orm"
import { Type } from "typebox"

export default function DeleteReview(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.route({
        method: "DELETE",
        url: "/reviews/:id",
        schema: {
            description: "Delete a review for a completed contract",
            tags: ["Reviews"],
            params: Type.Object({ id: UUID }),
            response: {
                200: Type.Object({ success: Type.Boolean() }),
                400: ErrorResponse(400, "Bad Request - Validation error"),
                403: ErrorResponse(403, "Forbidden - You are not allowed to delete this review"),
                404: ErrorResponse(404, "Not Found - Review not found"),
                429: ErrorResponse(429, "Too many requests - rate limit exceeded"),
                500: ErrorResponse(500, "Internal server error")
            }
        },
        preHandler: fastify.auth,
        handler: async (request, reply) => {
            try {
                const { id } = request.params
                const { id: userId } = request.user

                const [OldReview] = await db
                    .select()
                    .from(table.reviews)
                    .where(and(eq(table.reviews.id, id), eq(table.reviews.status, "visible")))

                if (!OldReview) {
                    throw CreateError(404, "REVIEW_NOT_FOUND", "Review not found")
                }

                if (OldReview.reviewerId !== userId) {
                    throw CreateError(403, "FORBIDDEN", "You are not allowed to delete this review")
                }

                await db.update(table.reviews).set({ status: "deleted" }).where(eq(table.reviews.id, id))
                return reply.status(200).send({ success: true })
            } catch (error) {
                await xcf(error as any)
            }
        }
    })
}
