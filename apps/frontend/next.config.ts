import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    experimental: {
        optimizePackageImports: ["@mantine/core", "@mantine/hooks"]
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**"
            },
            {
                protocol: "http",
                hostname: "**"
            }
        ]
    }
}

export default nextConfig
