import { main } from "../.."
import DeleteNotifications from "./delete-notifications"
import MarkAllReadNotifications from "./mark-all-read"
import GetNotifications from "./get-notifications"
import MarkReadNotifications from "./mark-read"

export default function Notifications(fastify: Awaited<ReturnType<typeof main>>) {
    MarkAllReadNotifications(fastify)
    MarkReadNotifications(fastify)
    DeleteNotifications(fastify)
    GetNotifications(fastify)
}
