import { AuthenticatedSocket, Message, Payload } from "../type"
import { and, eq, or } from "drizzle-orm"
import { db, table } from "../database"
import { main } from "../"
import MarkAsRead from "./read"
import UserStatusChanged from "./user-status"
import TypingStatusChanged from "./typing"

export interface ClientToServerEvents {
    mark_as_read: (data: { contractId: string; messageIds: string[] }) => void
    typing: (contractId: string, status: "started" | "stopped") => void
}

export interface ServerToClientEvents {
    user_status_changed: (userId: string, status: "online" | "offline") => void
    message_created: (message: Message) => void
    message_edited: (message: Message) => void
    message_deleted: (message: string) => void
    messages_read: (data: { contractId: string; messageIds: string[]; readBy: string }) => void
    typing: (userId: string, status: "started" | "stopped") => void
    error: (data: { message: string; code: string }) => void
}

export default (fastify: Awaited<ReturnType<typeof main>>) => async (socket: AuthenticatedSocket) => {
    console.log(`Socket ${socket.id} attempting to connect`)

    try {
        const cookieHeader = socket.handshake.headers.cookie

        if (!cookieHeader) {
            console.log(`Socket ${socket.id}: No cookies provided`)
            socket.emit("error", { message: "Authentication required", code: "NO_COOKIES" })
            socket.disconnect(true)
            return
        }

        const cookies = fastify.parseCookie(cookieHeader)
        const authCookie = cookies.auth

        if (!authCookie) {
            console.log(`Socket ${socket.id}: No auth cookie found`)
            socket.emit("error", {
                message: "Authentication token not found",
                code: "NO_AUTH_COOKIE"
            })
            socket.disconnect(true)
            return
        }

        const tokenParts = authCookie.split(".")
        const cleanToken = tokenParts.length >= 3 ? tokenParts.slice(0, 3).join(".") : authCookie
        const decoded = fastify.jwt.verify(cleanToken) as Payload

        console.log(`User ${decoded.id} connected with socket ${socket.id}`)

        const [user] = await db
            .select()
            .from(table.users)
            .where(and(eq(table.users.isBanned, false), eq(table.users.id, decoded.id)))

        if (!user) {
            console.log(`Socket ${socket.id}: User does not exist`)
            socket.emit("error", { message: "User does not exist", code: "USER_NOT_FOUND" })
            socket.disconnect(true)
            return
        }

        const contract = await db
            .select()
            .from(table.contracts)
            .where(and(or(eq(table.contracts.clientId, user.id), eq(table.contracts.freelancerId, user.id))))

        if (!contract.length) {
            console.log(`Socket ${socket.id}: Contract not found or access denied`)
            socket.emit("error", { message: "Contract not found or access denied", code: "CONTRACT_NOT_FOUND" })
            socket.disconnect(true)
            return
        }

        socket.user = user
        socket.contract = contract
        socket.join(socket.user.id)

        MarkAsRead(socket as Required<AuthenticatedSocket>)
        UserStatusChanged(socket as Required<AuthenticatedSocket>)
        TypingStatusChanged(socket as Required<AuthenticatedSocket>)
    } catch (error) {
        console.error(`Socket ${socket.id} authentication failed:`, error)
        socket.emit("error", {
            message: "Invalid authentication token",
            code: "AUTH_FAILED"
        })
        socket.disconnect(true)
        return
    }

    socket.on("disconnect", (reason) => {
        console.log(`User ${socket.user?.username} (${socket.user?.id}) disconnected: ${reason}`)
    })

    socket.on("error", (error) => {
        console.error(`Socket error for user ${socket.user?.name}:`, error)
    })

    console.log(`Socket connection established for ${socket.user.name}`)
}
