import { CreateError, isFastifyError, toTypeBox } from "../../function"
import { ErrorResponse, Job } from "../../type"
import { db, table } from "../../database"
import { main } from "../../"
import { Type } from "typebox"

export default function PostJob(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.route({
        method: "POST",
        url: "/job",
        schema: {
            description: "Create a new job posting",
            tags: ["Job"],
            body: Type.Pick(Job, ["title", "description", "category", "skills", "budget", "closedAt"]),
            response: {
                201: Job,
                400: ErrorResponse(400, "Bad Request - Validation error"),
                429: ErrorResponse(429, "Too many requests - rate limit exceeded"),
                500: ErrorResponse(500, "Internal server error")
            }
        },
        preHandler: fastify.auth,
        handler: async (request, reply) => {
            try {
                const { id } = request.user
                const { closedAt } = request.body

                const [job] = await db
                    .insert(table.jobs)
                    .values({ ...request.body, clientId: id, closedAt: new Date(closedAt) })
                    .returning()

                return reply.status(201).send(toTypeBox(job))
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
