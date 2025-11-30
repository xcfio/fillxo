import { CreateError, isFastifyError, toTypeBox } from "../../function"
import { ErrorResponse, Proposal } from "../../type"
import { db, table } from "../../database"
import { main } from "../.."
import { eq, desc, and } from "drizzle-orm"
import { Type } from "typebox"

export default function GetProposalSent(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.route({
        method: "GET",
        url: "/proposal/sent",
        schema: {
            description: "Get proposals sent by the authenticated freelancer",
            tags: ["Proposal"],
            querystring: Type.Partial(
                Type.Object({
                    status: Type.Union([Type.Literal("pending"), Type.Literal("accepted"), Type.Literal("rejected")]),
                    page: Type.Integer({ minimum: 1, default: 1, description: "Page number" }),
                    limit: Type.Integer({ minimum: 1, maximum: 100, default: 20, description: "Jobs per page" })
                })
            ),
            response: {
                200: Type.Array(Proposal),
                400: ErrorResponse(400, "Bad Request - Validation error"),
                429: ErrorResponse(429, "Too many requests - rate limit exceeded"),
                500: ErrorResponse(500, "Internal server error")
            }
        },
        preHandler: fastify.auth,
        handler: async (request, reply) => {
            try {
                const { id } = request.user
                const { limit = 20, page = 1, status } = request.query

                const conditions = [eq(table.proposals.freelancerId, id)]
                if (status) conditions.push(eq(table.proposals.status, status))

                const query = await db
                    .select()
                    .from(table.proposals)
                    .where(and(...conditions))
                    .orderBy(desc(table.proposals.createdAt))
                    .limit(limit)
                    .offset((page - 1) * limit)

                return reply.status(200).send(query.map((proposals) => toTypeBox(proposals)))
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
