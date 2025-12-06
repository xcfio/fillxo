import { toTypeBox, xcf } from "../../function"
import { ErrorResponse, Job } from "../../type"
import { db, table } from "../../database"
import { main } from "../../"
import { and, desc, eq } from "drizzle-orm"
import { Type } from "typebox"
import { UUID } from "../../typebox"

export default function GetJob(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.route({
        method: "GET",
        url: "/job",
        schema: {
            description: "Get paginated list of jobs",
            tags: ["Job"],
            querystring: Type.Partial(
                Type.Object({
                    clientId: UUID,
                    page: Type.Integer({ minimum: 1, default: 1, description: "Page number" }),
                    limit: Type.Integer({ minimum: 1, maximum: 100, default: 20, description: "Jobs per page" })
                })
            ),
            response: {
                200: Type.Array(Job),
                429: ErrorResponse(429, "Too many requests - rate limit exceeded"),
                500: ErrorResponse(500, "Internal server error")
            }
        },
        handler: async (request, reply) => {
            try {
                const { clientId, page = 1, limit = 20 } = request.query
                const jobs = await db
                    .select()
                    .from(table.jobs)
                    .where(and(clientId ? eq(table.jobs.clientId, clientId) : undefined, eq(table.jobs.isOpen, true)))
                    .orderBy(desc(table.jobs.createdAt))
                    .limit(limit)
                    .offset((page - 1) * limit)

                return reply.status(200).send(jobs.map((x) => toTypeBox(x)))
            } catch (error) {
                await xcf(error as any)
            }
        }
    })
}
