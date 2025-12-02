import { main } from "../../"
import GetConversations from "./get-conversations"
import DeleteMessages from "./delete-messages"
import PostMessages from "./post-messages"
import EditMessages from "./edit-messages"
import GetMessages from "./get-messages"

export default function Messages(fastify: Awaited<ReturnType<typeof main>>) {
    GetConversations(fastify)
    DeleteMessages(fastify)
    PostMessages(fastify)
    EditMessages(fastify)
    GetMessages(fastify)
}
