import { main } from "../../"
import Update from "./update"
import Me from "./me"
import Profile from "./profile"

export default function User(fastify: Awaited<ReturnType<typeof main>>) {
    Me(fastify)
    Update(fastify)
    Profile(fastify)
}
