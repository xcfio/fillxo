import { xcf } from "../../function"
import { ErrorResponse } from "../../type"
import { amount } from "../../typebox"
import { main } from "../../"
import { Type } from "typebox"

export default function Rate(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.route({
        method: "GET",
        url: "/payments/rate",
        schema: {
            description: "Get current USD to BDT exchange rate and convert amounts",
            tags: ["Payments"],
            querystring: Type.Partial(Type.Object({ amount })),
            response: {
                200: Type.Object({
                    rate: Type.Number({ description: "Current USD to BDT exchange rate" }),
                    usdCents: Type.Integer({ description: "Input amount in USD cents" }),
                    bdt: Type.Integer({ description: "Amount in BDT" })
                }),
                400: ErrorResponse(400, "Bad Request - Validation error"),
                429: ErrorResponse(429, "Too many requests - rate limit exceeded"),
                500: ErrorResponse(500, "Internal server error")
            }
        },
        preHandler: fastify.auth,
        handler: async (request, reply) => {
            try {
                const { amount: usdCents = 100 } = request.query

                const query = (await (await fetch("https://open.er-api.com/v6/latest/USD")).json()) as Rate
                const rate = query.rates.BDT

                const rateInt = Math.ceil(rate * 100)
                const bdt = Math.round((usdCents * rateInt) / 10000)

                return reply.status(200).send({ rate, usdCents, bdt })
            } catch (error) {
                await xcf(error as any)
            }
        }
    })
}

type Rate = {
    result: string
    provider: string
    documentation: string
    terms_of_use: string
    time_last_update_unix: number
    time_last_update_utc: string
    time_next_update_unix: number
    time_next_update_utc: string
    time_eol_unix: number
    base_code: string
    rates: { BDT: number }
}
