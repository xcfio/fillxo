"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { PageContainer } from "@/components/ui/page-container"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import { Bell, Check, CheckCheck, Trash2, ChevronLeft, ChevronRight, ExternalLink, Circle } from "lucide-react"
import { getUser } from "@/utils/auth"
import { formatTimeAgo } from "@/utils/time"
import { Notification } from "@/types/notification"

export default function NotificationsPage() {
    const router = useRouter()
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [readFilter, setReadFilter] = useState<"all" | "unread" | "read">("all")
    const [user, setUser] = useState<any>(null)
    const [actionLoading, setActionLoading] = useState<string | null>(null)
    const itemsPerPage = 20

    useEffect(() => {
        const fetchUser = async () => {
            const user = await getUser()
            if (!user) return router.push("/login")
            setUser(user)
        }
        fetchUser()
    }, [router])

    useEffect(() => {
        const fetchNotifications = async () => {
            if (!user) return
            setLoading(true)
            try {
                const params = new URLSearchParams({
                    page: currentPage.toString(),
                    limit: itemsPerPage.toString()
                })
                if (readFilter === "unread") {
                    params.append("isRead", "false")
                } else if (readFilter === "read") {
                    params.append("isRead", "true")
                }

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/notifications?${params}`, {
                    credentials: "include"
                })

                if (response.ok) {
                    setNotifications(await response.json())
                } else {
                    console.error("Failed to fetch notifications")
                }
            } catch (error) {
                console.error("Error fetching notifications:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchNotifications()
    }, [currentPage, readFilter, user])

    const handleMarkRead = async (notificationId: string, e: React.MouseEvent) => {
        e.stopPropagation()
        setActionLoading(notificationId)
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_ENDPOINT}/notifications/${notificationId}/read`,
                {
                    method: "PUT",
                    credentials: "include"
                }
            )

            if (response.ok) {
                setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)))
            }
        } catch (error) {
            console.error("Error marking notification as read:", error)
        } finally {
            setActionLoading(null)
        }
    }

    const handleMarkAllRead = async () => {
        setActionLoading("all")
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/notifications/read-all`, {
                method: "PUT",
                credentials: "include"
            })

            if (response.ok) {
                setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
            }
        } catch (error) {
            console.error("Error marking all notifications as read:", error)
        } finally {
            setActionLoading(null)
        }
    }

    const handleDelete = async (notificationId: string, e: React.MouseEvent) => {
        e.stopPropagation()
        if (!confirm("Are you sure you want to delete this notification?")) return

        setActionLoading(notificationId)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/notifications/${notificationId}`, {
                method: "DELETE",
                credentials: "include"
            })

            if (response.ok) {
                setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
            }
        } catch (error) {
            console.error("Error deleting notification:", error)
        } finally {
            setActionLoading(null)
        }
    }

    const handleNotificationClick = (notification: Notification) => {
        // Mark as read if unread
        if (!notification.isRead) {
            fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/notifications/${notification.id}/read`, {
                method: "PUT",
                credentials: "include"
            }).then(() => {
                setNotifications((prev) => prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n)))
            })
        }

        // Navigate to link if exists
        if (notification.link) {
            router.push(notification.link)
        }
    }

    const unreadCount = notifications.filter((n) => !n.isRead).length

    if (loading && !user) {
        return <LoadingSpinner />
    }

    return (
        <PageContainer>
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-blue-600/20 border border-blue-700/50 rounded-xl flex items-center justify-center">
                                <Bell className="w-7 h-7 text-blue-400" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold">
                                    <span className="text-blue-400">Notifications</span>
                                </h1>
                                <p className="text-gray-400">
                                    {unreadCount > 0
                                        ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`
                                        : "You're all caught up!"}
                                </p>
                            </div>
                        </div>
                        {notifications.some((n) => !n.isRead) && (
                            <Button
                                variant="secondary"
                                icon={CheckCheck}
                                onClick={handleMarkAllRead}
                                disabled={actionLoading === "all"}
                            >
                                Mark All Read
                            </Button>
                        )}
                    </div>

                    {/* Filter */}
                    <div className="flex gap-4">
                        <Select
                            value={readFilter}
                            onChange={(e) => {
                                setReadFilter(e.target.value as "all" | "unread" | "read")
                                setCurrentPage(1)
                            }}
                            options={[
                                { value: "all", label: "All Notifications" },
                                { value: "unread", label: "Unread Only" },
                                { value: "read", label: "Read Only" }
                            ]}
                        />
                    </div>
                </div>

                {/* Loading State */}
                {loading ? (
                    <LoadingSpinner />
                ) : notifications.length === 0 ? (
                    <Card className="text-center py-12">
                        <Bell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No notifications</h3>
                        <p className="text-gray-400">
                            {readFilter !== "all"
                                ? "Try changing your filter settings"
                                : "You don't have any notifications yet"}
                        </p>
                    </Card>
                ) : (
                    <>
                        {/* Notifications List */}
                        <div className="space-y-3 mb-8">
                            {notifications.map((notification) => (
                                <Card
                                    key={notification.id}
                                    hover
                                    className={`cursor-pointer transition-all ${
                                        !notification.isRead ? "border-blue-600/50 bg-blue-600/5" : ""
                                    }`}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Unread Indicator */}
                                        <div className="pt-1">
                                            {!notification.isRead ? (
                                                <Circle className="w-3 h-3 fill-blue-400 text-blue-400" />
                                            ) : (
                                                <Circle className="w-3 h-3 text-gray-600" />
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4 mb-1">
                                                <h3
                                                    className={`font-semibold ${
                                                        !notification.isRead ? "text-white" : "text-gray-300"
                                                    }`}
                                                >
                                                    {notification.title}
                                                </h3>
                                                <span className="text-xs text-gray-500 whitespace-nowrap">
                                                    {formatTimeAgo(notification.createdAt)}
                                                </span>
                                            </div>
                                            <p className="text-gray-400 text-sm mb-3">{notification.message}</p>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2">
                                                {notification.link && (
                                                    <Badge variant="info" className="text-xs">
                                                        <ExternalLink className="w-3 h-3 mr-1 inline" />
                                                        View Details
                                                    </Badge>
                                                )}
                                                {!notification.isRead && (
                                                    <button
                                                        onClick={(e) => handleMarkRead(notification.id, e)}
                                                        disabled={actionLoading === notification.id}
                                                        className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
                                                    >
                                                        <Check className="w-3 h-3" />
                                                        Mark as read
                                                    </button>
                                                )}
                                                <button
                                                    onClick={(e) => handleDelete(notification.id, e)}
                                                    disabled={actionLoading === notification.id}
                                                    className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors ml-auto"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-center gap-4 items-center">
                            <Button
                                variant="secondary"
                                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                icon={ChevronLeft}
                                iconPosition="left"
                            >
                                Previous
                            </Button>
                            <span className="text-gray-400">Page {currentPage}</span>
                            <Button
                                variant="secondary"
                                onClick={() => setCurrentPage((prev) => prev + 1)}
                                disabled={notifications.length < itemsPerPage}
                                icon={ChevronRight}
                            >
                                Next
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </PageContainer>
    )
}
