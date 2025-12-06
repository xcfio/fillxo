import { ClientToServerEvents, ServerToClientEvents } from "./socket"
export { Notifications } from "./database/notifications"
export { User, PublicUser } from "./database/users"
export { Proposal } from "./database/proposals"
export { Contract } from "./database/contracts"
export { Payments } from "./database/payments"
export { Message } from "./database/messages"
export { Review } from "./database/reviews"
export { Job } from "./database/jobs"
import { table } from "./database"
import { Socket } from "socket.io"
import { Static, Type } from "typebox"
import { v7 } from "uuid"

export interface AuthenticatedSocket extends Socket<ClientToServerEvents, ServerToClientEvents> {
    user?: typeof table.users.$inferSelect
}

declare module "fastify" {
    interface FastifyInstance {
        auth: (request: FastifyRequest, reply: FastifyReply) => void
        io: AuthenticatedSocket
    }
    interface FastifyRequest {
        user: Payload
    }
}

export type Payload = Static<typeof Payload>
export const Payload = Type.Object({
    id: Type.String({ pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$", examples: v7() }),
    banned: Type.Optional(Type.Boolean({ description: "Indicates if the user is banned" })),
    iat: Type.Number(),
    exp: Type.Number()
})

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: "development" | "production"
            DATABASE_URI: string

            TOKEN: string
            CHANNEL: string
            ERROR_LOG_CHANNEL: string

            PAYMENT_SECRET: string
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
