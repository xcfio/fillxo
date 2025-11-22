import { CreateError, isFastifyError, toTypeBox } from "../../function"
import { ErrorResponse, Job } from "../../type"
import { db, table } from "../../database"
import { main } from "../.."
import { desc } from "drizzle-orm"
import Type from "typebox"

export default function GetJobs(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.route({
        method: "GET",
        url: "/job",
        schema: {
            description: "Authenticate user and initiate a session",
            tags: ["Job"],
            querystring: Type.Partial(
                Type.Object({
                    page: Type.Number({ minimum: 1, default: 1, description: "Page number" }),
                    limit: Type.Number({ minimum: 1, maximum: 100, default: 20, description: "Conversations per page" })
                })
            ),
            response: {
                200: Type.Array(Job),
                403: ErrorResponse(403, "Forbidden - Incorrect username/email or password"),
                404: ErrorResponse(404, "Not Found - User Not found"),
                429: ErrorResponse(429, "Too many requests - rate limit exceeded"),
                500: ErrorResponse(500, "Internal server error")
            }
        },
        handler: async (request, reply) => {
            try {
                const { page = 1, limit = 20 } = request.query
                const job = await db
                    .select()
                    .from(table.jobs)
                    .orderBy(desc(table.jobs.createdAt))
                    .limit(limit)
                    .offset((page - 1) * limit)

                return reply
                    .status(200)
                    .send(job.map((x) => ({ ...toTypeBox(x), proposalCount: x.proposalCount ?? 0 })))
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
