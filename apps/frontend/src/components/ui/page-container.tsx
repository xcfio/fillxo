import { ReactNode } from "react"
import Navbar from "../navbar"
import Footer from "../footer"

interface PageContainerProps {
    children: ReactNode
    showNavbar?: boolean
    showFooter?: boolean
}

export function PageContainer({ children, showNavbar = true, showFooter = true }: PageContainerProps) {
    return (
        <div className="min-h-screen bg-linear-to-br from-gray-950 via-blue-950 to-gray-950 text-white">
            {showNavbar && <Navbar />}
            <main className="pt-30 px-6 pb-12">{children}</main>
            {showFooter && <Footer />}
        </div>
    )
}
