import { CreateError, isFastifyError, toTypeBox } from "../../function"
import { ErrorResponse, Contract } from "../../type"
import { db, table } from "../../database"
import { UUID } from "../../typebox"
import { main } from "../../"
import { eq, and, or } from "drizzle-orm"
import { Type } from "typebox"

export default function GetContractId(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.route({
        method: "GET",
        url: "/contracts/:id",
        schema: {
            description: "Get a contract by ID",
            tags: ["Contract"],
            params: Type.Object({ id: UUID }),
            response: {
                200: Contract,
                400: ErrorResponse(400, "Bad Request - Validation error"),
                404: ErrorResponse(404, "Not Found - No contracts found"),
                429: ErrorResponse(429, "Too many requests - rate limit exceeded"),
                500: ErrorResponse(500, "Internal server error")
            }
        },
        preHandler: fastify.auth,
        handler: async (request, reply) => {
            try {
                const { id: clientId } = request.user
                const { id } = request.params

                const [contract] = await db
                    .select()
                    .from(table.contracts)
                    .where(
                        and(
                            eq(table.contracts.id, id),
                            or(eq(table.contracts.clientId, clientId), eq(table.contracts.freelancerId, clientId))
                        )
                    )

                if (!contract) throw CreateError(404, "NOT_FOUND", "No contracts found")
                return reply.status(200).send(toTypeBox(contract))
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
