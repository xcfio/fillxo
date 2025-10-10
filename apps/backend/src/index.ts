import { CreateError, isFastifyError, license, ValidationErrorHandler } from "./function"
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox"
import { FastifyReply, FastifyRequest } from "fastify"
import { Value } from "@sinclair/typebox/value"
import Fastify from "fastify"
import Plugin from "./plugin"

export async function main() {
    const isDevelopment = process.env.NODE_ENV === "development"
    const fastify = Fastify({
        trustProxy: true,
        logger: {
            formatters: { level: (level, number) => ({ level: `${level} (${number})` }) },
            file: isDevelopment ? "./log.json" : undefined
        },
        schemaErrorFormatter: ValidationErrorHandler
    }).withTypeProvider<TypeBoxTypeProvider>()

    fastify.get("/status", (_, reply) => reply.code(200).send("OK"))
    await Plugin(fastify)

    fastify.get("/license", () => license)
    fastify.get("/terms", () => "ToS?? Forget about it")
    fastify.addHook("onError", (_, reply, error) => {
        if ((Error.isError(error) && error.message.startsWith("Rate limit exceeded")) || isFastifyError(error)) {
            throw error
        } else {
            console.trace(error)
            return reply.code(500).send({ error: "Internal Server Error" })
        }
    })

    await fastify.listen({ host: "0.0.0.0", port: 7200 })
    console.log(`Server listening at http://localhost:7200`)

    return fastify
}

main()
