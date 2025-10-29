"use client"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Shield } from "lucide-react"

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-linear-to-br from-gray-950 via-blue-950 to-gray-950 text-white flex flex-col">
            <Navbar />

            <main className="flex-1 pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-3 mb-6">
                        <Shield className="w-8 h-8 text-blue-400" />
                        <h1 className="text-4xl md:text-5xl font-bold">Privacy Policy</h1>
                    </div>
                    <p className="text-gray-400 mb-8">Last updated: October 29, 2025</p>

                    <div className="bg-gray-900/50 border border-blue-900/30 rounded-2xl p-8 backdrop-blur-sm space-y-8">
                        <section>
                            <h2 className="text-2xl font-bold mb-4 text-blue-400">1. Introduction</h2>
                            <p className="text-gray-300 leading-relaxed">
                                fillxo ("we", "our", or "us") is committed to protecting your privacy. This Privacy
                                Policy explains how we collect, use, disclose, and safeguard your information when you
                                use our platform. Please read this privacy policy carefully.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4 text-blue-400">2. Information We Collect</h2>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-xl font-semibold mb-2 text-white">Personal Information</h3>
                                    <p className="text-gray-300 leading-relaxed mb-2">
                                        We collect information that you provide directly to us:
                                    </p>
                                    <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                                        <li>Name and contact information (email address, phone number)</li>
                                        <li>Username and password</li>
                                        <li>Profile information (bio, skills, portfolio)</li>
                                        <li>Payment information (processed securely through third-party providers)</li>
                                        <li>Communication data (messages, support tickets)</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2 text-white">
                                        Automatically Collected Information
                                    </h3>
                                    <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                                        <li>IP address and browser type</li>
                                        <li>Device information and operating system</li>
                                        <li>Usage data and analytics</li>
                                        <li>Cookies and similar tracking technologies</li>
                                        <li>Location data (with your permission)</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4 text-blue-400">3. How We Use Your Information</h2>
                            <p className="text-gray-300 leading-relaxed mb-3">We use the information we collect to:</p>
                            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                                <li>Provide, maintain, and improve our services</li>
                                <li>Process transactions and send related information</li>
                                <li>Send you technical notices, updates, and support messages</li>
                                <li>Respond to your comments and questions</li>
                                <li>Detect, prevent, and address fraud and security issues</li>
                                <li>Monitor and analyze trends, usage, and activities</li>
                                <li>Personalize your experience on our platform</li>
                                <li>Send promotional communications (with your consent)</li>
                                <li>Comply with legal obligations</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4 text-blue-400">4. How We Share Your Information</h2>
                            <p className="text-gray-300 leading-relaxed mb-3">
                                We may share your information in the following circumstances:
                            </p>
                            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                                <li>
                                    <strong className="text-white">With other users:</strong> Your profile information
                                    is visible to other users to facilitate connections
                                </li>
                                <li>
                                    <strong className="text-white">With service providers:</strong> Third-party vendors
                                    who perform services on our behalf (payment processing, analytics)
                                </li>
                                <li>
                                    <strong className="text-white">For legal reasons:</strong> When required by law or
                                    to protect our rights
                                </li>
                                <li>
                                    <strong className="text-white">With your consent:</strong> When you explicitly agree
                                    to share your information
                                </li>
                                <li>
                                    <strong className="text-white">Business transfers:</strong> In connection with a
                                    merger, sale, or acquisition
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4 text-blue-400">5. Data Security</h2>
                            <p className="text-gray-300 leading-relaxed mb-3">
                                We implement appropriate technical and organizational measures to protect your personal
                                information:
                            </p>
                            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                                <li>Encryption of data in transit and at rest</li>
                                <li>Regular security assessments and updates</li>
                                <li>Access controls and authentication measures</li>
                                <li>Secure payment processing through certified providers</li>
                                <li>Employee training on data protection</li>
                            </ul>
                            <p className="text-gray-300 leading-relaxed mt-3">
                                However, no method of transmission over the Internet is 100% secure. While we strive to
                                protect your information, we cannot guarantee absolute security.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4 text-blue-400">6. Your Privacy Rights</h2>
                            <p className="text-gray-300 leading-relaxed mb-3">You have the right to:</p>
                            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                                <li>
                                    <strong className="text-white">Access:</strong> Request a copy of your personal data
                                </li>
                                <li>
                                    <strong className="text-white">Correction:</strong> Update or correct your
                                    information
                                </li>
                                <li>
                                    <strong className="text-white">Deletion:</strong> Request deletion of your account
                                    and data
                                </li>
                                <li>
                                    <strong className="text-white">Portability:</strong> Receive your data in a
                                    structured format
                                </li>
                                <li>
                                    <strong className="text-white">Opt-out:</strong> Unsubscribe from marketing
                                    communications
                                </li>
                                <li>
                                    <strong className="text-white">Object:</strong> Object to processing of your data
                                </li>
                            </ul>
                            <p className="text-gray-300 leading-relaxed mt-3">
                                To exercise these rights, please contact us at privacy@fillxo.com
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4 text-blue-400">7. Cookies and Tracking</h2>
                            <p className="text-gray-300 leading-relaxed mb-3">
                                We use cookies and similar tracking technologies to:
                            </p>
                            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                                <li>Remember your preferences and settings</li>
                                <li>Analyze site traffic and usage patterns</li>
                                <li>Improve user experience and site performance</li>
                                <li>Provide personalized content and recommendations</li>
                            </ul>
                            <p className="text-gray-300 leading-relaxed mt-3">
                                You can control cookies through your browser settings. However, disabling cookies may
                                affect site functionality.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4 text-blue-400">8. Data Retention</h2>
                            <p className="text-gray-300 leading-relaxed">
                                We retain your personal information for as long as necessary to provide our services and
                                comply with legal obligations. When you delete your account, we will delete or anonymize
                                your information within 30 days, except where we are required to retain it for legal
                                purposes.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4 text-blue-400">9. Third-Party Links</h2>
                            <p className="text-gray-300 leading-relaxed">
                                Our platform may contain links to third-party websites. We are not responsible for the
                                privacy practices of these external sites. We encourage you to review their privacy
                                policies before providing any personal information.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4 text-blue-400">10. Children's Privacy</h2>
                            <p className="text-gray-300 leading-relaxed">
                                Our service is not intended for users under 18 years of age. We do not knowingly collect
                                personal information from children. If you believe we have collected information from a
                                child, please contact us immediately.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4 text-blue-400">11. International Data Transfers</h2>
                            <p className="text-gray-300 leading-relaxed">
                                Your information may be transferred to and processed in countries other than Bangladesh.
                                We ensure appropriate safeguards are in place to protect your data in accordance with
                                this privacy policy.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4 text-blue-400">
                                12. Changes to This Privacy Policy
                            </h2>
                            <p className="text-gray-300 leading-relaxed">
                                We may update this Privacy Policy from time to time. We will notify you of any changes
                                by posting the new Privacy Policy on this page and updating the "Last updated" date.
                                Your continued use of the platform after changes constitutes acceptance of the updated
                                policy.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4 text-blue-400">13. Contact Us</h2>
                            <p className="text-gray-300 leading-relaxed mb-3">
                                If you have any questions about this Privacy Policy or our data practices, please
                                contact us:
                            </p>
                            <div className="text-gray-300 space-y-1">
                                <p>
                                    <strong className="text-white">Email:</strong>{" "}
                                    <span className="text-blue-400">privacy@fillxo.com</span>
                                </p>
                                <p>
                                    <strong className="text-white">Support:</strong>{" "}
                                    <span className="text-blue-400">support@fillxo.com</span>
                                </p>
                            </div>
                        </section>

                        <div className="bg-blue-900/30 border border-blue-700/50 rounded-xl p-6 mt-8">
                            <p className="text-gray-300 text-sm leading-relaxed">
                                <strong className="text-white">Your privacy matters to us.</strong> We are committed to
                                transparency in how we collect, use, and protect your personal information. If you have
                                any concerns, please don't hesitate to reach out to our privacy team.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
