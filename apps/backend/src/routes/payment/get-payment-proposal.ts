import { toTypeBox, xcf } from "../../function"
import { ErrorResponse, Payments } from "../../type"
import { db, table } from "../../database"
import { UUID } from "../../typebox"
import { main } from "../../"
import { eq, and, or } from "drizzle-orm"
import { Type } from "typebox"

export default function GetPaymentByProposal(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.route({
        method: "GET",
        url: "/payments/contract/:contractId",
        schema: {
            description:
                "Get all payments for a contract by contractId for the authenticated user (client or freelancer)",
            tags: ["Payments"],
            params: Type.Object({ contractId: UUID }),
            response: {
                200: Type.Array(Payments),
                400: ErrorResponse(400, "Bad Request - Validation error"),
                403: ErrorResponse(403, "Forbidden - You are not authorized to view this payment"),
                429: ErrorResponse(429, "Too many requests - rate limit exceeded"),
                500: ErrorResponse(500, "Internal server error")
            }
        },
        preHandler: fastify.auth,
        handler: async (request, reply) => {
            try {
                const { id: userId } = request.user
                const { contractId } = request.params

                const payments = await db
                    .select()
                    .from(table.payments)
                    .where(
                        and(
                            eq(table.payments.contractId, contractId),
                            or(eq(table.payments.clientId, userId), eq(table.payments.freelancerId, userId))
                        )
                    )
                    .orderBy(table.payments.createdAt)

                return reply.status(200).send(payments.map(toTypeBox))
            } catch (error) {
                await xcf(error as any)
            }
        }
    })
}
