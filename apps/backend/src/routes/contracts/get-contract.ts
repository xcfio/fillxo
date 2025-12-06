import { toTypeBox, xcf } from "../../function"
import { ErrorResponse, Contract } from "../../type"
import { db, table } from "../../database"
import { main } from "../../"
import { eq, desc, and, or } from "drizzle-orm"
import { Type } from "typebox"

export default function GetContract(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.route({
        method: "GET",
        url: "/contracts",
        schema: {
            description: "Get paginated list of contracts",
            tags: ["Contract"],
            querystring: Type.Partial(
                Type.Object({
                    status: Type.Union([
                        Type.Literal("payment-required"),
                        Type.Literal("active"),
                        Type.Literal("completed"),
                        Type.Literal("cancelled")
                    ]),
                    page: Type.Integer({ minimum: 1, default: 1, description: "Page number" }),
                    limit: Type.Integer({
                        minimum: 1,
                        maximum: 100,
                        default: 10,
                        description: "contracts per page"
                    })
                })
            ),
            response: {
                200: Type.Array(Contract),
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

                const conditions = [or(eq(table.contracts.clientId, id), eq(table.contracts.freelancerId, id))]
                if (status) conditions.push(eq(table.contracts.status, status))

                const contract = await db
                    .select()
                    .from(table.contracts)
                    .where(and(...conditions))
                    .orderBy(desc(table.contracts.createdAt))
                    .limit(limit)
                    .offset((page - 1) * limit)

                return reply.status(200).send(contract.map((data) => toTypeBox(data)))
            } catch (error) {
                await xcf(error as any)
            }
        }
    })
}
