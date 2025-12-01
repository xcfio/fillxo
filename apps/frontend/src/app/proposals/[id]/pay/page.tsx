"use client"

import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { PageContainer } from "@/components/ui/page-container"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, AlertCircle } from "lucide-react"
import { getUser } from "@/utils/auth"
import { Contract } from "@/types/contract"

/**
 * This page is deprecated. Payment is now handled through contracts.
 * This page redirects users to the contract payment page.
 */
export default function PaymentPage() {
    const router = useRouter()
    const params = useParams()
    const proposalId = params.id as string

    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchUser = async () => {
            const userData = await getUser()
            if (!userData) return router.push("/login")
            if (userData.role !== "client" && userData.role !== "both") {
                router.push("/dashboard")
                return
            }
            setUser(userData)
        }
        fetchUser()
    }, [router])

    useEffect(() => {
        const findContractAndRedirect = async () => {
            if (!user) return
            setLoading(true)
            try {
                // Fetch contracts and find the one matching this proposal
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/contracts`, {
                    credentials: "include"
                })

                if (response.ok) {
                    const contracts: Contract[] = await response.json()
                    const contract = contracts.find((c) => c.proposalId === proposalId)

                    if (contract) {
                        // Redirect to the contract payment page
                        router.push(`/contracts/${contract.id}/pay`)
                        return
                    } else {
                        setError("No contract found for this proposal. The proposal may need to be accepted first.")
                    }
                } else {
                    setError("Failed to load contracts")
                }
            } catch (error) {
                console.error("Error finding contract:", error)
                setError("An error occurred while loading payment page")
            } finally {
                setLoading(false)
            }
        }

        findContractAndRedirect()
    }, [proposalId, user, router])

    if (loading || !user) {
        return <LoadingSpinner />
    }

    if (error) {
        return (
            <PageContainer>
                <div className="max-w-2xl mx-auto">
                    <Card className="text-center py-12">
                        <AlertCircle className="w-20 h-20 text-yellow-400 mx-auto mb-6" />
                        <h2 className="text-2xl font-bold mb-4">Payment Not Available</h2>
                        <p className="text-gray-400 mb-8 max-w-md mx-auto">{error}</p>
                        <Button
                            variant="secondary"
                            onClick={() => router.push(`/proposals/${proposalId}`)}
                            icon={ArrowLeft}
                            iconPosition="left"
                        >
                            Back to Proposal
                        </Button>
                    </Card>
                </div>
            </PageContainer>
        )
    }

    return <LoadingSpinner />
}
