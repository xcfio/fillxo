import AuthGithub from "./github"
import { main } from "../../"

export default function OAuth2(fastify: Awaited<ReturnType<typeof main>>) {
    AuthGithub(fastify)
}
