import { randomInt, timingSafeEqual } from "node:crypto"
import { Email } from "./front-end"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)
const map = new Map<string, { otp: string; expires: number }>()

setInterval(() => {
    for (const [email, data] of map.entries()) if (Date.now() > data.expires) map.delete(email)
}, 60000)

export function VerifyOTP(email: string, otp: string): boolean {
    const stored = map.get(email)
    if (!stored) return false

    if (!timingSafeEqual(Buffer.from(stored.otp), Buffer.from(otp))) return false
    if (stored.expires < Date.now()) return false

    map.delete(email)
    return true
}

export async function SendOTP(email: string): Promise<{ email: string; otp: string }> {
    const otp = randomInt(100000, 1000000).toString()
    map.set(email, { otp, expires: Date.now() + 10 * 60 * 1000 })
    if (process.env.NODE_ENV === "development") console.log(`OTP for ${email}: ${otp}`)

    await resend.emails.send({
        from: "fillxo <no-reply@fillxo.xcfio.space>",
        to: [process.env.NODE_ENV === "development" ? "delivered@resend.dev" : email],
        subject: "Your fillxo Verification Code",
        html: Email(otp),
        text: `Your fillxo verification code is: ${otp}\n\nIf you didn't request this code, please ignore this email.`
    })

    return { email, otp }
}
