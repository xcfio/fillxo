import { CreateError, isFastifyError, toTypeBox } from "../../function"
import { ErrorResponse, Proposal } from "../../type"
import { amount, UUID } from "../../typebox"
import { db, table } from "../../database"
import { main } from "../../"
import { eq } from "drizzle-orm"
import Type from "typebox"

export default function PostProposal(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.route({
        method: "POST",
        url: "/proposal",
        schema: {
            description: "",
            tags: ["Proposal"],
            body: Type.Object({
                jobId: UUID,
                bidAmount: amount,
                coverLetter: Type.String({
                    minLength: 50,
                    maxLength: 2000,
                    examples: ["I am interested in this project because..."],
                    description: "Freelancer's cover letter"
                }),
                deliveryDays: Type.Integer({
                    minimum: 1,
                    maximum: 365,
                    examples: [7, 14, 30],
                    description: "Estimated delivery time in days"
                })
            }),
            response: {
                201: Proposal,
                400: ErrorResponse(400, "Bad Request - Validation error"),
                429: ErrorResponse(429, "Too many requests - rate limit exceeded"),
                500: ErrorResponse(500, "Internal server error")
            }
        },
        preHandler: fastify.auth,
        handler: async (request, reply) => {
            try {
                const { id } = request.user
                const { jobId, bidAmount, coverLetter, deliveryDays } = request.body

                const [job] = await db.select().from(table.jobs).where(eq(table.jobs.id, jobId))
                if (!job) throw CreateError(404, "JOB_NOT_FOUND", "Job not found")

                const [proposal] = await db
                    .insert(table.proposals)
                    .values({ bidAmount, coverLetter, deliveryDays, freelancerId: id, jobId: job.id })
                    .returning()

                return reply.status(201).send(toTypeBox(proposal))
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
