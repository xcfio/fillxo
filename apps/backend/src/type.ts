import { Static, Type } from "typebox"
import { v7 } from "uuid"

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
            statusCode: Type.Number({ examples: [code], description: "HTTP status code of the error" }),
            error: Type.String({ description: "Error type or category" }),
            message: Type.String({ description: "Human-readable error message" })
        },
        {
            $id: "ErrorResponse",
            description: description ?? "Standard error response format for API endpoints"
        }
    )
}

// ============================================
// USER SCHEMA
// ============================================
const RatingSchema = Type.Object({
    id: Type.String({
        examples: [v7()],
        pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$",
        description: "Review identifier"
    }),
    review: Type.Union([Type.Literal(1), Type.Literal(2), Type.Literal(3), Type.Literal(4), Type.Literal(5)], {
        description: "Rating value from 1 to 5"
    }),
    comment: Type.Optional(
        Type.String({
            description: "Optional review comment"
        })
    )
})

const ClientSchema = Type.Object({
    companyName: Type.Optional(
        Type.String({
            description: "Company name"
        })
    ),
    industry: Type.Optional(
        Type.String({
            description: "Industry type"
        })
    )
})

const FreelancerSchema = Type.Object({
    title: Type.Optional(
        Type.String({
            description: "Professional title"
        })
    ),
    bio: Type.Optional(
        Type.String({
            description: "Biography"
        })
    ),
    skills: Type.Optional(
        Type.Array(Type.String(), {
            description: "List of skills"
        })
    ),
    portfolio: Type.Optional(
        Type.Array(
            Type.Object({
                title: Type.String({
                    description: "Project title"
                }),
                description: Type.String({
                    description: "Project description"
                }),
                images: Type.Optional(
                    Type.String({
                        description: "Project images URL"
                    })
                ),
                link: Type.Optional(
                    Type.String({
                        format: "uri",
                        description: "Project link"
                    })
                )
            }),
            {
                description: "Portfolio projects"
            }
        )
    )
})

export type User = Static<typeof User>
export const User = Type.Object({
    id: Type.String({
        examples: [v7()],
        pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$",
        description: "Unique identifier for the user"
    }),
    email: Type.String({
        format: "email",
        examples: ["user@example.com"],
        description: "User email address"
    }),
    username: Type.String({
        minLength: 3,
        maxLength: 50,
        pattern: "^[a-zA-Z0-9_-]+$",
        examples: ["john_doe"],
        description: "Unique username"
    }),
    name: Type.String({
        minLength: 2,
        maxLength: 100,
        examples: ["John Doe"],
        description: "Full name of the user"
    }),
    gender: Type.Union([Type.Literal("male"), Type.Literal("female"), Type.Literal("other")], {
        description: "Gender of the user"
    }),
    avatar: Type.Union([
        Type.String({
            format: "uri",
            examples: ["https://example.com/avatar.jpg"],
            description: "Avatar image URL"
        }),
        Type.Null()
    ]),
    phone: Type.String({
        pattern: "^\\+[1-9]\\d{1,14}$",
        examples: ["+8801712345678"],
        description: "Phone number in E.164 format"
    }),
    phoneVerified: Type.Boolean({
        default: false,
        description: "Whether phone number is verified"
    }),
    role: Type.Union([Type.Literal("freelancer"), Type.Literal("client")], {
        description: "User role"
    }),
    privilege: Type.Union([Type.Literal("moderator"), Type.Literal("admin"), Type.Null()], {
        description: "User privilege level"
    }),
    isBanned: Type.Boolean({
        default: false,
        description: "Whether user is banned"
    }),
    country: Type.Union([
        Type.String({
            minLength: 2,
            maxLength: 2,
            pattern: "^[A-Z]{2}$",
            examples: ["BD", "US"],
            description: "Country code (ISO 3166-1 alpha-2)"
        }),
        Type.Null()
    ]),
    rating: Type.Union([RatingSchema, Type.Null()], {
        description: "User rating information"
    }),
    client: Type.Union([ClientSchema, Type.Null()], {
        description: "Client-specific profile data"
    }),
    freelancer: Type.Union([FreelancerSchema, Type.Null()], {
        description: "Freelancer-specific profile data"
    }),
    createdAt: Type.String({
        format: "date-time",
        examples: [new Date().toISOString()],
        description: "Account creation timestamp"
    }),
    updatedAt: Type.String({
        format: "date-time",
        examples: [new Date().toISOString()],
        description: "Last update timestamp"
    })
})

export type PublicUser = Static<typeof PublicUser>
export const PublicUser = Type.Object({
    username: Type.String({
        examples: ["john_doe"],
        description: "Username"
    }),
    name: Type.String({
        examples: ["John Doe"],
        description: "Full name"
    }),
    avatar: Type.Union([
        Type.String({
            format: "uri",
            examples: ["https://example.com/avatar.jpg"],
            description: "Avatar image URL"
        }),
        Type.Null()
    ]),
    role: Type.Union([Type.Literal("freelancer"), Type.Literal("client")], {
        description: "User role"
    }),
    country: Type.Union([
        Type.String({
            minLength: 2,
            maxLength: 2,
            pattern: "^[A-Z]{2}$",
            examples: ["BD", "US"],
            description: "Country code"
        }),
        Type.Null()
    ]),
    rating: Type.Union([RatingSchema, Type.Null()], {
        description: "User rating"
    }),
    freelancer: Type.Union([FreelancerSchema, Type.Null()], {
        description: "Freelancer profile"
    }),
    client: Type.Union([ClientSchema, Type.Null()], {
        description: "Client profile"
    }),
    createdAt: Type.String({
        format: "date-time",
        examples: [new Date().toISOString()],
        description: "Account creation date"
    })
})
