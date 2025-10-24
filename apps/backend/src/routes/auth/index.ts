import { main } from "../../"
import Register from "./register"

export default function OAuth2(fastify: Awaited<ReturnType<typeof main>>) {
    Register(fastify)
}
