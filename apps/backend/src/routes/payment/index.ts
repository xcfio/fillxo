import { main } from "../../"
import GetPaymentId from "./get-payment-id"
import PostPayment from "./post-payment"
import GetPayment from "./get-payment"
import Rate from "./rate"

export default function Payment(fastify: Awaited<ReturnType<typeof main>>) {
    GetPaymentId(fastify)
    PostPayment(fastify)
    GetPayment(fastify)
    Rate(fastify)
}
