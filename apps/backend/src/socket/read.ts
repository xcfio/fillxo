import { db, table } from "../database"
import { and, eq, inArray, or } from "drizzle-orm"
import { AuthenticatedSocket } from "../type"

export default function MarkAsRead(socket: Required<AuthenticatedSocket>) {
    socket.on("mark_as_read", async (data) => {
        console.log("mark_as_read event received:", data)
        try {
            const { contractId, messageIds } = data
            const { user } = socket

            if (!contractId || !messageIds || messageIds.length === 0) {
                return socket.emit("error", { message: "Invalid request data", code: "INVALID_DATA" })
            }

            const [contract] = await db
                .select()
                .from(table.contracts)
                .where(
                    and(
                        eq(table.contracts.id, contractId),
                        or(eq(table.contracts.clientId, user.id), eq(table.contracts.freelancerId, user.id))
                    )
                )

            if (!contract) {
                return socket.emit("error", {
                    message: "Contract not found or access denied",
                    code: "CONTRACT_NOT_FOUND"
                })
            }

            const x = await db
                .update(table.messages)
                .set({ status: "read" })
                .where(
                    and(
                        inArray(table.messages.id, messageIds),
                        eq(table.messages.contracts, contractId),
                        // Mark as read if status is "sent" or "delivered" (not already "read" or "deleted")
                        or(eq(table.messages.status, "sent"), eq(table.messages.status, "delivered"))
                    )
                )
                .returning()

            const toSend = user.id === contract.clientId ? contract.freelancerId : contract.clientId
            socket.to(toSend).emit("messages_read", { contractId, messageIds, readBy: user.id })
        } catch (error) {
            console.error("Error marking messages as read:", error)
            socket.emit("error", { message: "Failed to mark messages as read", code: "MARK_READ_FAILED" })
        }
    })
}
