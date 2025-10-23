export async function POST(request: Request) {
    try {
        const body = await request.json()

        const response = await fetch("https://cloud.umami.is/api/send", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "User-Agent": request.headers.get("user-agent") || ""
            },
            body: JSON.stringify(body)
        })

        const data = await response.text()

        return new Response(data, {
            status: response.status,
            headers: {
                "Content-Type": "application/json"
            }
        })
    } catch (error) {
        return new Response(JSON.stringify({ error: "Failed to send event" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        })
    }
}
