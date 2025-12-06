import { toTypeBox, xcf } from "../../function"
import { ErrorResponse, PublicUser } from "../../type"
import { db, table } from "../../database"
import { main } from "../../"
import { and, desc, eq, ilike, or, sql } from "drizzle-orm"
import { Type } from "typebox"

export default function SearchUser(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.route({
        method: "GET",
        url: "/search/user",
        schema: {
            description: "Search users by name, username, skills, or title",
            tags: ["Search"],
            querystring: Type.Object({
                q: Type.String({ minLength: 1, description: "Search query" }),
                role: Type.Optional(Type.Union([Type.Literal("freelancer"), Type.Literal("client")])),
                country: Type.Optional(
                    Type.String({ minLength: 2, maxLength: 2, description: "Country code (ISO 3166-1 alpha-2)" })
                ),
                page: Type.Optional(Type.Integer({ minimum: 1, default: 1, description: "Page number" })),
                limit: Type.Optional(
                    Type.Integer({ minimum: 1, maximum: 100, default: 20, description: "Results per page" })
                )
            }),
            response: {
                200: Type.Array(PublicUser),
                429: ErrorResponse(429, "Too many requests - rate limit exceeded"),
                500: ErrorResponse(500, "Internal server error")
            }
        },
        handler: async (request, reply) => {
            try {
                const { q, role, country, page = 1, limit = 20 } = request.query
                const searchPattern = `%${q}%`

                const users = await db
                    .select()
                    .from(table.users)
                    .where(
                        and(
                            eq(table.users.isBanned, false),
                            role ? eq(table.users.role, role) : undefined,
                            country ? eq(table.users.country, country) : undefined,
                            or(
                                ilike(table.users.name, searchPattern),
                                ilike(table.users.username, searchPattern),
                                sql`${table.users.freelancer}->>'title' ILIKE ${searchPattern}`,
                                sql`${table.users.freelancer}->>'bio' ILIKE ${searchPattern}`,
                                sql`EXISTS (SELECT 1 FROM jsonb_array_elements_text(${table.users.freelancer}->'skills') AS skill WHERE skill ILIKE ${searchPattern})`
                            )
                        )
                    )
                    .orderBy(desc(table.users.createdAt))
                    .limit(limit)
                    .offset((page - 1) * limit)

                return reply.status(200).send(users.map((x) => toTypeBox(x)))
            } catch (error) {
                await xcf(error as any)
            }
        }
    })
}
