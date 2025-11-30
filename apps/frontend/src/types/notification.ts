export interface Notification {
    id: string
    userId: string
    title: string
    message: string
    link: string | null
    isRead: boolean
    createdAt: string
}
