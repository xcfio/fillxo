"use client"

import { useRouter, useParams } from "next/navigation"
import { useEffect, useState, useRef, useCallback } from "react"
import { PageContainer } from "@/components/ui/page-container"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    ArrowLeft,
    Send,
    User as UserIcon,
    Check,
    CheckCheck,
    MoreVertical,
    Edit2,
    Trash2,
    X,
    Circle
} from "lucide-react"
import { getUser } from "@/utils/auth"
import { formatTimeAgo } from "@/utils/time"
import { Message, ConversationUser } from "@/types/message"
import { Contract } from "@/types/contract"
import { User } from "@/types/user"
import { io, Socket } from "socket.io-client"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkBreaks from "remark-breaks"

// Markdown components for message rendering
// Note: react-markdown v9+ passes a `node` prop that must be destructured out
// to avoid passing it to DOM elements
const markdownComponents = {
    a: ({ node, href, children, ...props }: any) => (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-300 hover:text-blue-200 underline break-all"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            {...props}
        >
            {children}
        </a>
    ),
    p: ({ node, children, ...props }: any) => (
        <p className="mb-3 last:mb-0" {...props}>
            {children}
        </p>
    ),
    code: ({ node, inline, className, children, ...props }: any) => {
        // In react-markdown v9+, inline code doesn't have className
        const isInline = inline || !className
        return isInline ? (
            <code className="bg-gray-900/50 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                {children}
            </code>
        ) : (
            <code
                className={`block bg-gray-900/50 p-2 rounded text-sm font-mono overflow-x-auto my-1 ${className || ""}`}
                {...props}
            >
                {children}
            </code>
        )
    },
    pre: ({ node, children, ...props }: any) => (
        <pre className="bg-gray-900/50 p-2 rounded overflow-x-auto my-1" {...props}>
            {children}
        </pre>
    ),
    strong: ({ node, children, ...props }: any) => (
        <strong className="font-bold" {...props}>
            {children}
        </strong>
    ),
    em: ({ node, children, ...props }: any) => (
        <em className="italic" {...props}>
            {children}
        </em>
    ),
    ul: ({ node, children, ...props }: any) => (
        <ul className="list-disc list-inside my-1" {...props}>
            {children}
        </ul>
    ),
    ol: ({ node, children, ...props }: any) => (
        <ol className="list-decimal list-inside my-1" {...props}>
            {children}
        </ol>
    ),
    li: ({ node, children, ...props }: any) => (
        <li className="ml-2" {...props}>
            {children}
        </li>
    ),
    blockquote: ({ node, children, ...props }: any) => (
        <blockquote
            className="border-l-2 border-blue-400/60 pl-3 my-1.5 text-gray-200 [&>p]:mb-0.5 [&>p:last-child]:mb-0"
            {...props}
        >
            {children}
        </blockquote>
    ),
    hr: ({ node, ...props }: any) => <hr className="border-gray-600 my-2" {...props} />,
    del: ({ node, children, ...props }: any) => (
        <del className="line-through" {...props}>
            {children}
        </del>
    )
}

interface ChatState {
    messages: Message[]
    loading: boolean
    sending: boolean
    otherUser: ConversationUser | null
    contract: Contract | null
    isTyping: boolean
    isOnline: boolean
}

export interface ClientToServerEvents {
    mark_as_read: (data: { contractId: string; messageIds: string[] }) => void
    typing: (contractId: string, status: "started" | "stopped") => void
}

export interface ServerToClientEvents {
    user_status_changed: (userId: string, status: "online" | "offline") => void
    message_created: (message: Message) => void
    message_edited: (message: Message) => void
    message_deleted: (message: string) => void
    messages_read: (data: { contractId: string; messageIds: string[]; readBy: string }) => void
    typing: (userId: string, status: "started" | "stopped") => void
    error: (data: { message: string; code: string }) => void
}

export default function ChatPage() {
    const router = useRouter()
    const params = useParams()
    const contractId = params.id as string

    const [user, setUser] = useState<User | null>(null)
    const [state, setState] = useState<ChatState>({
        messages: [],
        loading: true,
        sending: false,
        otherUser: null,
        contract: null,
        isTyping: false,
        isOnline: false
    })
    const [newMessage, setNewMessage] = useState("")
    const [editingMessage, setEditingMessage] = useState<string | null>(null)
    const [editContent, setEditContent] = useState("")
    const [menuOpen, setMenuOpen] = useState<string | null>(null)

    const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const inputRef = useRef<HTMLTextAreaElement>(null)
    const otherUserIdRef = useRef<string | null>(null)
    const pendingReadIds = useRef<string[]>([])
    const [socketReady, setSocketReady] = useState(false)

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [])

    // Fetch user
    useEffect(() => {
        const fetchUser = async () => {
            const userData = await getUser()
            if (!userData) return router.push("/login")
            setUser(userData)
        }
        fetchUser()
    }, [router])

    // Initialize socket connection - wait until we have otherUserId
    useEffect(() => {
        if (!user || !socketReady) return

        const socket = io(process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:7200", {
            withCredentials: true,
            transports: ["websocket", "polling"]
        })

        socketRef.current = socket

        socket.on("connect", () => {
            if (pendingReadIds.current.length > 0) {
                const interval = setInterval(() => {
                    if (pendingReadIds.current.length === 0) return clearInterval(interval)
                    socket.emit("mark_as_read", { contractId, messageIds: pendingReadIds.current })
                    pendingReadIds.current = []
                    window.dispatchEvent(new CustomEvent("messages-read"))
                }, 2000)

                setTimeout(() => clearInterval(interval), 10000)
            }
        })

        socket.on("message_created", (message: Message) => {
            if (message.contracts === contractId) {
                setState((prev) => ({
                    ...prev,
                    messages: [...prev.messages, message]
                }))
                scrollToBottom()

                if (message.sender !== user.id) {
                    socket.emit("mark_as_read", { contractId, messageIds: [message.id] })
                    window.dispatchEvent(new CustomEvent("messages-read"))
                }
            }
        })

        socket.on("message_edited", (message: Message) => {
            if (message.contracts === contractId) {
                setState((prev) => ({
                    ...prev,
                    messages: prev.messages.map((m) => (m.id === message.id ? message : m))
                }))
            }
        })

        socket.on("message_deleted", (messageId: string) => {
            setState((prev) => ({
                ...prev,
                messages: prev.messages.filter((m) => m.id !== messageId)
            }))
        })

        socket.on("messages_read", (data: { contractId: string; messageIds: string[]; readBy: string }) => {
            if (data.contractId === contractId) {
                setState((prev) => ({
                    ...prev,
                    messages: prev.messages.map((m) =>
                        data.messageIds.includes(m.id) ? { ...m, status: "read" as const } : m
                    )
                }))
            }
        })

        socket.on("typing", (userId: string, status: "started" | "stopped") => {
            // Only show typing if it's from the other user
            if (otherUserIdRef.current && userId === otherUserIdRef.current) {
                setState((prev) => ({ ...prev, isTyping: status === "started" }))
            }
        })

        socket.on("user_status_changed", (userId: string, status: "online" | "offline") => {
            // Only update status if it's from the other user
            if (otherUserIdRef.current && userId === otherUserIdRef.current) {
                setState((prev) => ({ ...prev, isOnline: status === "online" }))
            }
        })

        socket.on("error", (data: { message: string; code: string }) => {
            console.error("Socket error:", data)
        })

        return () => {
            socket.disconnect()
        }
    }, [user, contractId, scrollToBottom, socketReady])

    // Fetch messages and contract info
    useEffect(() => {
        const fetchData = async () => {
            if (!user) return

            try {
                // Fetch messages
                const messagesRes = await fetch(
                    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/messages/${contractId}?limit=100`,
                    { credentials: "include" }
                )

                if (!messagesRes.ok) {
                    if (messagesRes.status === 401) router.push("/login")
                    return
                }

                const messages: Message[] = await messagesRes.json()

                // Fetch contract info for other user
                const contractRes = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/contracts/${contractId}`, {
                    credentials: "include"
                })

                if (contractRes.ok) {
                    const contractData = await contractRes.json()
                    const otherUserId =
                        contractData.clientId === user.id ? contractData.freelancerId : contractData.clientId

                    // Store otherUserId in ref for socket handlers
                    otherUserIdRef.current = otherUserId

                    // Calculate unread messages BEFORE triggering socket connection
                    const unreadIds = messages
                        .filter((m) => m.sender !== user.id && m.status !== "read")
                        .map((m) => m.id)

                    console.log("Unread IDs found:", unreadIds)

                    // Store pending read IDs before socket connects
                    if (unreadIds.length > 0) {
                        pendingReadIds.current = unreadIds
                        console.log("Set pendingReadIds.current to:", pendingReadIds.current)
                    }

                    // Trigger socket connection now that we have pending IDs set
                    setSocketReady(true)

                    // Fetch other user info
                    const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/users/${otherUserId}`, {
                        credentials: "include"
                    })

                    let otherUser: ConversationUser | null = null
                    if (userRes.ok) {
                        const userData = await userRes.json()
                        otherUser = {
                            id: userData.id,
                            name: userData.name,
                            username: userData.username,
                            avatar: userData.avatar
                        }
                    }

                    setState((prev) => ({
                        ...prev,
                        messages,
                        contract: contractData,
                        otherUser,
                        loading: false
                    }))

                    // If socket is already connected, mark as read immediately
                    if (unreadIds.length > 0 && socketRef.current?.connected) {
                        socketRef.current.emit("mark_as_read", { contractId, messageIds: unreadIds })
                        pendingReadIds.current = []
                        window.dispatchEvent(new CustomEvent("messages-read"))
                    }
                }
            } catch (error) {
                console.error("Error fetching data:", error)
                setState((prev) => ({ ...prev, loading: false }))
            }
        }

        fetchData()
    }, [user, contractId, router])

    // Scroll to bottom on new messages
    useEffect(() => {
        scrollToBottom()
    }, [state.messages, scrollToBottom])

    const handleTyping = () => {
        if (!socketRef.current) return

        socketRef.current.emit("typing", contractId, "started")

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
        }

        typingTimeoutRef.current = setTimeout(() => {
            socketRef.current?.emit("typing", contractId, "stopped")
        }, 2000)
    }

    const handleSendMessage = async () => {
        if (!newMessage.trim() || state.sending) return

        setState((prev) => ({ ...prev, sending: true }))

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/messages/${contractId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ content: newMessage.trim() })
            })

            if (response.ok) {
                const message: Message = await response.json()
                setState((prev) => ({
                    ...prev,
                    messages: [...prev.messages, message],
                    sending: false
                }))
                setNewMessage("")
                inputRef.current?.focus()
            } else {
                console.error("Failed to send message")
                setState((prev) => ({ ...prev, sending: false }))
            }
        } catch (error) {
            console.error("Error sending message:", error)
            setState((prev) => ({ ...prev, sending: false }))
        }
    }

    const handleEditMessage = async (messageId: string) => {
        if (!editContent.trim()) return

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/messages/${messageId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ content: editContent.trim() })
            })

            if (response.ok) {
                const updatedMessage: Message = await response.json()
                setState((prev) => ({
                    ...prev,
                    messages: prev.messages.map((m) => (m.id === messageId ? updatedMessage : m))
                }))
                setEditingMessage(null)
                setEditContent("")
            }
        } catch (error) {
            console.error("Error editing message:", error)
        }
    }

    const handleDeleteMessage = async (messageId: string) => {
        if (!confirm("Are you sure you want to delete this message?")) return

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/messages/${messageId}`, {
                method: "DELETE",
                credentials: "include"
            })

            if (response.ok) {
                setState((prev) => ({
                    ...prev,
                    messages: prev.messages.filter((m) => m.id !== messageId)
                }))
            }
        } catch (error) {
            console.error("Error deleting message:", error)
        }

        setMenuOpen(null)
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    const getStatusIcon = (message: Message) => {
        if (message.sender !== user?.id) return null

        switch (message.status) {
            case "read":
                return <CheckCheck className="w-4 h-4 text-blue-400" />
            case "delivered":
                return <CheckCheck className="w-4 h-4 text-gray-500" />
            default:
                return <Check className="w-4 h-4 text-gray-500" />
        }
    }

    if (state.loading || !user) {
        return <LoadingSpinner message="Loading conversation..." />
    }

    return (
        <PageContainer showFooter={false}>
            <div className="max-w-4xl mx-auto h-[calc(100vh-160px)] flex flex-col">
                {/* Header */}
                <Card className="p-4 mb-4 flex items-center gap-4">
                    <button
                        onClick={() => router.push("/messages")}
                        className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>

                    <div className="relative">
                        {state.otherUser?.avatar ? (
                            <img
                                src={state.otherUser.avatar}
                                alt={state.otherUser.name}
                                className="w-12 h-12 rounded-full object-cover border-2 border-blue-900/30"
                            />
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center border-2 border-blue-900/30">
                                <UserIcon className="w-6 h-6 text-blue-400" />
                            </div>
                        )}
                        {state.isOnline && (
                            <Circle className="w-3 h-3 text-green-500 fill-green-500 absolute bottom-0 right-0" />
                        )}
                    </div>

                    <div className="flex-1">
                        <h2 className="font-semibold">{state.otherUser?.name || "Unknown User"}</h2>
                        <p className="text-sm text-gray-500">
                            {state.isTyping ? (
                                <span className="text-blue-400">typing...</span>
                            ) : state.isOnline ? (
                                <span className="text-green-400">Online</span>
                            ) : (
                                `@${state.otherUser?.username || ""}`
                            )}
                        </p>
                    </div>
                </Card>

                {/* Messages Area */}
                <Card className="flex-1 p-4 overflow-y-auto mb-4 space-y-4">
                    {state.messages.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            <p>No messages yet. Start the conversation!</p>
                        </div>
                    ) : (
                        state.messages.map((message) => {
                            const isOwn = message.sender === user.id
                            const isEditing = editingMessage === message.id

                            return (
                                <div key={message.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                                    <div
                                        className={`relative max-w-[70%] group ${
                                            isOwn ? "bg-blue-600" : "bg-gray-800"
                                        } rounded-2xl px-4 py-3 ${isOwn ? "rounded-br-md" : "rounded-bl-md"}`}
                                    >
                                        {isEditing ? (
                                            <div className="space-y-2">
                                                <textarea
                                                    value={editContent}
                                                    onChange={(e) => setEditContent(e.target.value)}
                                                    className="w-full bg-gray-900/50 border border-blue-900/30 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-blue-600"
                                                    rows={2}
                                                    autoFocus
                                                />
                                                <div className="flex gap-2 justify-end">
                                                    <button
                                                        onClick={() => {
                                                            setEditingMessage(null)
                                                            setEditContent("")
                                                        }}
                                                        className="p-1.5 hover:bg-gray-700 rounded"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEditMessage(message.id)}
                                                        className="p-1.5 hover:bg-gray-700 rounded text-blue-400"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="text-sm break-words [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                                                    <ReactMarkdown
                                                        remarkPlugins={[remarkGfm, remarkBreaks]}
                                                        components={markdownComponents}
                                                    >
                                                        {message.content}
                                                    </ReactMarkdown>
                                                </div>
                                                <div
                                                    className={`flex items-center gap-1.5 mt-1 ${
                                                        isOwn ? "justify-end" : ""
                                                    }`}
                                                >
                                                    <span className="text-xs text-gray-400">
                                                        {formatTimeAgo(message.createdAt)}
                                                    </span>
                                                    {message.editedAt && (
                                                        <span className="text-xs text-gray-500">(edited)</span>
                                                    )}
                                                    {getStatusIcon(message)}
                                                </div>

                                                {/* Message actions (for own messages) */}
                                                {isOwn && (
                                                    <div className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() =>
                                                                setMenuOpen(menuOpen === message.id ? null : message.id)
                                                            }
                                                            className="p-1.5 hover:bg-gray-700 rounded"
                                                        >
                                                            <MoreVertical className="w-4 h-4 text-gray-400" />
                                                        </button>

                                                        {menuOpen === message.id && (
                                                            <div className="absolute right-0 mt-1 bg-gray-800 border border-blue-900/30 rounded-lg shadow-xl py-1 z-10">
                                                                <button
                                                                    onClick={() => {
                                                                        setEditingMessage(message.id)
                                                                        setEditContent(message.content)
                                                                        setMenuOpen(null)
                                                                    }}
                                                                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-700 w-full text-left text-sm"
                                                                >
                                                                    <Edit2 className="w-4 h-4" />
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteMessage(message.id)}
                                                                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-700 w-full text-left text-sm text-red-400"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            )
                        })
                    )}
                    <div ref={messagesEndRef} />
                </Card>

                {/* Input Area */}
                <Card className="p-4">
                    <div className="flex items-end gap-3">
                        <textarea
                            ref={inputRef}
                            value={newMessage}
                            onChange={(e) => {
                                setNewMessage(e.target.value)
                                handleTyping()
                            }}
                            onKeyDown={handleKeyPress}
                            placeholder="Type a message..."
                            className="flex-1 bg-gray-900/50 border border-blue-900/30 rounded-xl px-4 py-3 resize-none focus:outline-none focus:border-blue-600 transition-colors max-h-32"
                            rows={1}
                            disabled={state.contract?.status !== "active"}
                        />
                        <Button
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim() || state.sending || state.contract?.status !== "active"}
                            isLoading={state.sending}
                            icon={Send}
                            className="shrink-0"
                        >
                            Send
                        </Button>
                    </div>
                    {state.contract?.status !== "active" && (
                        <p className="text-sm text-yellow-500 mt-2">
                            Messaging is disabled because this contract is not active.
                        </p>
                    )}
                </Card>
            </div>
        </PageContainer>
    )
}
