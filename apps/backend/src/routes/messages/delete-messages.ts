import { CreateError, isFastifyError } from "../../function"
import { ErrorResponse } from "../../type"
import { db, table } from "../../database"
import { UUID } from "../../typebox"
import { main } from "../.."
import { eq } from "drizzle-orm"
import { Type } from "typebox"

export default function DeleteMessages(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.route({
        method: "DELETE",
        url: "/messages/:id",
        schema: {
            description: "Delete a message in a contract",
            tags: ["Message"],
            params: Type.Object({ id: UUID }),

            response: {
                200: Type.Object({ id: UUID }),
                400: ErrorResponse(400, "Bad Request - Validation error"),
                401: ErrorResponse(401, "Unauthorized - Authentication required"),
                403: ErrorResponse(403, "Forbidden - You are not authorized to send message for this contract"),
                404: ErrorResponse(404, "Not Found - Contract not found"),
                429: ErrorResponse(429, "Too many requests - rate limit exceeded"),
                500: ErrorResponse(500, "Internal server error")
            }
        },
        preHandler: fastify.auth,
        handler: async (request, reply) => {
            try {
                const { id } = request.user
                const { id: messageId } = request.params

                const [message] = await db.select().from(table.messages).where(eq(table.messages.id, messageId))

                if (!message || message.status === "deleted") {
                    throw CreateError(404, "MESSAGE_NOT_FOUND", "Message not found")
                }

                if (message.sender !== id) {
                    throw CreateError(403, "FORBIDDEN", "You are not authorized to edit this message")
                }

                const [messages] = await db
                    .update(table.messages)
                    .set({ status: "deleted", editedAt: new Date() })
                    .where(eq(table.messages.id, messageId))
                    .returning()

                const [contract] = await db
                    .select()
                    .from(table.contracts)
                    .where(eq(table.contracts.id, message.contracts))

                const toSend = id === contract.clientId ? contract.freelancerId : contract.clientId
                fastify.io.to(toSend).emit("message_deleted", message.id)
                return reply.status(200).send({ id: messages.id })
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
