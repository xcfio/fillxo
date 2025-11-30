import { main } from "../../"
import Profile from "./profile"
import Update from "./update"
import Me from "./me"

export default function User(fastify: Awaited<ReturnType<typeof main>>) {
    Profile(fastify)
    Update(fastify)
    Me(fastify)
}
