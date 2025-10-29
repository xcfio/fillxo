import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Comfortaa } from "next/font/google"
import Script from "next/script"
import "./globals.css"

const comfortaa = Comfortaa({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    display: "swap"
})

export const metadata: Metadata = {
    title: "fillxo - Bangladesh's Freelance Marketplace",
    description:
        "Connect with top Bangladeshi freelancers or find your next project. A complete freelance marketplace with local payment methods, secure escrow, and dual language support. Built for Bangladesh.",
    icons: {
        icon: "/favicon.svg"
    },
    keywords: [
        "fillxo",
        "freelance Bangladesh",
        "Bangladeshi freelancers",
        "freelance marketplace",
        "hire talent Bangladesh",
        "remote work BD",
        "upwork alternative",
        "fiverr Bangladesh"
    ],
    authors: [{ name: "fillxo Team" }],
    openGraph: {
        title: "fillxo - Bangladesh's Freelance Marketplace",
        description:
            "Where talent meets opportunity. Connect with skilled Bangladeshi freelancers or find projects. Local payments, secure escrow, free to start.",
        url: "https://fillxo.vercel.app",
        siteName: "fillxo",
        locale: "en_BD",
        type: "website"
    },
    twitter: {
        card: "summary_large_image",
        title: "fillxo - Bangladesh's Freelance Marketplace",
        description:
            "Connect with top Bangladeshi talent or find projects. Local payments, secure escrow, free to start."
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true
        }
    },
    alternates: {
        canonical: "https://fillxo.vercel.app"
    }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
                <meta name="msapplication-TileColor" content="#4285f4" />
                <meta name="theme-color" content="#4285f4" />
                {process.env.NODE_ENV !== "development" && (
                    <Script
                        src="/api/analytics/script.js"
                        data-website-id="afd13f16-1202-42ba-8e3e-8b64335baf4f"
                        data-host-url="/api/analytics"
                        strategy="afterInteractive"
                    />
                )}
            </head>
            <body className={comfortaa.className}>
                {children}
                <Analytics />
            </body>
        </html>
    )
}
