"use client"

import { PageContainer } from "@/components/ui/page-container"
import { Heart, Code, Users, Globe, Package, ExternalLink, Github } from "lucide-react"

export default function AboutPage() {
    const libraries = {
        frontend: [
            {
                name: "Next.js",
                version: "16.x.x",
                description: "The React Framework for Production",
                url: "https://nextjs.org"
            },
            {
                name: "React",
                version: "19.x.x",
                description: "A JavaScript library for building user interfaces",
                url: "https://react.dev"
            },
            {
                name: "Tailwind CSS",
                version: "4.x.x",
                description: "A utility-first CSS framework",
                url: "https://tailwindcss.com"
            },
            {
                name: "Lucide React",
                version: "0.553.x",
                description: "Beautiful & consistent icon toolkit",
                url: "https://lucide.dev"
            },
            {
                name: "Socket.IO Client",
                version: "4.x.x",
                description: "Realtime application framework",
                url: "https://socket.io"
            },
            {
                name: "Vercel Analytics",
                version: "1.x.x",
                description: "Privacy-friendly analytics for Next.js",
                url: "https://vercel.com/analytics"
            }
        ],
        backend: [
            {
                name: "Fastify",
                version: "5.x.x",
                description: "Fast and low overhead web framework",
                url: "https://fastify.dev"
            },
            {
                name: "Drizzle ORM",
                version: "0.44.x",
                description: "TypeScript ORM for SQL databases",
                url: "https://orm.drizzle.team"
            },
            {
                name: "PostgreSQL (postgres.js)",
                version: "3.x.x",
                description: "PostgreSQL client for Node.js",
                url: "https://github.com/porsager/postgres"
            },
            {
                name: "TypeBox",
                version: "1.x.x",
                description: "JSON Schema Type Builder with Static Type Resolution",
                url: "https://github.com/sinclairzx81/typebox"
            },
            {
                name: "Fastify JWT",
                version: "10.x.x",
                description: "JWT authentication for Fastify",
                url: "https://github.com/fastify/fastify-jwt"
            },
            {
                name: "Fastify CORS",
                version: "11.x.x",
                description: "CORS plugin for Fastify",
                url: "https://github.com/fastify/fastify-cors"
            },
            {
                name: "Fastify Cookie",
                version: "11.x.x",
                description: "Cookie plugin for Fastify",
                url: "https://github.com/fastify/fastify-cookie"
            },
            {
                name: "Fastify Error",
                version: "4.x.x",
                description: "Error utilities for Fastify",
                url: "https://github.com/fastify/fastify-error"
            },
            {
                name: "Fastify Rate Limit",
                version: "10.x.x",
                description: "Rate limiting plugin for Fastify",
                url: "https://github.com/fastify/fastify-rate-limit"
            },
            {
                name: "Fastify Swagger",
                version: "9.x.x",
                description: "Swagger documentation generator for Fastify",
                url: "https://github.com/fastify/fastify-swagger"
            },
            {
                name: "Fastify Swagger UI",
                version: "5.x.x",
                description: "Swagger UI for Fastify",
                url: "https://github.com/fastify/fastify-swagger-ui"
            },
            {
                name: "Fastify Type Provider TypeBox",
                version: "6.x.x",
                description: "TypeBox type provider for Fastify",
                url: "https://github.com/fastify/fastify-type-provider-typebox"
            },
            {
                name: "Socket.IO",
                version: "4.x.x",
                description: "Realtime application framework (server)",
                url: "https://socket.io"
            },
            {
                name: "Fastify Socket.IO",
                version: "5.x.x",
                description: "Socket.IO plugin for Fastify",
                url: "https://github.com/alemagio/fastify-socket.io"
            },
            {
                name: "Snowtransfer",
                version: "0.15.x",
                description: "Discord API library for Node.js",
                url: "https://github.com/DasWolke/SnowTransfer"
            },
            {
                name: "Resend",
                version: "6.x.x",
                description: "Email API for developers",
                url: "https://resend.com"
            },
            {
                name: "TypeScript",
                version: "5.x.x",
                description: "TypeScript is JavaScript with syntax for types",
                url: "https://www.typescriptlang.org"
            },
            {
                name: "UUID",
                version: "13.x.x",
                description: "Generate RFC-compliant UUIDs",
                url: "https://github.com/uuidjs/uuid"
            }
        ],
        devTools: [
            {
                name: "Turbo",
                version: "2.x.x",
                description: "Incremental bundler and build system",
                url: "https://turbo.build"
            },
            {
                name: "PNPM",
                version: "10.x.x",
                description: "Fast, disk space efficient package manager",
                url: "https://pnpm.io"
            },
            {
                name: "Prettier",
                version: "3.x.x",
                description: "An opinionated code formatter",
                url: "https://prettier.io"
            },
            {
                name: "Drizzle Kit",
                version: "0.31.x",
                description: "CLI companion for Drizzle ORM",
                url: "https://orm.drizzle.team/kit-docs/overview"
            },
            {
                name: "Pino Pretty",
                version: "13.x.x",
                description: "Pretty logging for Pino",
                url: "https://github.com/pinojs/pino-pretty"
            }
        ]
    }

    const team = [
        {
            role: "Creator & Lead Developer",
            name: "Omar Faruk",
            description: "Full-stack developer passionate about building solutions for Bangladesh",
            github: "https://github.com/xcfio"
        }
    ]

    return (
        <PageContainer>
            <div className="max-w-6xl mx-auto px-6 py-12">
                {/* Hero Section */}
                <section className="text-center mb-20">
                    <div className="inline-block mb-6 px-4 py-2 bg-blue-900/30 border border-blue-700/50 rounded-full text-blue-300 text-sm">
                        About fillxo
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Built with <Heart className="inline-block text-red-500 w-12 h-12 mx-2" /> for Bangladesh
                    </h1>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                        fillxo is the ultimate freelance marketplace designed specifically for Bangladesh. We connect
                        talented freelancers with clients who need their skills, all within a platform that understands
                        local needs and culture.
                    </p>
                </section>

                {/* Mission Section */}
                <section className="mb-20 grid md:grid-cols-3 gap-8">
                    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 hover:border-blue-700/50 transition-all">
                        <Globe className="w-12 h-12 text-blue-400 mb-4" />
                        <h3 className="text-xl font-bold mb-3">Our Mission</h3>
                        <p className="text-gray-400 leading-relaxed">
                            To empower Bangladeshi freelancers and businesses by providing a trusted, efficient platform
                            for collaboration and growth.
                        </p>
                    </div>
                    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 hover:border-blue-700/50 transition-all">
                        <Users className="w-12 h-12 text-blue-400 mb-4" />
                        <h3 className="text-xl font-bold mb-3">For Everyone</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Whether you're a freelancer looking for opportunities or a client seeking talent, fillxo is
                            built to serve your needs.
                        </p>
                    </div>
                    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 hover:border-blue-700/50 transition-all">
                        <Code className="w-12 h-12 text-blue-400 mb-4" />
                        <h3 className="text-xl font-bold mb-3">Modern Tech</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Built with cutting-edge technologies to ensure a fast, reliable, and secure experience for
                            all users.
                        </p>
                    </div>
                </section>

                {/* Team Section */}
                <section className="mb-20">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                        Meet the <span className="text-blue-400">Team</span>
                    </h2>
                    <div className="max-w-2xl mx-auto">
                        {team.map((member, index) => (
                            <div
                                key={index}
                                className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 hover:border-blue-700/50 transition-all"
                            >
                                <h3 className="text-sm text-blue-400 font-semibold mb-2">{member.role}</h3>
                                <h4 className="text-2xl font-bold mb-3">{member.name}</h4>
                                <p className="text-gray-400 leading-relaxed mb-4">{member.description}</p>
                                {member.github && (
                                    <a
                                        href={member.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                                    >
                                        <Github className="w-4 h-4" />
                                        <span>View GitHub Profile</span>
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Open Source Credits */}
                <section className="mb-12">
                    <div className="text-center mb-12">
                        <Package className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Built with <span className="text-blue-400">Amazing Tools</span>
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            fillxo wouldn't be possible without these incredible open-source libraries and tools. We're
                            grateful to all the maintainers and contributors.
                        </p>
                    </div>

                    {/* Backend Libraries */}
                    <div className="mb-12">
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <Code className="w-6 h-6 text-blue-400" />
                            Backend Technologies
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            {libraries.backend.map((lib, index) => (
                                <a
                                    key={index}
                                    href={lib.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 hover:border-blue-700/50 transition-all group"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <h4 className="text-lg font-bold group-hover:text-blue-400 transition-colors">
                                            {lib.name}
                                        </h4>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
                                                v{lib.version}
                                            </span>
                                            <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors" />
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-400">{lib.description}</p>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Frontend Libraries */}
                    <div className="mb-12">
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <Code className="w-6 h-6 text-blue-400" />
                            Frontend Technologies
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            {libraries.frontend.map((lib, index) => (
                                <a
                                    key={index}
                                    href={lib.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 hover:border-blue-700/50 transition-all group"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <h4 className="text-lg font-bold group-hover:text-blue-400 transition-colors">
                                            {lib.name}
                                        </h4>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
                                                v{lib.version}
                                            </span>
                                            <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors" />
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-400">{lib.description}</p>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Development Tools */}
                    <div className="mb-12">
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <Code className="w-6 h-6 text-blue-400" />
                            Development Tools
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            {libraries.devTools.map((lib, index) => (
                                <a
                                    key={index}
                                    href={lib.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 hover:border-blue-700/50 transition-all group"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <h4 className="text-lg font-bold group-hover:text-blue-400 transition-colors">
                                            {lib.name}
                                        </h4>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
                                                v{lib.version}
                                            </span>
                                            <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors" />
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-400">{lib.description}</p>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Special Thanks */}
                    <div className="bg-linear-to-r from-blue-900/20 to-purple-900/20 border border-blue-700/30 rounded-xl p-8 text-center">
                        <Heart className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold mb-3">Special Thanks</h3>
                        <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
                            A huge thank you to all the open-source maintainers, contributors, and the developer
                            community. Your hard work makes projects like fillxo possible. We're standing on the
                            shoulders of giants.
                        </p>
                    </div>
                </section>

                {/* Contact Section */}
                <section className="text-center bg-gray-900/50 border border-gray-800 rounded-xl p-12">
                    <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
                    <p className="text-gray-400 mb-6">Have questions or feedback? We'd love to hear from you!</p>
                    <a
                        href="mailto:omarfaruksxp@gmail.com"
                        className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                    >
                        Contact Us
                    </a>
                </section>
            </div>
        </PageContainer>
    )
}
