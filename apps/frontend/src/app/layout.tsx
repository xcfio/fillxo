// src/app/layout.tsx
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

import type { Metadata } from "next"
import { Comfortaa } from "next/font/google"

const comfortaa = Comfortaa({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    display: "swap"
})

export const metadata: Metadata = {
    title: "fillxo",
    description: "Real-time chat application with Next.js and Socket.IO",
    icons: {
        icon: "/favicon.svg"
    }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="icon" href="/favicon.ico" sizes="any" />
                <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
                <meta name="msapplication-TileColor" content="#4285f4" />
                <meta name="theme-color" content="#4285f4" />
                <script
                    defer
                    src="https://cloud.umami.is/script.js"
                    data-website-id="afd13f16-1202-42ba-8e3e-8b64335baf4f"
                ></script>
            </head>
            <body className={comfortaa.className}>
                {children}
                <Analytics />
            </body>
        </html>
    )
}
