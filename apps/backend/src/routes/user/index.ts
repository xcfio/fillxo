import { main } from "../../"
import Update from "./update"
import Me from "./me"

export default function User(fastify: Awaited<ReturnType<typeof main>>) {
    Me(fastify)
    Update(fastify)
}
