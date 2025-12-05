import { CreateError, isFastifyError, toTypeBox } from "../../function"
import { ErrorResponse, Payments } from "../../type"
import { db, table } from "../../database"
import { main } from "../../"
import { eq, desc, and, or } from "drizzle-orm"
import { Type } from "typebox"

export default function GetPayment(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.route({
        method: "GET",
        url: "/payments",
        schema: {
            description: "Get paginated list of payments for the authenticated user",
            tags: ["Payments"],
            querystring: Type.Partial(
                Type.Object({
                    status: Type.Union([
                        Type.Literal("pending"),
                        Type.Literal("verified"),
                        Type.Literal("rejected"),
                        Type.Literal("refunded")
                    ]),
                    page: Type.Integer({ minimum: 1, default: 1, description: "Page number" }),
                    limit: Type.Integer({
                        minimum: 1,
                        maximum: 100,
                        default: 10,
                        description: "payments per page"
                    })
                })
            ),
            response: {
                200: Type.Array(Payments),
                400: ErrorResponse(400, "Bad Request - Validation error"),
                429: ErrorResponse(429, "Too many requests - rate limit exceeded"),
                500: ErrorResponse(500, "Internal server error")
            }
        },
        preHandler: fastify.auth,
        handler: async (request, reply) => {
            try {
                const { id } = request.user
                const { status, limit = 10, page = 1 } = request.query

                const conditions = [
                    or(
                        eq(table.payments.clientId, id),
                        and(eq(table.payments.freelancerId, id), eq(table.payments.status, "paid_out"))
                    )
                ]
                if (status) conditions.push(eq(table.payments.status, status))

                const payment = await db
                    .select()
                    .from(table.payments)
                    .where(and(...conditions))
                    .orderBy(desc(table.payments.createdAt))
                    .limit(limit)
                    .offset((page - 1) * limit)

                return reply.status(200).send(payment.map((data) => toTypeBox(data)))
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
