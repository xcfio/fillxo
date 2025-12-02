import { AuthenticatedSocket } from "../type"

export default async function UserStatusChanged(socket: Required<AuthenticatedSocket>) {
    try {
        const { user, contract } = socket
        const otherUserId = user.id === contract.clientId ? contract.freelancerId : contract.clientId

        socket.to(otherUserId).emit("user_status_changed", user.id, "online")

        const otherUserSockets = await socket.in(otherUserId).fetchSockets()
        if (otherUserSockets.length > 0) {
            socket.emit("user_status_changed", otherUserId, "online")
        }

        socket.on("disconnect", () => socket.to(otherUserId).emit("user_status_changed", user.id, "offline"))
    } catch (error) {
        console.error(error)
        socket.emit("error", { message: "Failed to update user status", code: "STATUS_UPDATE_ERROR" })
    }
}
