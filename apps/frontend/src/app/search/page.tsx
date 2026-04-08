"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState, useCallback, Suspense } from "react"
import { PageContainer } from "@/components/ui/page-container"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import Image from "next/image"
import { Search, Briefcase, User, Calendar, MapPin, ChevronLeft, ChevronRight, Filter, X } from "lucide-react"
import { formatDate } from "@/utils/time"
import { formatBudget } from "@/utils/format"
import { PublicUser } from "@/types/user"

interface Job {
    id: string
    clientId: string
    title: string
    description: string
    category: string
    skills: string[]
    budget: number
    isOpen: boolean
    closedAt: string
    createdAt: string
}

type SearchType = "jobs" | "users"

function SearchPageContent() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [searchType, setSearchType] = useState<SearchType>((searchParams.get("type") as SearchType) || "jobs")
    const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
    const [inputValue, setInputValue] = useState(searchParams.get("q") || "")

    // Jobs filters
    const [category, setCategory] = useState(searchParams.get("category") || "")
    const [minBudget, setMinBudget] = useState(searchParams.get("minBudget") || "")
    const [maxBudget, setMaxBudget] = useState(searchParams.get("maxBudget") || "")

    // Users filters
    const [role, setRole] = useState(searchParams.get("role") || "")
    const [country, setCountry] = useState(searchParams.get("country") || "")

    const [currentPage, setCurrentPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [jobs, setJobs] = useState<Job[]>([])
    const [users, setUsers] = useState<PublicUser[]>([])
    const [showFilters, setShowFilters] = useState(false)

    const itemsPerPage = 20

    const performSearch = useCallback(async () => {
        if (!searchQuery.trim()) {
            setJobs([])
            setUsers([])
            return
        }

        setLoading(true)
        try {
            if (searchType === "jobs") {
                const params = new URLSearchParams({
                    q: searchQuery,
                    page: currentPage.toString(),
                    limit: itemsPerPage.toString()
                })
                if (category) params.set("category", category)
                if (minBudget) params.set("minBudget", minBudget)
                if (maxBudget) params.set("maxBudget", maxBudget)

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/search/jobs?${params}`, {
                    credentials: "include"
                })

                if (response.ok) {
                    const data = await response.json()
                    setJobs(data)
                    setUsers([])
                } else {
                    console.error("Failed to search jobs")
                }
            } else {
                const params = new URLSearchParams({
                    q: searchQuery,
                    page: currentPage.toString(),
                    limit: itemsPerPage.toString()
                })
                if (role) params.set("role", role)
                if (country) params.set("country", country)

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/search/user?${params}`, {
                    credentials: "include"
                })

                if (response.ok) {
                    const data = await response.json()
                    setUsers(data)
                    setJobs([])
                } else {
                    console.error("Failed to search users")
                }
            }
        } catch (error) {
            console.error("Search error:", error)
        } finally {
            setLoading(false)
        }
    }, [searchQuery, searchType, currentPage, category, minBudget, maxBudget, role, country])

    useEffect(() => {
        performSearch()
    }, [performSearch])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        setSearchQuery(inputValue)
        setCurrentPage(1)

        // Update URL params
        const params = new URLSearchParams()
        params.set("q", inputValue)
        params.set("type", searchType)
        if (searchType === "jobs") {
            if (category) params.set("category", category)
            if (minBudget) params.set("minBudget", minBudget)
            if (maxBudget) params.set("maxBudget", maxBudget)
        } else {
            if (role) params.set("role", role)
            if (country) params.set("country", country)
        }
        router.push(`/search?${params.toString()}`)
    }

    const handleTypeChange = (type: SearchType) => {
        setSearchType(type)
        setCurrentPage(1)
        // Clear type-specific filters
        if (type === "jobs") {
            setRole("")
            setCountry("")
        } else {
            setCategory("")
            setMinBudget("")
            setMaxBudget("")
        }
    }

    const clearFilters = () => {
        setCategory("")
        setMinBudget("")
        setMaxBudget("")
        setRole("")
        setCountry("")
        setCurrentPage(1)
    }

    const hasActiveFilters =
        (searchType === "jobs" && (category || minBudget || maxBudget)) || (searchType === "users" && (role || country))

    const results = searchType === "jobs" ? jobs : users

    return (
        <PageContainer>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">
                        Search <span className="text-blue-400">{searchType === "jobs" ? "Jobs" : "Users"}</span>
                    </h1>
                    <p className="text-gray-400">
                        Find {searchType === "jobs" ? "the perfect opportunity" : "talented professionals"}
                    </p>
                </div>

                {/* Search Form */}
                <form onSubmit={handleSearch} className="mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search Type Tabs */}
                        <div className="flex bg-gray-900/50 border border-blue-900/30 rounded-lg p-1">
                            <button
                                type="button"
                                onClick={() => handleTypeChange("jobs")}
                                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                                    searchType === "jobs" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
                                }`}
                            >
                                <Briefcase className="w-4 h-4" />
                                Jobs
                            </button>
                            <button
                                type="button"
                                onClick={() => handleTypeChange("users")}
                                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                                    searchType === "users" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
                                }`}
                            >
                                <User className="w-4 h-4" />
                                Users
                            </button>
                        </div>

                        {/* Search Input */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder={
                                    searchType === "jobs"
                                        ? "Search jobs by title, description, skills..."
                                        : "Search users by name, username, skills..."
                                }
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-blue-900/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-600/50 transition-colors"
                            />
                        </div>

                        {/* Filter Toggle */}
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setShowFilters(!showFilters)}
                            icon={Filter}
                            iconPosition="left"
                            className={hasActiveFilters ? "border-blue-600/50" : ""}
                        >
                            Filters
                            {hasActiveFilters && <span className="ml-1 w-2 h-2 bg-blue-400 rounded-full" />}
                        </Button>

                        {/* Search Button */}
                        <Button type="submit" icon={Search} iconPosition="left">
                            Search
                        </Button>
                    </div>

                    {/* Filters Panel */}
                    {showFilters && (
                        <Card className="mt-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold">Filters</h3>
                                {hasActiveFilters && (
                                    <button
                                        type="button"
                                        onClick={clearFilters}
                                        className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
                                    >
                                        <X className="w-4 h-4" />
                                        Clear all
                                    </button>
                                )}
                            </div>

                            {searchType === "jobs" ? (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">Category</label>
                                        <input
                                            type="text"
                                            placeholder="e.g., Web Development"
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="w-full px-4 py-2 bg-gray-800/50 border border-blue-900/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-600/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">Min Budget</label>
                                        <input
                                            type="number"
                                            placeholder="0"
                                            value={minBudget}
                                            onChange={(e) => setMinBudget(e.target.value)}
                                            className="w-full px-4 py-2 bg-gray-800/50 border border-blue-900/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-600/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">Max Budget</label>
                                        <input
                                            type="number"
                                            placeholder="No limit"
                                            value={maxBudget}
                                            onChange={(e) => setMaxBudget(e.target.value)}
                                            className="w-full px-4 py-2 bg-gray-800/50 border border-blue-900/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-600/50"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Select
                                        label="Role"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        options={[
                                            { value: "", label: "All Roles" },
                                            { value: "freelancer", label: "Freelancer" },
                                            { value: "client", label: "Client" }
                                        ]}
                                    />
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">Country Code</label>
                                        <input
                                            type="text"
                                            placeholder="e.g., US, BD"
                                            value={country}
                                            onChange={(e) => setCountry(e.target.value.toUpperCase())}
                                            maxLength={2}
                                            className="w-full px-4 py-2 bg-gray-800/50 border border-blue-900/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-600/50"
                                        />
                                    </div>
                                </div>
                            )}
                        </Card>
                    )}
                </form>

                {/* Results */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : !searchQuery ? (
                    <Card className="text-center py-12">
                        <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Start your search</h3>
                        <p className="text-gray-400">
                            Enter a search term to find {searchType === "jobs" ? "jobs" : "users"}
                        </p>
                    </Card>
                ) : results.length === 0 ? (
                    <Card className="text-center py-12">
                        <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No results found</h3>
                        <p className="text-gray-400">Try adjusting your search or filters</p>
                    </Card>
                ) : searchType === "jobs" ? (
                    <div className="grid gap-6 mb-8">
                        {jobs.map((job) => (
                            <Card
                                key={job.id}
                                hover
                                className="cursor-pointer transition-all"
                                onClick={() => router.push(`/jobs/${job.id}`)}
                            >
                                <div className="flex flex-col md:flex-row justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-3">
                                            <h3 className="text-2xl font-bold hover:text-blue-400 transition-colors">
                                                {job.title}
                                            </h3>
                                            {job.isOpen ? (
                                                <Badge variant="success">Open</Badge>
                                            ) : (
                                                <Badge variant="danger">Closed</Badge>
                                            )}
                                        </div>

                                        <p className="text-gray-400 mb-4 line-clamp-2">{job.description}</p>

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            <Badge variant="info">{job.category}</Badge>
                                            {job.skills.slice(0, 4).map((skill, index) => (
                                                <Badge key={index} variant="primary">
                                                    {skill}
                                                </Badge>
                                            ))}
                                            {job.skills.length > 4 && (
                                                <Badge variant="primary">+{job.skills.length - 4} more</Badge>
                                            )}
                                        </div>

                                        <div className="flex flex-wrap gap-6 text-sm text-gray-400">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-blue-400">
                                                    {formatBudget(job.budget)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                <span>Posted {formatDate(job.createdAt)}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                <span>Closes {formatDate(job.closedAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
                        {users.map((user) => (
                            <Card
                                key={user.username}
                                hover
                                className="cursor-pointer transition-all"
                                onClick={() => router.push(`/users/${user.username}`)}
                            >
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-20 h-20 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4 overflow-hidden">
                                        {user.avatar ? (
                                            <Image
                                                src={user.avatar}
                                                alt={user.name}
                                                width={80}
                                                height={80}
                                                className="object-cover"
                                            />
                                        ) : (
                                            <User className="w-10 h-10 text-white" />
                                        )}
                                    </div>

                                    <h3 className="text-xl font-bold mb-1 hover:text-blue-400 transition-colors">
                                        {user.name}
                                    </h3>
                                    <p className="text-gray-400 text-sm mb-2">@{user.username}</p>

                                    {user.freelancer?.title && (
                                        <p className="text-blue-400 text-sm mb-3">{user.freelancer.title}</p>
                                    )}

                                    <div className="flex flex-wrap justify-center gap-2 mb-4">
                                        <Badge variant={user.role === "freelancer" ? "primary" : "info"}>
                                            {user.role}
                                        </Badge>
                                        {user.country && (
                                            <Badge variant="info">
                                                <MapPin className="w-3 h-3 mr-1" />
                                                {user.country}
                                            </Badge>
                                        )}
                                    </div>

                                    {user.freelancer?.skills && user.freelancer.skills.length > 0 && (
                                        <div className="flex flex-wrap justify-center gap-1">
                                            {user.freelancer.skills.slice(0, 3).map((skill, index) => (
                                                <Badge key={index} variant="primary" className="text-xs">
                                                    {skill}
                                                </Badge>
                                            ))}
                                            {user.freelancer.skills.length > 3 && (
                                                <Badge variant="primary" className="text-xs">
                                                    +{user.freelancer.skills.length - 3}
                                                </Badge>
                                            )}
                                        </div>
                                    )}

                                    <div className="mt-4 text-xs text-gray-500">
                                        <Calendar className="w-3 h-3 inline mr-1" />
                                        Joined {formatDate(user.createdAt)}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {results.length > 0 && (
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
                            disabled={results.length < itemsPerPage}
                            icon={ChevronRight}
                        >
                            Next
                        </Button>
                    </div>
                )}
            </div>
        </PageContainer>
    )
}

export default function SearchPage() {
    return (
        <Suspense fallback={<LoadingSpinner message="Loading search..." />}>
            <SearchPageContent />
        </Suspense>
    )
}
