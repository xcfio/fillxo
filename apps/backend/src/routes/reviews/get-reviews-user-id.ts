import { toTypeBox, xcf } from "../../function"
import { ErrorResponse, Review } from "../../type"
import { db, table } from "../../database"
import { UUID } from "../../typebox"
import { main } from "../../"
import { and, eq } from "drizzle-orm"
import { Type } from "typebox"

export default function GetReviewUser(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.route({
        method: "GET",
        url: "/reviews/user/:id",
        schema: {
            description: "Get all reviews for a specific user",
            tags: ["Reviews"],
            params: Type.Object({ id: UUID }),
            response: {
                200: Type.Array(Review),
                400: ErrorResponse(400, "Bad Request - Validation error"),
                429: ErrorResponse(429, "Too many requests - rate limit exceeded"),
                500: ErrorResponse(500, "Internal server error")
            }
        },
        preHandler: fastify.auth,
        handler: async (request, reply) => {
            try {
                const { id } = request.params

                const review = await db
                    .select()
                    .from(table.reviews)
                    .where(and(eq(table.reviews.revieweeId, id), eq(table.reviews.status, "visible")))

                return reply.status(200).send(review.map((x) => toTypeBox(x)))
            } catch (error) {
                await xcf(error as any)
            }
        }
    })
}
