import type { Metadata } from "next"
import { Comfortaa, Cascadia_Code } from "next/font/google"
import "./globals.css"

const comfortaa = Comfortaa({
    subsets: ["latin"],
    weight: ["300", "400", "700"],
    variable: "--font-comfortaa"
})

const cascadiaCode = Cascadia_Code({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-cascadia-code"
})

export const metadata: Metadata = {
    title: "fillxo",
    description: "A full-stack freelance marketplace for Bangladesh"
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <head>
                {process.env.NODE_ENV !== "development" && (
                    <script
                        defer
                        src="https://cool-xcfio.vercel.app/script.js"
                        data-website-id="5d7500cf-968b-4930-b0e3-f7717cc0cbf0"
                    ></script>
                )}
            </head>
            <body className={`antialiased ${comfortaa.variable} ${cascadiaCode.variable}`}>{children}</body>
        </html>
    )
}

