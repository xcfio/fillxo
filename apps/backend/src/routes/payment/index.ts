import { main } from "../../"
import GetPaymentByProposal from "./get-payment-proposal"
import GetPaymentId from "./get-payment-id"
import PostPayment from "./post-payment"
import GetPayment from "./get-payment"
import Verify from "./critical-verify"
import Payout from "./critical-payout"
import PostPayout from "./post-payout"
import Rate from "./rate"

export default function Payment(fastify: Awaited<ReturnType<typeof main>>) {
    GetPaymentByProposal(fastify)
    GetPaymentId(fastify)
    PostPayment(fastify)
    PostPayout(fastify)
    GetPayment(fastify)
    Verify(fastify)
    Payout(fastify)
    Rate(fastify)
}
