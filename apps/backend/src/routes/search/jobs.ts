import { toTypeBox, xcf } from "../../function"
import { ErrorResponse, Job } from "../../type"
import { db, table } from "../../database"
import { main } from "../../"
import { Type } from "typebox"
import { and, desc, eq, gte, ilike, lte, or, sql } from "drizzle-orm"

export default function SearchJobs(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.route({
        method: "GET",
        url: "/search/jobs",
        schema: {
            description: "Search jobs by title, description, category, or skills",
            tags: ["Search"],
            querystring: Type.Object({
                q: Type.String({ minLength: 1, description: "Search query" }),
                category: Type.Optional(Type.String({ description: "Filter by category" })),
                minBudget: Type.Optional(Type.Integer({ minimum: 0, description: "Minimum budget" })),
                maxBudget: Type.Optional(Type.Integer({ minimum: 0, description: "Maximum budget" })),
                page: Type.Optional(Type.Integer({ minimum: 1, default: 1, description: "Page number" })),
                limit: Type.Optional(
                    Type.Integer({ minimum: 1, maximum: 100, default: 20, description: "Results per page" })
                )
            }),
            response: {
                200: Type.Array(Job),
                429: ErrorResponse(429, "Too many requests - rate limit exceeded"),
                500: ErrorResponse(500, "Internal server error")
            }
        },
        handler: async (request, reply) => {
            try {
                const { q, category, minBudget, maxBudget, page = 1, limit = 20 } = request.query
                const searchPattern = `%${q}%`

                const jobs = await db
                    .select()
                    .from(table.jobs)
                    .where(
                        and(
                            eq(table.jobs.isOpen, true),
                            category ? ilike(table.jobs.category, category) : undefined,
                            minBudget !== undefined ? gte(table.jobs.budget, minBudget) : undefined,
                            maxBudget !== undefined ? lte(table.jobs.budget, maxBudget) : undefined,
                            or(
                                ilike(table.jobs.title, searchPattern),
                                ilike(table.jobs.description, searchPattern),
                                ilike(table.jobs.category, searchPattern),
                                sql`EXISTS (SELECT 1 FROM unnest(${table.jobs.skills}) AS skill WHERE skill ILIKE ${searchPattern})`
                            )
                        )
                    )
                    .orderBy(desc(table.jobs.createdAt))
                    .limit(limit)
                    .offset((page - 1) * limit)

                return reply.status(200).send(jobs.map((x) => toTypeBox(x)))
            } catch (error) {
                await xcf(error as any)
            }
        }
    })
}
