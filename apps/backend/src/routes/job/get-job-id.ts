import { CreateError, isFastifyError, toTypeBox } from "../../function"
import { ErrorResponse, Job } from "../../type"
import { db, table } from "../../database"
import { main } from "../.."
import { eq } from "drizzle-orm"
import Type from "typebox"
import { UUID } from "../../typebox"

export default function GetJobWithID(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.route({
        method: "GET",
        url: "/job/:id",
        schema: {
            description: "Get job details by ID",
            tags: ["Job"],
            params: Type.Object({ id: UUID }),
            response: {
                200: Job,
                404: ErrorResponse(404, "Not Found - Job Not found"),
                429: ErrorResponse(429, "Too many requests - rate limit exceeded"),
                500: ErrorResponse(500, "Internal server error")
            }
        },
        handler: async (request, reply) => {
            try {
                const { id } = request.params
                const [job] = await db.select().from(table.jobs).where(eq(table.jobs.id, id))
                if (!job) throw CreateError(404, "JOB_NOT_FOUND", "Job Not found")
                return reply.status(200).send(toTypeBox(job))
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
