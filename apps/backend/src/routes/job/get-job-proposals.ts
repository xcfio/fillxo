import { CreateError, isFastifyError, toTypeBox } from "../../function"
import { ErrorResponse, Proposal } from "../../type"
import { db, table } from "../../database"
import { main } from "../.."
import { eq } from "drizzle-orm"
import Type from "typebox"

export default function GetJobProposals(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.route({
        method: "GET",
        url: "/job/:id/proposals",
        schema: {
            description: "Get all proposals for a specific job by ID",
            tags: ["Job"],
            params: Type.Object({ id: Type.String() }),
            response: {
                200: Type.Array(Proposal),
                403: ErrorResponse(403, "Forbidden - You do not have permission to view these proposals"),
                404: ErrorResponse(404, "Not Found - Job Not found"),
                429: ErrorResponse(429, "Too many requests - rate limit exceeded"),
                500: ErrorResponse(500, "Internal server error")
            }
        },
        preHandler: fastify.auth,
        handler: async (request, reply) => {
            try {
                const { id: client } = request.user
                const { id } = request.params

                const [job] = await db.select().from(table.jobs).where(eq(table.jobs.id, id))
                if (!job) throw CreateError(404, "JOB_NOT_FOUND", "Job Not found")
                if (job.clientId !== client) {
                    throw CreateError(403, "FORBIDDEN", "You do not have permission to view these proposals")
                }

                const proposal = await db.select().from(table.proposals).where(eq(table.proposals.jobId, id))
                return reply.status(200).send(proposal.map((x) => toTypeBox(x)))
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
