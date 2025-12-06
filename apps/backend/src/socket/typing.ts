import { and, or, eq } from "drizzle-orm"
import { db, table } from "../database"
import { AuthenticatedSocket } from "../type"

export default async function TypingStatusChanged(socket: Required<AuthenticatedSocket>) {
    socket.on("typing", async (contractId: string, status: "started" | "stopped") => {
        try {
            const { user } = socket

            const [ct] = await db
                .select()
                .from(table.contracts)
                .where(
                    and(
                        or(eq(table.contracts.clientId, user.id), eq(table.contracts.freelancerId, user.id)),
                        eq(table.contracts.status, "active"),
                        eq(table.contracts.id, contractId)
                    )
                )

            if (!ct) return socket.emit("error", { message: "Contract not found", code: "CONTRACT_NOT_FOUND" })
            const toSend = user.id === ct.clientId ? ct.freelancerId : ct.clientId
            socket.to(toSend).emit("typing", user.id, status)
        } catch (error) {
            console.error(error)
            socket.emit("error", { message: "Internal Server Error", code: "INTERNAL_SERVER_ERROR" })
        }
    })
}
