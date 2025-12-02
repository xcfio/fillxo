import { Contract } from "./contract"

export type MessageStatus = "sent" | "delivered" | "read" | "deleted"

export interface Message {
    id: string
    content: string
    sender: string | null
    contracts: string
    status: MessageStatus
    createdAt: string
    editedAt: string | null
}

export interface ConversationUser {
    id: string
    name: string
    username: string
    avatar: string | null
}

export interface Conversation {
    contract: Contract
    lastMessage: Message | null
    unreadCount: number
    otherUser: ConversationUser
}

export interface ConversationsResponse {
    conversations: Conversation[]
    total: number
    page: number
    limit: number
}
