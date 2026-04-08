import { CreateError, toTypeBox, xcf } from "../../function"
import { ErrorResponse, Payments } from "../../type"
import { db, table } from "../../database"
import { main } from "../.."
import { Type } from "typebox"
import { eq } from "drizzle-orm"

export default function PostPayout(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.route({
        method: "POST",
        url: "/payments/payout",
        schema: {
            description: "Create a new payout for an accepted proposal",
            tags: ["Payments"],
            body: Type.Pick(Payments, ["contractId", "receiverNumber", "payoutMethod"]),
            response: {
                201: Payments,
                400: ErrorResponse(400, "Bad Request - Validation error"),
                403: ErrorResponse(403, "Forbidden - You are not authorized to make payment for this contract"),
                404: ErrorResponse(404, "Not Found - Contract not found"),
                409: ErrorResponse(409, "Conflict - Payment already exists for this contract"),
                429: ErrorResponse(429, "Too many requests - rate limit exceeded"),
                500: ErrorResponse(500, "Internal server error")
            }
        },
        preHandler: fastify.auth,
        handler: async (request, reply) => {
            try {
                const { id } = request.user
                const { contractId, payoutMethod, receiverNumber } = request.body

                const [contracts] = await db.select().from(table.contracts).where(eq(table.contracts.id, contractId))

                if (!contracts) {
                    throw CreateError(404, "CONTRACT_NOT_FOUND", "Contract not found")
                }

                if (contracts.freelancerId !== id) {
                    throw CreateError(403, "FORBIDDEN", "You are not authorized to add payout for this contract")
                }

                if (contracts.status !== "completed") {
                    throw CreateError(400, "INVALID_STATUS", "Contract is not completed")
                }

                const PaymentToPay = (
                    await db.select().from(table.payments).where(eq(table.payments.contractId, contracts.id))
                )
                    .filter((x) => x.status === "verified")
                    .shift()

                if (!PaymentToPay) {
                    throw CreateError(409, "PAYMENT_EXISTS", "Payment is not verified for this contract")
                }

                const [payment] = await db
                    .update(table.payments)
                    .set({ payoutMethod, receiverNumber })
                    .where(eq(table.payments.id, PaymentToPay.id))
                    .returning()

                return reply.status(201).send(toTypeBox(payment))
            } catch (error) {
                await xcf(error as any)
            }
        }
    })
}
