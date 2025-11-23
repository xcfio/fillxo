"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { PageContainer } from "@/components/ui/page-container"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ErrorAlert } from "@/components/ui/error-alert"
import { ArrowLeft, Briefcase, Save } from "lucide-react"
import { getUser } from "@/utils/auth"

export default function PostJobPage() {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string>("")

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        skills: "",
        budget: "",
        closedAt: ""
    })

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await getUser()
                if (!user) return router.push("/login")

                if (user.role !== "client" && user.role !== "both") {
                    router.push("/jobs")
                    return
                }

                setUser(user)
            } catch (error) {
                router.push("/login")
            } finally {
                setLoading(false)
            }
        }

        fetchUser()
    }, [router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setSubmitting(true)

        try {
            // Validate form
            if (!formData.title.trim()) {
                setError("Please enter a job title")
                setSubmitting(false)
                return
            }

            if (!formData.description.trim()) {
                setError("Please enter a job description")
                setSubmitting(false)
                return
            }

            if (!formData.category.trim()) {
                setError("Please select a category")
                setSubmitting(false)
                return
            }

            if (!formData.budget || parseFloat(formData.budget) <= 0) {
                setError("Please enter a valid budget")
                setSubmitting(false)
                return
            }

            if (!formData.closedAt) {
                setError("Please select a closing date")
                setSubmitting(false)
                return
            }

            // Check if closing date is in the future
            const closingDate = new Date(formData.closedAt)
            if (closingDate <= new Date()) {
                setError("Closing date must be in the future")
                setSubmitting(false)
                return
            }

            // Parse skills (comma-separated)
            const skillsArray = formData.skills
                .split(",")
                .map((s) => s.trim())
                .filter((s) => s.length > 0)

            if (skillsArray.length === 0) {
                setError("Please enter at least one skill")
                setSubmitting(false)
                return
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/job`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    title: formData.title.trim(),
                    description: formData.description.trim(),
                    category: formData.category.trim(),
                    skills: skillsArray,
                    budget: formData.budget,
                    closedAt: new Date(formData.closedAt).toISOString()
                })
            })

            if (response.ok) {
                const job = await response.json()
                router.push(`/jobs/${job.id}`)
            } else {
                const errorData = await response.json()
                setError(errorData.message || "Failed to create job posting")
            }
        } catch (error) {
            console.error("Error creating job:", error)
            setError("An error occurred while creating the job posting")
        } finally {
            setSubmitting(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    if (loading) {
        return <LoadingSpinner />
    }

    if (!user) {
        return null
    }

    // Get minimum date (tomorrow)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const minDate = tomorrow.toISOString().slice(0, 16)

    const categories = [
        "Web Development",
        "Mobile Development",
        "Design",
        "Writing",
        "Marketing",
        "Data Science",
        "Video & Animation",
        "Music & Audio",
        "Business",
        "Other"
    ]

    return (
        <PageContainer>
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <Button
                    variant="secondary"
                    onClick={() => router.push("/jobs")}
                    icon={ArrowLeft}
                    iconPosition="left"
                    className="mb-6"
                >
                    Back to Jobs
                </Button>

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-blue-600/20 border border-blue-700/50 rounded-xl flex items-center justify-center">
                            <Briefcase className="w-8 h-8 text-blue-400" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold">
                                Post a <span className="text-blue-400">Job</span>
                            </h1>
                            <p className="text-gray-400">Find the perfect freelancer for your project</p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <Card>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && <ErrorAlert message={error} />}

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Job Title <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g., Build a responsive website for my business"
                                className="w-full px-4 py-3 bg-gray-900/50 border border-blue-900/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-600/50 transition-colors"
                                required
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Category <span className="text-red-400">*</span>
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-900/50 border border-blue-900/30 rounded-lg text-white focus:outline-none focus:border-blue-600/50 transition-colors"
                                required
                            >
                                <option value="">Select a category</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Description <span className="text-red-400">*</span>
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe your project in detail. Include requirements, deliverables, and any other relevant information..."
                                rows={8}
                                className="w-full px-4 py-3 bg-gray-900/50 border border-blue-900/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-600/50 transition-colors resize-none"
                                required
                            />
                            <p className="text-sm text-gray-400 mt-2">
                                Tip: Be specific about your requirements to attract the right freelancers
                            </p>
                        </div>

                        {/* Skills */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Required Skills <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                name="skills"
                                value={formData.skills}
                                onChange={handleChange}
                                placeholder="e.g., React, Node.js, TypeScript, MongoDB (comma-separated)"
                                className="w-full px-4 py-3 bg-gray-900/50 border border-blue-900/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-600/50 transition-colors"
                                required
                            />
                            <p className="text-sm text-gray-400 mt-2">
                                Enter skills separated by commas. This helps freelancers find your job.
                            </p>
                        </div>

                        {/* Budget */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Budget (USD) <span className="text-red-400">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                <input
                                    type="number"
                                    name="budget"
                                    value={formData.budget}
                                    onChange={handleChange}
                                    placeholder="1000"
                                    min="1"
                                    step="0.01"
                                    className="w-full pl-8 pr-4 py-3 bg-gray-900/50 border border-blue-900/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-600/50 transition-colors"
                                    required
                                />
                            </div>
                        </div>

                        {/* Closing Date */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Application Deadline <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="datetime-local"
                                name="closedAt"
                                value={formData.closedAt}
                                onChange={handleChange}
                                min={minDate}
                                className="w-full px-4 py-3 bg-gray-900/50 border border-blue-900/30 rounded-lg text-white focus:outline-none focus:border-blue-600/50 transition-colors"
                                required
                            />
                            <p className="text-sm text-gray-400 mt-2">
                                Set a deadline for when you want to stop accepting proposals
                            </p>
                        </div>

                        {/* Submit Button */}
                        <div className="flex gap-4 pt-4">
                            <Button type="submit" isLoading={submitting} icon={Save} className="flex-1">
                                {submitting ? "Creating..." : "Post Job"}
                            </Button>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => router.push("/jobs")}
                                disabled={submitting}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </PageContainer>
    )
}
