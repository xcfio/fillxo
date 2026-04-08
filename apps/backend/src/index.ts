import Fastify from "fastify"

export async function main() {
    const isDevelopment = process.env.NODE_ENV === "development"
    const fastify = Fastify({
        trustProxy: true,
        logger: {
            formatters: { level: (level, number) => ({ level: `${level} (${number})` }) },
            file: isDevelopment ? "./log.json" : undefined
        }
    })

    fastify.get("/status", (_, reply) => reply.code(200).send("OK"))

    await fastify.listen({ host: "0.0.0.0", port: 7200 })
    console.log(`Server listening at http://localhost:7200`)

    return fastify
}

main()
