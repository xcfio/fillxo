import { AuthenticatedSocket } from "../type"

export default async function TypingStatusChanged(socket: Required<AuthenticatedSocket>) {
    socket.on("typing", async (status) => {
        try {
            const { contract, user } = socket
            const toSend = user.id === contract.clientId ? contract.freelancerId : contract.clientId
            socket.to(toSend).emit("typing", toSend, status)
        } catch (error) {
            console.error(error)
            socket.emit("error", { message: "Internal Server Error", code: "INTERNAL_SERVER_ERROR" })
        }
    })
}
