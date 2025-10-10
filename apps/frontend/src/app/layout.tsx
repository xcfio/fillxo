// src/app/layout.tsx
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
            </head>
            <body className={comfortaa.className}>{children}</body>
        </html>
    )
}
