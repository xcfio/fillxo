"use client"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { FileText } from "lucide-react"

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-linear-to-br from-gray-950 via-blue-950 to-gray-950 text-white flex flex-col">
            <Navbar />

            <main className="flex-1 pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-3 mb-6">
                        <FileText className="w-8 h-8 text-blue-400" />
                        <h1 className="text-4xl md:text-5xl font-bold">Terms of Service</h1>
                    </div>
                    <p className="text-gray-400 mb-8">Last updated: October 29, 2025</p>

                    <div className="bg-gray-900/50 border border-blue-900/30 rounded-2xl p-8 backdrop-blur-sm space-y-8">
                        <section>
                            <h2 className="text-2xl font-bold mb-4 text-blue-400">1. Agreement to Terms</h2>
                            <p className="text-gray-300 leading-relaxed">
                                By accessing or using fillxo, you agree to be bound by these Terms of Service and all
                                applicable laws and regulations. If you do not agree with any of these terms, you are
                                prohibited from using or accessing this site.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4 text-blue-400">2. User Accounts</h2>
                            <p className="text-gray-300 leading-relaxed mb-3">
                                When you create an account with us, you must provide accurate, complete, and current
                                information at all times. Failure to do so constitutes a breach of the Terms.
                            </p>
                            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                                <li>You are responsible for safeguarding your password</li>
                                <li>You must be at least 18 years old to use this service</li>
                                <li>One person or legal entity may maintain no more than one account</li>
                                <li>You may not use your account for any illegal or unauthorized purpose</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4 text-blue-400">3. User Content</h2>
                            <p className="text-gray-300 leading-relaxed mb-3">
                                Our service allows you to post, link, store, share and otherwise make available certain
                                information, text, graphics, or other material. You are responsible for the content you
                                post on fillxo.
                            </p>
                            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                                <li>You retain all rights to your content</li>
                                <li>You grant fillxo a license to use, display, and distribute your content</li>
                                <li>You must not post content that violates any laws or third-party rights</li>
                                <li>We reserve the right to remove content that violates these terms</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4 text-blue-400">
                                4. Freelancer and Client Obligations
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-xl font-semibold mb-2 text-white">For Freelancers:</h3>
                                    <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                                        <li>Deliver work as described in project agreements</li>
                                        <li>Communicate professionally and promptly with clients</li>
                                        <li>Accurately represent your skills and experience</li>
                                        <li>Meet agreed-upon deadlines and quality standards</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2 text-white">For Clients:</h3>
                                    <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                                        <li>Provide clear project requirements and expectations</li>
                                        <li>Pay freelancers promptly according to agreements</li>
                                        <li>Communicate professionally and respectfully</li>
                                        <li>Provide timely feedback and approve completed work</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4 text-blue-400">5. Payments and Fees</h2>
                            <p className="text-gray-300 leading-relaxed mb-3">
                                fillxo may charge service fees for using our platform. All fees are subject to change
                                with prior notice.
                            </p>
                            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                                <li>Platform fees will be clearly displayed before transactions</li>
                                <li>Payments are processed through secure third-party providers</li>
                                <li>Refund policies apply as specified in individual agreements</li>
                                <li>Disputes must be reported within 14 days of transaction</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4 text-blue-400">6. Prohibited Activities</h2>
                            <p className="text-gray-300 leading-relaxed mb-3">You may not:</p>
                            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                                <li>Use the platform for any illegal purpose</li>
                                <li>Harass, abuse, or harm other users</li>
                                <li>Impersonate another person or entity</li>
                                <li>Attempt to bypass payment systems</li>
                                <li>Use automated systems to access the platform</li>
                                <li>Collect or store personal data of other users</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4 text-blue-400">7. Intellectual Property</h2>
                            <p className="text-gray-300 leading-relaxed">
                                The platform and its original content, features, and functionality are owned by fillxo
                                and are protected by international copyright, trademark, patent, trade secret, and other
                                intellectual property laws.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4 text-blue-400">8. Dispute Resolution</h2>
                            <p className="text-gray-300 leading-relaxed mb-3">
                                In the event of a dispute between users, fillxo will provide mediation services.
                                However:
                            </p>
                            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                                <li>fillxo is not responsible for disputes between users</li>
                                <li>Users are encouraged to resolve disputes amicably</li>
                                <li>fillxo reserves the right to suspend accounts during investigations</li>
                                <li>Legal jurisdiction is Bangladesh</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4 text-blue-400">9. Limitation of Liability</h2>
                            <p className="text-gray-300 leading-relaxed">
                                fillxo shall not be liable for any indirect, incidental, special, consequential, or
                                punitive damages resulting from your use or inability to use the service. We do not
                                guarantee the quality of work performed by freelancers or the behavior of clients.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4 text-blue-400">10. Termination</h2>
                            <p className="text-gray-300 leading-relaxed">
                                We may terminate or suspend your account immediately, without prior notice, for any
                                breach of these Terms. Upon termination, your right to use the service will cease
                                immediately.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4 text-blue-400">11. Changes to Terms</h2>
                            <p className="text-gray-300 leading-relaxed">
                                We reserve the right to modify these terms at any time. We will notify users of any
                                changes by posting the new Terms of Service on this page and updating the "Last updated"
                                date.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4 text-blue-400">12. Contact Us</h2>
                            <p className="text-gray-300 leading-relaxed">
                                If you have any questions about these Terms, please contact us at:
                            </p>
                            <p className="text-blue-400 mt-2">support@fillxo.com</p>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
