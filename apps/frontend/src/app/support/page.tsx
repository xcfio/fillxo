"use client"

import { useRouter } from "next/navigation"
import { PageContainer } from "@/components/ui/page-container"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Mail, MessageCircle, HelpCircle, FileText } from "lucide-react"

const SUPPORT_EMAIL = "omarfaruksxp@gmail.com"

export default function SupportPage() {
    const router = useRouter()

    return (
        <PageContainer>
            <div className="max-w-3xl mx-auto">
                {/* Back Button */}
                <Button
                    variant="secondary"
                    onClick={() => router.push("/dashboard")}
                    icon={ArrowLeft}
                    iconPosition="left"
                    className="mb-6"
                >
                    Back to Dashboard
                </Button>

                {/* Header */}
                <div className="text-center mb-12">
                    <div className="w-20 h-20 bg-blue-600/20 border border-blue-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <HelpCircle className="w-10 h-10 text-blue-400" />
                    </div>
                    <h1 className="text-4xl font-bold mb-4">Support</h1>
                    <p className="text-gray-400 text-lg">Need help? We're here for you.</p>
                </div>

                {/* Contact Card */}
                <Card className="mb-6">
                    <div className="text-center">
                        <Mail className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Contact Us</h2>
                        <p className="text-gray-400 mb-6">
                            For any questions, issues, or feedback, please reach out to us via email. We typically
                            respond within 24-48 hours.
                        </p>
                        <a
                            href={`mailto:${SUPPORT_EMAIL}`}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-lg font-medium"
                        >
                            <Mail className="w-5 h-5" />
                            {SUPPORT_EMAIL}
                        </a>
                    </div>
                </Card>

                {/* Common Topics */}
                <Card>
                    <h2 className="text-xl font-bold mb-6">Common Topics</h2>
                    <div className="space-y-4">
                        <div className="flex items-start gap-4 p-4 bg-gray-900/50 border border-blue-900/20 rounded-lg">
                            <MessageCircle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-semibold mb-1">Payment Issues</h3>
                                <p className="text-gray-400 text-sm">
                                    Problems with payments, verification, or payouts? Include your User ID and Payment
                                    ID in your email.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 bg-gray-900/50 border border-blue-900/20 rounded-lg">
                            <FileText className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-semibold mb-1">Contract Disputes</h3>
                                <p className="text-gray-400 text-sm">
                                    Issues with a contract or need to request a refund? Provide your Contract ID and
                                    details.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 bg-gray-900/50 border border-blue-900/20 rounded-lg">
                            <HelpCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-semibold mb-1">Account Help</h3>
                                <p className="text-gray-400 text-sm">
                                    Can't access your account or need to update information? Let us know your username
                                    or email.
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Tips */}
                <div className="mt-6 p-4 bg-blue-900/20 border border-blue-700/30 rounded-lg">
                    <p className="text-sm text-gray-300">
                        <strong className="text-blue-400">Tip:</strong> For faster support, include relevant IDs (User
                        ID, Payment ID, Contract ID) in your email. You can find your User ID on your dashboard.
                    </p>
                </div>
            </div>
        </PageContainer>
    )
}
