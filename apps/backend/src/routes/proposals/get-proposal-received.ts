import { CreateError, isFastifyError, toTypeBox } from "../../function"
import { ErrorResponse, Proposal } from "../../type"
import { db, table } from "../../database"
import { UUID } from "../../typebox"
import { main } from "../.."
import { eq, desc, and } from "drizzle-orm"
import { Type } from "typebox"

export default function GetProposalReceived(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.route({
        method: "GET",
        url: "/proposal/received",
        schema: {
            description: "",
            tags: ["Proposal"],
            querystring: Type.Partial(
                Type.Object({
                    jobId: UUID,
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
                const { jobId, limit = 20, page = 1, status } = request.query

                const conditions = [eq(table.jobs.clientId, id)]
                if (jobId) conditions.push(eq(table.proposals.jobId, jobId))
                if (status) conditions.push(eq(table.proposals.status, status))

                const query = await db
                    .select()
                    .from(table.proposals)
                    .leftJoin(table.jobs, eq(table.proposals.jobId, table.jobs.id))
                    .where(and(...conditions))
                    .orderBy(desc(table.proposals.createdAt))
                    .limit(limit)
                    .offset((page - 1) * limit)

                return reply.status(200).send(query.map((data) => toTypeBox(data.proposals)))
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
