"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { PageContainer } from "@/components/ui/page-container"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Send, Inbox } from "lucide-react"
import { getUser } from "@/utils/auth"

export default function ProposalsPage() {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await getUser()
                if (!user) return router.push("/login")
                setUser(user)
            } catch (error) {
                router.push("/login")
            } finally {
                setLoading(false)
            }
        }

        fetchUser()
    }, [router])

    if (loading || !user) {
        return <LoadingSpinner />
    }

    const canViewSent = user.role === "freelancer" || user.role === "both"
    const canViewReceived = user.role === "client" || user.role === "both"

    return (
        <PageContainer>
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-12">
                    <h1 className="text-4xl font-bold mb-2">
                        My <span className="text-blue-400">Proposals</span>
                    </h1>
                    <p className="text-gray-400">Manage your proposals and track their status</p>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {canViewSent && (
                        <Card hover className="cursor-pointer" onClick={() => router.push("/proposals/sent")}>
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 bg-blue-600/20 border border-blue-700/50 rounded-xl flex items-center justify-center">
                                    <Send className="w-7 h-7 text-blue-400" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold mb-2">Sent Proposals</h3>
                                    <p className="text-gray-400 mb-4">
                                        View and manage proposals you&apos;ve submitted to job postings
                                    </p>
                                    <Button variant="secondary">View Sent Proposals</Button>
                                </div>
                            </div>
                        </Card>
                    )}

                    {canViewReceived && (
                        <Card hover className="cursor-pointer" onClick={() => router.push("/proposals/received")}>
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 bg-emerald-600/20 border border-emerald-700/50 rounded-xl flex items-center justify-center">
                                    <Inbox className="w-7 h-7 text-emerald-400" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold mb-2">Received Proposals</h3>
                                    <p className="text-gray-400 mb-4">
                                        Review proposals received for your job postings
                                    </p>
                                    <Button variant="secondary">View Received Proposals</Button>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>

                {/* Info Card */}
                <Card className="bg-blue-600/10 border-blue-600/30">
                    <div className="flex items-start gap-4">
                        <FileText className="w-8 h-8 text-blue-400 shrink-0" />
                        <div>
                            <h3 className="text-lg font-bold mb-2">About Proposals</h3>
                            <p className="text-gray-300">
                                {canViewSent && canViewReceived
                                    ? "As a user with both client and freelancer roles, you can send proposals to job postings and receive proposals for your own jobs."
                                    : canViewSent
                                      ? "As a freelancer, you can submit proposals to job postings. Track the status of your proposals and communicate with potential clients."
                                      : "As a client, you receive proposals from freelancers for your job postings. Review, accept, or reject proposals to find the best match for your project."}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </PageContainer>
    )
}
