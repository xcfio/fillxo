import { randomInt, timingSafeEqual } from "node:crypto"
import { Email } from "./front-end"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)
const otpStore = new Map<string, { otp: string; expires: number }>()

setInterval(() => {
    for (const [email, data] of otpStore.entries()) if (Date.now() > data.expires) otpStore.delete(email)
}, 60000)

export function VerifyOTP(email: string, otp: string): boolean {
    const stored = otpStore.get(email)
    if (!stored) return false

    if (!timingSafeEqual(Buffer.from(stored.otp), Buffer.from(otp))) return false
    if (stored.expires < Date.now()) return false

    otpStore.delete(email)
    return true
}

export async function SendOTP(email: string): Promise<{ email: string; otp: string }> {
    const otp = randomInt(100000, 1000000).toString()
    otpStore.set(email, { otp, expires: Date.now() + 10 * 60 * 1000 })

    await resend.emails.send({
        from: "fillxo <no-reply@xcfio.space>",
        to: [email],
        subject: "Your fillxo Verification Code",
        html: Email(otp),
        text: `Your fillxo verification code is: ${otp}\n\nIf you didn't request this code, please ignore this email.`
    })

    return { email, otp }
}
