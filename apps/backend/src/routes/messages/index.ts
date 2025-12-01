import { main } from "../../"
import DeleteMessages from "./delete-messages"
import EditMessages from "./edit-messages"
import GetMessages from "./get-messages"
import PostMessages from "./post-messages"

export default function Messages(fastify: Awaited<ReturnType<typeof main>>) {
    DeleteMessages(fastify)
    EditMessages(fastify)
    GetMessages(fastify)
    PostMessages(fastify)
}
