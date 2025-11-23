import { User } from "@/types/user"

export async function isAuthenticated(): Promise<boolean> {
    return Boolean(await getUser())
}

export async function getUser(): Promise<User | null> {
    try {
        const user = window.sessionStorage.getItem("user")
        if (user) return JSON.parse(user)

        const nextAuthCheck = window.sessionStorage.getItem("auth-retry-after")
        if (nextAuthCheck && new Date(nextAuthCheck) > new Date()) return null

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/users/me`, { credentials: "include" })
        if (!response.ok) {
            if (response.status === 401) {
                const nextCheck = new Date()
                nextCheck.setMinutes(nextCheck.getMinutes() + 2)
                window.sessionStorage.setItem("auth-retry-after", nextCheck.toISOString())
            }
            return null
        }

        const data = await response.json()
        window.sessionStorage.setItem("user", JSON.stringify(data))
        return data
    } catch (error) {
        console.error("Failed to get user:", error)
        return null
    }
}
