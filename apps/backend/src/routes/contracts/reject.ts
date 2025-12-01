import { CreateError, isFastifyError, SendNotification, toTypeBox } from "../../function"
import { ErrorResponse, Contract } from "../../type"
import { db, table } from "../../database"
import { UUID } from "../../typebox"
import { main } from "../.."
import { eq, and } from "drizzle-orm"
import { Type } from "typebox"

export default function Rejected(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.route({
        method: "PUT",
        url: "/contracts/:id/reject",
        schema: {
            description: "Reject a contract that requires payment",
            tags: ["Contracts"],
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

                const [OldContract] = await db
                    .select()
                    .from(table.contracts)
                    .where(and(eq(table.contracts.id, id), eq(table.contracts.clientId, clientId)))

                if (!OldContract) throw CreateError(404, "NOT_FOUND", "No contracts found")
                if (OldContract.status !== "payment-required") {
                    throw CreateError(400, "INVALID_STATUS", "Contract cannot be rejected because it is already active")
                }

                const [contract] = await db
                    .update(table.contracts)
                    .set({ status: "cancelled" })
                    .where(and(eq(table.contracts.id, id), eq(table.contracts.clientId, clientId)))
                    .returning()

                await SendNotification(
                    contract.freelancerId,
                    "Contract Rejected",
                    `Your contract ${contract.id} has been rejected by the client.`,
                    `/contracts/${contract.id}`
                )

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
