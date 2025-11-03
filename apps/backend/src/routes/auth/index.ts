import { main } from "../../"
import Register from "./register"
import Verify from "./verify"
import Logout from "./logout"
import Login from "./login"
import Reset from "./reset"

export default function Auth(fastify: Awaited<ReturnType<typeof main>>) {
    Register(fastify)
    Verify(fastify)
    Logout(fastify)
    Login(fastify)
    Reset(fastify)
}
