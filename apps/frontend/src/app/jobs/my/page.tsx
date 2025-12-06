"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { PageContainer } from "@/components/ui/page-container"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Briefcase, Calendar, Plus, Search, ChevronLeft, ChevronRight, Edit, Trash2, Eye } from "lucide-react"
import { getUser } from "@/utils/auth"
import { formatDate } from "@/utils/time"
import { formatBudget } from "@/utils/format"

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

export default function MyJobsPage() {
    const router = useRouter()
    const [jobs, setJobs] = useState<Job[]>([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [searchTerm, setSearchTerm] = useState("")
    const [user, setUser] = useState<any>(null)
    const [deleting, setDeleting] = useState<string | null>(null)
    const itemsPerPage = 20

    useEffect(() => {
        const fetchUserAndJobs = async () => {
            try {
                const userData = await getUser()
                if (!userData) {
                    router.push("/login")
                    return
                }
                if (userData.role !== "client") {
                    router.push("/dashboard")
                    return
                }
                setUser(userData)
                await fetchJobs(userData.id)
            } catch (error) {
                console.error("Error:", error)
                router.push("/login")
            }
        }

        fetchUserAndJobs()
    }, [router])

    const fetchJobs = async (clientId: string) => {
        setLoading(true)
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_ENDPOINT}/job?clientId=${clientId}&page=${currentPage}&limit=${itemsPerPage}`,
                { credentials: "include" }
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

    useEffect(() => {
        if (user?.id) {
            fetchJobs(user.id)
        }
    }, [currentPage])

    const handleDelete = async (jobId: string) => {
        if (!confirm("Are you sure you want to delete this job?")) return

        setDeleting(jobId)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/job/${jobId}`, {
                method: "DELETE",
                credentials: "include"
            })

            if (response.ok) {
                setJobs(jobs.filter((job) => job.id !== jobId))
            } else {
                const error = await response.json()
                alert(error.message || "Failed to delete job")
            }
        } catch (error) {
            console.error("Error deleting job:", error)
            alert("Failed to delete job")
        } finally {
            setDeleting(null)
        }
    }

    const filteredJobs = jobs.filter((job) => {
        return (
            job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()))
        )
    })

    if (loading || !user) {
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
                                My <span className="text-blue-400">Posted Jobs</span>
                            </h1>
                            <p className="text-gray-400">
                                Manage your {jobs.length} job listing{jobs.length !== 1 ? "s" : ""}
                            </p>
                        </div>
                        <Button onClick={() => router.push("/jobs/post")} icon={Plus}>
                            Post a Job
                        </Button>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search your jobs by title, description, or skills..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-blue-900/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-600/50 transition-colors"
                        />
                    </div>
                </div>

                {/* Jobs Grid */}
                {filteredJobs.length === 0 ? (
                    <Card className="text-center py-12">
                        <Briefcase className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">
                            {searchTerm ? "No jobs found" : "No jobs posted yet"}
                        </h3>
                        <p className="text-gray-400 mb-6">
                            {searchTerm
                                ? "Try adjusting your search"
                                : "Post your first job to find talented freelancers"}
                        </p>
                        {!searchTerm && (
                            <Button onClick={() => router.push("/jobs/post")} icon={Plus}>
                                Post Your First Job
                            </Button>
                        )}
                    </Card>
                ) : (
                    <div className="grid gap-6 mb-8">
                        {filteredJobs.map((job) => (
                            <Card key={job.id} className="transition-all">
                                <div className="flex flex-col md:flex-row justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-3">
                                            <h3
                                                className="text-2xl font-bold hover:text-blue-400 transition-colors cursor-pointer"
                                                onClick={() => router.push(`/jobs/${job.id}`)}
                                            >
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

                                    {/* Action Buttons */}
                                    <div className="flex md:flex-col gap-2 shrink-0">
                                        <Button
                                            variant="secondary"
                                            onClick={() => router.push(`/jobs/${job.id}`)}
                                            icon={Eye}
                                            className="px-4 py-2 text-sm"
                                        >
                                            View
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            onClick={() => router.push(`/jobs/${job.id}/proposals`)}
                                            icon={Briefcase}
                                            className="px-4 py-2 text-sm"
                                        >
                                            Proposals
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            onClick={() => router.push(`/jobs/${job.id}/edit`)}
                                            icon={Edit}
                                            className="px-4 py-2 text-sm"
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="danger"
                                            onClick={() => handleDelete(job.id)}
                                            disabled={deleting === job.id}
                                            icon={Trash2}
                                            className="px-4 py-2 text-sm"
                                        >
                                            {deleting === job.id ? "..." : "Delete"}
                                        </Button>
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
