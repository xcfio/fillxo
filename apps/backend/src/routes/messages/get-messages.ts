import { toTypeBox, xcf } from "../../function"
import { ErrorResponse, Message } from "../../type"
import { db, table } from "../../database"
import { UUID } from "../../typebox"
import { main } from "../../"
import { and, asc, eq, or, not } from "drizzle-orm"
import { Type } from "typebox"

export default function GetMessages(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.route({
        method: "GET",
        url: "/messages/:id",
        schema: {
            description: "Get paginated list of messages",
            tags: ["Message"],
            params: Type.Object({ id: UUID }),
            querystring: Type.Partial(
                Type.Object({
                    page: Type.Integer({ minimum: 1, default: 1, description: "Page number" }),
                    limit: Type.Integer({ minimum: 1, maximum: 100, default: 20, description: "Messages per page" })
                })
            ),
            response: {
                200: Type.Array(Message),
                400: ErrorResponse(400, "Bad Request - Validation error"),
                401: ErrorResponse(401, "Unauthorized - Authentication required"),
                429: ErrorResponse(429, "Too many requests - rate limit exceeded"),
                500: ErrorResponse(500, "Internal server error")
            }
        },
        preHandler: fastify.auth,
        handler: async (request, reply) => {
            try {
                const { id } = request.user
                const { id: contract } = request.params
                const { page = 1, limit = 20 } = request.query

                const messages = await db
                    .select()
                    .from(table.messages)
                    .leftJoin(table.contracts, eq(table.contracts.id, table.messages.contracts))
                    .where(
                        and(
                            not(eq(table.messages.status, "deleted")),
                            eq(table.messages.contracts, contract),
                            or(eq(table.contracts.clientId, id), eq(table.contracts.freelancerId, id))
                        )
                    )
                    .orderBy(asc(table.messages.createdAt))
                    .limit(limit)
                    .offset((page - 1) * limit)

                return reply.status(200).send(messages.map((x) => toTypeBox(x.message)))
            } catch (error) {
                await xcf(error as any)
            }
        }
    })
}
