import { Type, Static } from "@sinclair/typebox"
import { v7 } from "uuid"

declare module "fastify" {
    interface FastifyInstance {
        authenticate: (request: FastifyRequest, reply: FastifyReply) => void
    }
}

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: "development" | "production"
            DATABASE_URI: string

            COOKIE_SECRET: string
            JWT_SECRET: string

            CLIENT_ID: string
            CLIENT_SECRET: string
        }
    }
}

export function ErrorResponse(code: number, description?: string) {
    return Type.Object(
        {
            statusCode: Type.Number({
                examples: [code],
                description: "HTTP status code of the error"
            }),
            error: Type.String({
                description: "Error type or category"
            }),
            message: Type.String({
                description: "Human-readable error message"
            })
        },
        {
            $id: "ErrorResponse",
            description: description ?? "Standard error response format for API endpoints"
        }
    )
}
