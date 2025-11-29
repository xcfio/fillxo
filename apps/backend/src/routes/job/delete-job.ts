import { CreateError, isFastifyError } from "../../function"
import { ErrorResponse } from "../../type"
import { db, table } from "../../database"
import { main } from "../.."
import { eq } from "drizzle-orm"
import Type from "typebox"
import { UUID } from "../../typebox"

export default function DeleteJob(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.route({
        method: "DELETE",
        url: "/job/:id",
        schema: {
            description: "Delete a job by ID",
            tags: ["Job"],
            params: Type.Object({ id: UUID }),
            response: {
                200: Type.Object({ success: Type.Boolean() }),
                404: ErrorResponse(404, "Not Found - Job Not found"),
                403: ErrorResponse(403, "Forbidden - You do not have permission to delete this job"),
                429: ErrorResponse(429, "Too many requests - rate limit exceeded"),
                500: ErrorResponse(500, "Internal server error")
            }
        },
        preHandler: fastify.auth,
        handler: async (request, reply) => {
            try {
                const { id } = request.params
                const { id: client } = request.user
                const [job] = await db.select().from(table.jobs).where(eq(table.jobs.id, id))

                if (!job) throw CreateError(404, "JOB_NOT_FOUND", "Job Not found")
                if (job.clientId !== client) {
                    throw CreateError(403, "FORBIDDEN", "You do not have permission to delete this job")
                }

                await db.delete(table.jobs).where(eq(table.jobs.id, id))
                return reply.status(200).send({ success: true })
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
