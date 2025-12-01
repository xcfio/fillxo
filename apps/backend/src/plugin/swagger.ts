import Swagger from "@fastify/swagger"
import { version } from "../../package.json"
import { main } from "../"

export default async function swagger(fastify: Awaited<ReturnType<typeof main>>) {
    await fastify.register(Swagger, {
        hideUntagged: true,
        openapi: {
            openapi: "3.1.1",
            info: {
                title: "fillxo",
                description: "empty for now",
                version: version,
                license: {
                    name: "Proprietary",
                    url: "/license"
                },
                contact: {
                    email: "softwarexplus@gmail.com",
                    name: "Support Team",
                    url: "https://discord.com/invite/FaCCaFM74Q"
                },
                termsOfService: "/terms"
            },
            tags: [
                {
                    name: "Authentication",
                    description: "Authentication and authorization endpoints"
                },
                {
                    name: "User",
                    description: "User profile management endpoints"
                },
                {
                    name: "Job",
                    description: "Job posting and management endpoints"
                },
                {
                    name: "Message",
                    description: "Messaging and communication endpoints"
                },
                {
                    name: "Proposal",
                    description: "Job proposal submission and management endpoints"
                },
                {
                    name: "Contract",
                    description: "Contract management and completion endpoints"
                },
                {
                    name: "Review",
                    description: "Review and rating management endpoints"
                },
                {
                    name: "Notification",
                    description: "User notification endpoints"
                },
                {
                    name: "Search",
                    description: "Search functionality for freelancers and jobs"
                }
            ]
        }
    })
}
