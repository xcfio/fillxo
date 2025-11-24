/**
 * Formats an ISO date string into a human-readable relative time string
 * Examples: "just now", "2 minutes ago", "3 hours ago", "2 days ago"
 */
export function formatTimeAgo(isoDate: string | Date): string {
    const now = new Date()
    const past = new Date(isoDate)
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)

    if (diffInSeconds < 0) return "in the future"
    if (diffInSeconds < 60) return "just now"

    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) {
        return diffInMinutes === 1 ? "1 minute ago" : `${diffInMinutes} minutes ago`
    }

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) {
        return diffInHours === 1 ? "1 hour ago" : `${diffInHours} hours ago`
    }

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) {
        return diffInDays === 1 ? "1 day ago" : `${diffInDays} days ago`
    }

    const diffInWeeks = Math.floor(diffInDays / 7)
    if (diffInWeeks < 4) {
        return diffInWeeks === 1 ? "1 week ago" : `${diffInWeeks} weeks ago`
    }

    const diffInMonths = Math.floor(diffInDays / 30)
    if (diffInMonths < 12) {
        return diffInMonths === 1 ? "1 month ago" : `${diffInMonths} months ago`
    }

    const diffInYears = Math.floor(diffInDays / 365)
    return diffInYears === 1 ? "1 year ago" : `${diffInYears} years ago`
}

/**
 * Formats an ISO date string into a readable date and time format
 * Example: "Nov 24, 2025 at 3:45 PM"
 */
export function formatDateTime(isoDate: string | Date): string {
    const date = new Date(isoDate)
    const options: Intl.DateTimeFormatOptions = {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true
    }
    return date.toLocaleString("en-UK", options).replace(",", " at")
}

/**
 * Formats an ISO date string into a short date format
 * Example: "Nov 24, 2025"
 */
export function formatDate(isoDate: string | Date): string {
    const date = new Date(isoDate)
    const options: Intl.DateTimeFormatOptions = {
        month: "short",
        day: "numeric",
        year: "numeric"
    }
    return date.toLocaleDateString("en-UK", options)
}

/**
 * Formats time remaining until a future ISO date
 * Examples: "2 hours left", "3 days left", "expired"
 */
export function formatTimeRemaining(isoDate: string | Date): string {
    const now = new Date()
    const future = new Date(isoDate)
    const diffInSeconds = Math.floor((future.getTime() - now.getTime()) / 1000)

    if (diffInSeconds < 0) return "expired"
    if (diffInSeconds < 60) return "less than a minute left"

    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) {
        return diffInMinutes === 1 ? "1 minute left" : `${diffInMinutes} minutes left`
    }

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) {
        return diffInHours === 1 ? "1 hour left" : `${diffInHours} hours left`
    }

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) {
        return diffInDays === 1 ? "1 day left" : `${diffInDays} days left`
    }

    const diffInWeeks = Math.floor(diffInDays / 7)
    if (diffInWeeks < 4) {
        return diffInWeeks === 1 ? "1 week left" : `${diffInWeeks} weeks left`
    }

    const diffInMonths = Math.floor(diffInDays / 30)
    return diffInMonths === 1 ? "1 month left" : `${diffInMonths} months left`
}

/**
 * Converts a local datetime-local input value to ISO string for API
 * Input format: "2025-11-24T15:30" (from datetime-local input)
 * Output format: "2025-11-24T15:30:00.000Z" (ISO string)
 */
export function localToISO(localDateTime: string): string {
    return new Date(localDateTime).toISOString()
}

/**
 * Converts an ISO date string to local datetime-local input format
 * Input format: "2025-11-24T15:30:00.000Z" (ISO string)
 * Output format: "2025-11-24T15:30" (for datetime-local input)
 */
export function isoToLocal(isoDate: string | Date): string {
    const date = new Date(isoDate)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    const hours = String(date.getHours()).padStart(2, "0")
    const minutes = String(date.getMinutes()).padStart(2, "0")
    return `${year}-${month}-${day}T${hours}:${minutes}`
}

/**
 * Checks if a date/time is in the past
 */
export function isPast(isoDate: string | Date): boolean {
    return new Date(isoDate).getTime() < Date.now()
}

/**
 * Checks if a date/time is in the future
 */
export function isFuture(isoDate: string | Date): boolean {
    return new Date(isoDate).getTime() > Date.now()
}

/**
 * Checks if a date is within the next X hours
 */
export function isWithinHours(isoDate: string | Date, hours: number): boolean {
    const target = new Date(isoDate).getTime()
    const now = Date.now()
    const threshold = now + hours * 60 * 60 * 1000
    return target > now && target < threshold
}

/**
 * Gets a minimum date for datetime-local input (e.g., tomorrow)
 */
export function getMinDateTime(daysFromNow: number = 1): string {
    const date = new Date()
    date.setDate(date.getDate() + daysFromNow)
    return isoToLocal(date)
}
