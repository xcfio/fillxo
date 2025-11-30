import { Static, Type } from "typebox"
import { v7 } from "uuid"
export { Job } from "./database/jobs"
export { Proposal } from "./database/proposals"
export { User, PublicUser } from "./database/users"
export { Notifications } from "./database/notifications"

declare module "fastify" {
    interface FastifyInstance {
        auth: (request: FastifyRequest, reply: FastifyReply) => void
    }
    interface FastifyRequest {
        user: Payload
    }
}

export type Payload = Static<typeof Payload>
export const Payload = Type.Object({
    id: Type.String({ pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$", examples: v7() }),
    iat: Type.Number(),
    exp: Type.Number()
})

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: "development" | "production"
            DATABASE_URI: string

            HMAC_SECRET: string
            COOKIE_SECRET: string
            JWT_SECRET: string

            GITHUB_ID: string
            GITHUB_SECRET: string
            RESEND_API_KEY: string
        }
    }
}

export function ErrorResponse(code: number, description?: string) {
    return Type.Object(
        {
            statusCode: Type.Integer({ examples: [code], description: "HTTP status code of the error" }),
            error: Type.String({ description: "Error type or category" }),
            message: Type.String({ description: "Human-readable error message" })
        },
        {
            $id: "ErrorResponse",
            description: description ?? "Standard error response format for API endpoints"
        }
    )
}
