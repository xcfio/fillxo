import { CreateError, isFastifyError, toTypeBox } from "../../function"
import { ErrorResponse, Message } from "../../type"
import { db, table } from "../../database"
import { UUID } from "../../typebox"
import { main } from "../../"
import { eq } from "drizzle-orm"
import { Type } from "typebox"

export default function PostMessages(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.route({
        method: "POST",
        url: "/messages/:id",
        schema: {
            description: "Create a new message in a contract",
            tags: ["Message"],
            params: Type.Object({ id: UUID }),
            body: Type.Object({
                content: Type.String({ description: "Content of the message", minLength: 1, maxLength: 2000 })
            }),
            response: {
                200: Message,
                400: ErrorResponse(400, "Bad Request - Validation error"),
                403: ErrorResponse(403, "Forbidden - You are not authorized to send message for this contract"),
                404: ErrorResponse(404, "Not Found - Contract not found"),
                429: ErrorResponse(429, "Too many requests - rate limit exceeded"),
                500: ErrorResponse(500, "Internal server error")
            }
        },
        handler: async (request, reply) => {
            try {
                const { id } = request.user
                const { id: contractId } = request.params
                const { content } = request.body

                const [contract] = await db.select().from(table.contracts).where(eq(table.contracts.id, contractId))

                if (!contract) {
                    throw CreateError(404, "CONTRACT_NOT_FOUND", "Contract not found")
                }

                if (contract.clientId !== id && contract.freelancerId !== id) {
                    throw CreateError(403, "FORBIDDEN", "You are not authorized to send message for this contract")
                }

                if (contract.status !== "active") {
                    throw CreateError(400, "INVALID_STATUS", "Contract is not active")
                }

                const [messages] = await db
                    .insert(table.messages)
                    .values({
                        content,
                        contracts: contract.id,
                        sender: id
                    })
                    .returning()

                const toSend = id === contract.clientId ? contract.freelancerId : contract.clientId
                fastify.io.to(toSend).emit("message_created", toTypeBox(messages))
                return reply.status(200).send(toTypeBox(messages))
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
