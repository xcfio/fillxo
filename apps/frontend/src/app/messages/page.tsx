"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { PageContainer } from "@/components/ui/page-container"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, User as UserIcon, Circle } from "lucide-react"
import { getUser } from "@/utils/auth"
import { formatTimeAgo } from "@/utils/time"
import { Conversation, ConversationsResponse } from "@/types/message"
import { User } from "@/types/user"

export default function MessagesPage() {
    const router = useRouter()
    const [conversations, setConversations] = useState<Conversation[]>([])
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<User | null>(null)
    const [totalUnread, setTotalUnread] = useState(0)

    useEffect(() => {
        const fetchUser = async () => {
            const userData = await getUser()
            if (!userData) return router.push("/login")
            setUser(userData)
        }
        fetchUser()
    }, [router])

    useEffect(() => {
        const fetchConversations = async () => {
            if (!user) return
            setLoading(true)
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/messages/conversations`, {
                    credentials: "include"
                })

                if (response.ok) {
                    const data: ConversationsResponse = await response.json()
                    setConversations(data.conversations)
                    setTotalUnread(data.conversations.reduce((sum, conv) => sum + conv.unreadCount, 0))
                } else {
                    console.error("Failed to fetch conversations")
                }
            } catch (error) {
                console.error("Error fetching conversations:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchConversations()
    }, [user])

    const handleConversationClick = (contractId: string) => {
        router.push(`/messages/${contractId}`)
    }

    if (loading || !user) {
        return <LoadingSpinner message="Loading messages..." />
    }

    return (
        <PageContainer>
            <div className="max-w-4xl mx-auto min-h-[60vh]">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center">
                            <MessageCircle className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Messages</h1>
                            <p className="text-gray-400 text-sm">
                                {conversations.length} conversation{conversations.length !== 1 ? "s" : ""}
                                {totalUnread > 0 && <span className="ml-2 text-blue-400">• {totalUnread} unread</span>}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Conversations List */}
                {conversations.length === 0 ? (
                    <Card className="text-center py-16">
                        <MessageCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-300 mb-2">No conversations yet</h2>
                        <p className="text-gray-500">
                            Your conversations with clients and freelancers will appear here once you have active
                            contracts.
                        </p>
                    </Card>
                ) : (
                    <div className="space-y-3">
                        {conversations.map((conversation) => (
                            <Card
                                key={conversation.contract.id}
                                hover
                                className={`cursor-pointer p-5 ${
                                    conversation.unreadCount > 0 ? "border-blue-600/50 bg-blue-950/20" : ""
                                }`}
                                onClick={() => handleConversationClick(conversation.contract.id)}
                            >
                                <div className="flex items-center gap-4">
                                    {/* Avatar */}
                                    <div className="relative">
                                        {conversation.otherUser.avatar ? (
                                            <img
                                                src={conversation.otherUser.avatar}
                                                alt={conversation.otherUser.name}
                                                className="w-14 h-14 rounded-full object-cover border-2 border-blue-900/30"
                                            />
                                        ) : (
                                            <div className="w-14 h-14 rounded-full bg-blue-600/20 flex items-center justify-center border-2 border-blue-900/30">
                                                <UserIcon className="w-7 h-7 text-blue-400" />
                                            </div>
                                        )}
                                        {conversation.unreadCount > 0 && (
                                            <Circle className="w-3 h-3 text-blue-500 fill-blue-500 absolute -top-0.5 -right-0.5" />
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3
                                                className={`font-semibold truncate ${
                                                    conversation.unreadCount > 0 ? "text-white" : "text-gray-200"
                                                }`}
                                            >
                                                {conversation.otherUser.name}
                                            </h3>
                                            {conversation.lastMessage && (
                                                <span className="text-xs text-gray-500 ml-2 shrink-0">
                                                    {formatTimeAgo(conversation.lastMessage.createdAt)}
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-sm text-gray-500 mb-1">@{conversation.otherUser.username}</p>

                                        {conversation.lastMessage ? (
                                            <p
                                                className={`text-sm truncate ${
                                                    conversation.unreadCount > 0 ? "text-gray-300" : "text-gray-500"
                                                }`}
                                            >
                                                {conversation.lastMessage.sender === user.id && (
                                                    <span className="text-gray-600">You: </span>
                                                )}
                                                {conversation.lastMessage.content}
                                            </p>
                                        ) : (
                                            <p className="text-sm text-gray-600 italic">No messages yet</p>
                                        )}
                                    </div>

                                    {/* Unread Badge */}
                                    {conversation.unreadCount > 0 && (
                                        <Badge variant="primary" className="shrink-0">
                                            {conversation.unreadCount}
                                        </Badge>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </PageContainer>
    )
}
