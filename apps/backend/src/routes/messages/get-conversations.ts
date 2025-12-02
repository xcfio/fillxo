import { CreateError, isFastifyError, toTypeBox } from "../../function"
import { ErrorResponse, Contract, Message } from "../../type"
import { db, table } from "../../database"
import { main } from "../../"
import { and, desc, eq, or, sql, not } from "drizzle-orm"
import { Type, Static } from "typebox"
import { UUID, Nullable } from "../../typebox"

type ConversationItem = Static<typeof ConversationItem>
const ConversationItem = Type.Object({
    contract: Contract,
    lastMessage: Type.Union([Message, Type.Null()]),
    unreadCount: Type.Integer({ minimum: 0 }),
    otherUser: Type.Object({
        id: UUID,
        name: Type.String(),
        username: Type.String(),
        avatar: Nullable(Type.String())
    })
})

export default function GetConversations(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.route({
        method: "GET",
        url: "/messages/conversations",
        schema: {
            description: "Get all conversations (contracts with messaging) for the current user",
            tags: ["Message"],
            querystring: Type.Partial(
                Type.Object({
                    page: Type.Integer({ minimum: 1, default: 1, description: "Page number" }),
                    limit: Type.Integer({ minimum: 1, maximum: 50, default: 20, description: "Conversations per page" })
                })
            ),
            response: {
                200: Type.Object({
                    conversations: Type.Array(ConversationItem),
                    total: Type.Integer(),
                    page: Type.Integer(),
                    limit: Type.Integer()
                }),
                401: ErrorResponse(401, "Unauthorized - Authentication required"),
                429: ErrorResponse(429, "Too many requests - rate limit exceeded"),
                500: ErrorResponse(500, "Internal server error")
            }
        },
        preHandler: fastify.auth,
        handler: async (request, reply) => {
            try {
                const { id } = request.user
                const { page = 1, limit = 20 } = request.query

                const userContracts = await db
                    .select()
                    .from(table.contracts)
                    .where(
                        and(
                            or(eq(table.contracts.clientId, id), eq(table.contracts.freelancerId, id)),
                            eq(table.contracts.status, "active")
                        )
                    )
                    .limit(limit)
                    .offset((page - 1) * limit)

                const [{ count }] = await db
                    .select({ count: sql<number>`count(*)::int` })
                    .from(table.contracts)
                    .where(
                        and(
                            or(eq(table.contracts.clientId, id), eq(table.contracts.freelancerId, id)),
                            eq(table.contracts.status, "active")
                        )
                    )

                const conversations: ConversationItem[] = []

                for (const contract of userContracts) {
                    // Get the other user in the conversation
                    const otherUserId = contract.clientId === id ? contract.freelancerId : contract.clientId

                    const [otherUser] = await db
                        .select({
                            id: table.users.id,
                            name: table.users.name,
                            username: table.users.username,
                            avatar: table.users.avatar
                        })
                        .from(table.users)
                        .where(eq(table.users.id, otherUserId))

                    // Get last message for this contract
                    const [lastMessage] = await db
                        .select()
                        .from(table.messages)
                        .where(
                            and(eq(table.messages.contracts, contract.id), not(eq(table.messages.status, "deleted")))
                        )
                        .orderBy(desc(table.messages.createdAt))
                        .limit(1)

                    // Get unread count (messages sent by other user that are not read)
                    const [{ unreadCount }] = await db
                        .select({ unreadCount: sql<number>`count(*)::int` })
                        .from(table.messages)
                        .where(
                            and(
                                eq(table.messages.contracts, contract.id),
                                eq(table.messages.sender, otherUserId),
                                not(eq(table.messages.status, "read")),
                                not(eq(table.messages.status, "deleted"))
                            )
                        )

                    conversations.push({
                        contract: toTypeBox(contract),
                        lastMessage: lastMessage ? toTypeBox(lastMessage) : null,
                        unreadCount,
                        otherUser: {
                            id: otherUser.id,
                            name: otherUser.name,
                            username: otherUser.username,
                            avatar: otherUser.avatar
                        }
                    })
                }

                // Sort by last message date (most recent first)
                conversations.sort((a, b) => {
                    const aDate = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt).getTime() : 0
                    const bDate = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt).getTime() : 0
                    return bDate - aDate
                })

                return reply.status(200).send({
                    conversations,
                    total: count,
                    page,
                    limit
                })
            } catch (error) {
                if (isFastifyError(error)) {
                    throw error
                } else {
                    console.trace(error)
                    throw CreateError(500, "INTERNAL_SERVER_ERROR", "Internal Server Error")
                }
            }
        }
    })
}
