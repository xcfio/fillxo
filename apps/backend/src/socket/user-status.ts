import { AuthenticatedSocket } from "../type"

export default async function UserStatusChanged(socket: Required<AuthenticatedSocket>) {
    try {
        const { user, contract: contracts } = socket
        const relatedUserIds = [
            ...new Set(contracts.map((c) => (user.id === c.clientId ? c.freelancerId : c.clientId)))
        ]

        for (const userId of relatedUserIds) {
            socket.to(userId).emit("user_status_changed", user.id, "online")
            if ((await socket.in(userId).fetchSockets()).length > 0) {
                socket.emit("user_status_changed", userId, "online")
            }
        }

        socket.on("disconnect", () => {
            for (const userId of relatedUserIds) {
                socket.to(userId).emit("user_status_changed", user.id, "offline")
            }
        })
    } catch (error) {
        console.error(error)
        socket.emit("error", { message: "Failed to update user status", code: "STATUS_UPDATE_ERROR" })
    }
}
