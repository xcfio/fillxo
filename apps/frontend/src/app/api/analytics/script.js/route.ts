export async function GET() {
    try {
        const response = await fetch("https://cloud.umami.is/script.js")
        const script = await response.text()

        return new Response(script, {
            headers: {
                "Content-Type": "application/javascript",
                "Cache-Control": "public, max-age=3600"
            }
        })
    } catch (error) {
        return new Response('console.error("Failed to load Umami")', {
            status: 500,
            headers: { "Content-Type": "application/javascript" }
        })
    }
}
