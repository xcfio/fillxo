export type Role = "freelancer" | "client" | "both"
export type Privilege = "moderator" | "admin"
export type Gender = "male" | "female" | "other"

export type Rating = {
    id: string
    review: 1 | 2 | 3 | 4 | 5
    comment?: string
}

export type Client = {
    companyName?: string
    industry?: string
}

export type Freelancer = {
    title?: string
    bio?: string
    skills?: string[]
    portfolio?: Array<{
        title: string
        description: string
        images?: string
        link?: string
    }>
}

export type User = {
    id: string
    email: string
    username: string
    name: string
    gender: Gender
    avatar: string | null
    phone: string
    phoneVerified: boolean
    role: Role
    privilege: Privilege | null
    isBanned: boolean
    country: string | null
    rating: Rating | null
    client: Client | null
    freelancer: Freelancer | null
    createdAt: string
    updatedAt: string
}

export type PublicUser = {
    username: string
    name: string
    avatar: string | null
    role: Role
    country: string | null
    rating: Rating | null
    freelancer: Freelancer | null
    client: Client | null
    createdAt: string
}
