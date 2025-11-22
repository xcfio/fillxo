import { main } from "../../"
import Register from "./register"
import Send_OTP from "./send-otp"
import Logout from "./logout"
import Login from "./login"
import ResetPassword from "./reset-password"

export default function Auth(fastify: Awaited<ReturnType<typeof main>>) {
    Register(fastify)
    Send_OTP(fastify)
    Logout(fastify)
    Login(fastify)
    ResetPassword(fastify)
}
