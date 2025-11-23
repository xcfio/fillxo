"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { PageContainer } from "@/components/ui/page-container"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Briefcase, DollarSign, Calendar, Users, Plus, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { getUser } from "@/utils/auth"

interface Job {
    id: string
    clientId: string
    title: string
    description: string
    category: string
    skills: string[]
    budget: string
    isOpen: boolean
    closedAt: string
    proposalCount: number
    createdAt: string
}

export default function JobsPage() {
    const router = useRouter()
    const [jobs, setJobs] = useState<Job[]>([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<string>("all")
    const [user, setUser] = useState<any>(null)
    const itemsPerPage = 20

    useEffect(() => {
        const fetchUser = async () => setUser(await getUser())
        fetchUser()
    }, [])

    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true)
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/job?page=${currentPage}&limit=${itemsPerPage}`,
                    {
                        credentials: "include"
                    }
                )

                if (response.ok) {
                    const jobsData = await response.json()
                    setJobs(jobsData)
                } else {
                    console.error("Failed to fetch jobs")
                }
            } catch (error) {
                console.error("Error fetching jobs:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchJobs()
    }, [currentPage])

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
    }

    const formatBudget = (budget: string) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(parseFloat(budget))
    }

    const categories = ["all", ...Array.from(new Set(jobs.map((job) => job.category)))]

    const filteredJobs = jobs.filter((job) => {
        const matchesSearch =
            job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()))

        const matchesCategory = selectedCategory === "all" || job.category === selectedCategory

        return matchesSearch && matchesCategory
    })

    if (loading) {
        return <LoadingSpinner />
    }

    return (
        <PageContainer>
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-12">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-4xl font-bold mb-2">
                                Browse <span className="text-blue-400">Jobs</span>
                            </h1>
                            <p className="text-gray-400">
                                Find your next opportunity from {jobs.length} available jobs
                            </p>
                        </div>
                        {user && (user.role === "client" || user.role === "both") && (
                            <Button onClick={() => router.push("/jobs/post")} icon={Plus}>
                                Post a Job
                            </Button>
                        )}
                    </div>

                    {/* Search and Filter */}
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search jobs by title, description, or skills..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-blue-900/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-600/50 transition-colors"
                            />
                        </div>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-4 py-3 bg-gray-900/50 border border-blue-900/30 rounded-lg text-white focus:outline-none focus:border-blue-600/50 transition-colors"
                        >
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category === "all" ? "All Categories" : category}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Jobs Grid */}
                {filteredJobs.length === 0 ? (
                    <Card className="text-center py-12">
                        <Briefcase className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
                        <p className="text-gray-400">
                            {searchTerm || selectedCategory !== "all"
                                ? "Try adjusting your search or filters"
                                : "Check back soon for new opportunities"}
                        </p>
                    </Card>
                ) : (
                    <div className="grid gap-6 mb-8">
                        {filteredJobs.map((job) => (
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
                                                <DollarSign className="w-4 h-4" />
                                                <span className="font-semibold text-blue-400">
                                                    {formatBudget(job.budget)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Users className="w-4 h-4" />
                                                <span>
                                                    {job.proposalCount} proposal{job.proposalCount !== 1 ? "s" : ""}
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
                )}

                {/* Pagination */}
                {filteredJobs.length > 0 && (
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
                            disabled={jobs.length < itemsPerPage}
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
