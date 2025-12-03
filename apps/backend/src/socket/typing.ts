import { AuthenticatedSocket } from "../type"

export default async function TypingStatusChanged(socket: Required<AuthenticatedSocket>) {
    socket.on("typing", async (contractId: string, status: "started" | "stopped") => {
        try {
            const { contract, user } = socket

            const ct = contract.find((c) => c.id === contractId)
            if (!ct) return socket.emit("error", { message: "Contract not found", code: "CONTRACT_NOT_FOUND" })

            const toSend = user.id === ct.clientId ? ct.freelancerId : ct.clientId
            socket.to(toSend).emit("typing", user.id, status)
        } catch (error) {
            console.error(error)
            socket.emit("error", { message: "Internal Server Error", code: "INTERNAL_SERVER_ERROR" })
        }
    })
}
