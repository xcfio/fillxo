import { db, table } from "../database"
import { and, eq, inArray } from "drizzle-orm"
import { AuthenticatedSocket } from "../type"

export default async function MarkAsRead(socket: Required<AuthenticatedSocket>) {
    socket.on("mark_as_read", async (data) => {
        try {
            const { contractId, messageIds } = data
            const { contract, user } = socket

            if (!contractId || !messageIds || messageIds.length === 0) {
                return socket.emit("error", { message: "Invalid request data", code: "INVALID_DATA" })
            }

            await db
                .update(table.messages)
                .set({ status: "read" })
                .where(
                    and(
                        inArray(table.messages.id, messageIds),
                        eq(table.messages.contracts, contractId),
                        eq(table.messages.status, "delivered")
                    )
                )

            const toSend = user.id === contract.clientId ? contract.freelancerId : contract.clientId
            socket.to(toSend).emit("messages_read", { contractId, messageIds, readBy: socket.user.id })
        } catch (error) {
            console.error("Error marking messages as read:", error)
            socket.emit("error", { message: "Failed to mark messages as read", code: "MARK_READ_FAILED" })
        }
    })
}
