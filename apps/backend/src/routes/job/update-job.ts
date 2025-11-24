import { CreateError, isFastifyError, toTypeBox } from "../../function"
import { ErrorResponse, Job } from "../../type"
import { db, table } from "../../database"
import { main } from "../.."
import Type from "typebox"
import { UUID } from "../../typebox"
import { eq } from "drizzle-orm"

export default function UpdateJob(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.route({
        method: "PATCH",
        url: "/job/:id",
        schema: {
            description: "Create a new job posting",
            tags: ["Job"],
            params: Type.Object({ id: UUID }),
            body: Type.Pick(Job, ["title", "description", "category", "skills", "budget", "closedAt"]),
            response: {
                200: Job,
                400: ErrorResponse(400, "Bad Request - Validation error"),
                403: ErrorResponse(403, "Forbidden - You do not have permission to access this resource"),
                404: ErrorResponse(404, "Not Found - Job does not exist"),
                429: ErrorResponse(429, "Too many requests - rate limit exceeded"),
                500: ErrorResponse(500, "Internal server error")
            }
        },
        preHandler: fastify.auth,
        handler: async (request, reply) => {
            try {
                const { id: clientId } = request.user
                const { id } = request.params

                const [OldJob] = await db.select().from(table.jobs).where(eq(table.jobs.id, id))
                if (!OldJob) throw CreateError(404, "NOT_FOUND", "Job does not exist")

                if (OldJob.clientId !== clientId) {
                    throw CreateError(403, "FORBIDDEN", "You do not have permission to access this resource")
                }

                const [job] = await db
                    .update(table.jobs)
                    .set({
                        ...request.body,
                        closedAt: request.body.closedAt ? new Date(request.body.closedAt) : undefined
                    })
                    .returning()

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
