import { AuthenticatedSocket } from "../type"

export default async function UserStatusChanged(socket: Required<AuthenticatedSocket>) {
    try {
        const { user, contract } = socket
        const toSend = user.id === contract.clientId ? contract.freelancerId : contract.clientId
        socket.to(toSend).emit("user_status_changed", toSend, "online")

        socket.on("disconnect", () => socket.to(toSend).emit("user_status_changed", toSend, "offline"))
    } catch (error) {
        console.error(error)
        socket.emit("error", { message: "Failed to update user status", code: "STATUS_UPDATE_ERROR" })
    }
}
