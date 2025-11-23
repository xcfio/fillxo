import { CreateError, isFastifyError } from "../../function"
import { ErrorResponse } from "../../type"
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
                200: Type.Object({ success: Type.Boolean() }),
                403: ErrorResponse(403, "Forbidden - You do not have permission to view these proposals"),
                404: ErrorResponse(404, "Not Found - Job Not found"),
                429: ErrorResponse(429, "Too many requests - rate limit exceeded"),
                500: ErrorResponse(500, "Internal server error")
            }
        },
        preHandler: fastify.auth,
        handler: async (request, reply) => {
            try {
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
