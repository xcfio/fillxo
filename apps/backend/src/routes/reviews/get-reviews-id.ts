import { CreateError, toTypeBox, xcf } from "../../function"
import { ErrorResponse, Review } from "../../type"
import { db, table } from "../../database"
import { UUID } from "../../typebox"
import { main } from "../../"
import { and, eq } from "drizzle-orm"
import { Type } from "typebox"

export default function GetReviewId(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.route({
        method: "GET",
        url: "/reviews/:id",
        schema: {
            description: "Update a review for a completed contract",
            tags: ["Reviews"],
            params: Type.Object({ id: UUID }),
            response: {
                200: Review,
                400: ErrorResponse(400, "Bad Request - Validation error"),
                404: ErrorResponse(404, "Not Found - Review not found"),
                429: ErrorResponse(429, "Too many requests - rate limit exceeded"),
                500: ErrorResponse(500, "Internal server error")
            }
        },
        preHandler: fastify.auth,
        handler: async (request, reply) => {
            try {
                const { id } = request.params
                const [review] = await db
                    .select()
                    .from(table.reviews)
                    .where(and(eq(table.reviews.id, id), eq(table.reviews.status, "visible")))

                if (!review) throw CreateError(404, "REVIEW_NOT_FOUND", "Review not found")
                return reply.status(200).send(toTypeBox(review))
            } catch (error) {
                await xcf(error as any)
            }
        }
    })
}
