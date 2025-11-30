import { main } from "../../"
import ResetPassword from "./reset-password"
import Register from "./register"
import Send_OTP from "./send-otp"
import Logout from "./logout"
import Login from "./login"

export default function Auth(fastify: Awaited<ReturnType<typeof main>>) {
    ResetPassword(fastify)
    Register(fastify)
    Send_OTP(fastify)
    Logout(fastify)
    Login(fastify)
}
