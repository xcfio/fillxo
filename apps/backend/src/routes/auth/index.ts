import { main } from "../../"
import Register from "./register"
import Verify from "./verify"
import Logout from "./logout"
import Login from "./login"
import Me from "./me"

export default function Auth(fastify: Awaited<ReturnType<typeof main>>) {
    Register(fastify)
    Verify(fastify)
    Logout(fastify)
    Login(fastify)
    Me(fastify)
}
