export default () => {
    const blockers = [
        ["Solo dev", "scaling a marketplace alone while maintaining quality isn't realistic"],
        ["Time", "college took priority. Shifted focus to other projects"],
        ["Legal", "Bangladesh marketplace regulations need proper legal structure I don't have"],
        ["Payments", "local gateway integrations are messy. Solo dev can't handle the support"]
    ]

    const built = [
        "Real escrow payment system",
        "Real-time chat with Socket.io",
        "Profile system with reviews",
        "Job matching logic",
        "Local payment methods",
        "Full deployment pipeline"
    ]

    return (
        <main
            id="main-content"
            className="min-h-screen bg-[#0f0f0f] text-[#e0e0e0] font-cascadia-code px-5 py-10"
            aria-label="fillxo project page"
        >
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-[#60a5fa] focus:text-[#0f0f0f] focus:px-4 focus:py-2 focus:rounded focus:text-sm focus:font-bold"
            >
                Skip to main content
            </a>

            <div className="max-w-4xl mx-auto">
                <header>
                    <h1 className="font-comfortaa text-[28px] font-bold tracking-[2px] text-white mb-2">fillxo</h1>

                    <p className="text-[#999] text-[13px] mt-5 mb-10" role="status" aria-live="polite">
                        <span className="sr-only">Project status: </span>Status: paused. Code: open source.
                    </p>
                </header>

                <article aria-labelledby="why-ended-heading">
                    <h2
                        id="why-ended-heading"
                        className="font-comfortaa text-[32px] mt-15 mb-5 text-white font-normal tracking-tight"
                    >
                        Why This Project Ended
                    </h2>

                    <p className="my-4 text-[#b0b0b0]">
                        I built fillxo as a full-stack freelance marketplace for Bangladesh. It was real. It worked.
                        People signed up on the wishlist. But I can&apos;t finish it alone, and that&apos;s okay.
                    </p>

                    <section aria-labelledby="blockers-heading">
                        <h3
                            id="blockers-heading"
                            className="font-comfortaa text-[20px] mt-10 mb-4 text-white font-normal"
                        >
                            The blockers
                        </h3>
                        <ul className="ml-5 my-4 text-[#b0b0b0] list-disc" aria-label="List of project blockers">
                            {blockers.map(([title, desc]) => (
                                <li key={title} className="my-3">
                                    <strong className="text-[#60a5fa]">{title}</strong>
                                    <span aria-hidden="true"> — </span>
                                    <span>{desc}</span>
                                </li>
                            ))}
                        </ul>
                        <p className="my-4 text-[#b0b0b0]">
                            These aren&apos;t excuses. They&apos;re constraints. Building taught me what&apos;s actually
                            required. Most people don&apos;t learn that without trying.
                        </p>
                    </section>

                    <section aria-labelledby="built-heading">
                        <h3 id="built-heading" className="font-comfortaa text-[20px] mt-10 mb-4 text-white font-normal">
                            What I built
                        </h3>
                        <ul className="ml-5 my-4 text-[#b0b0b0] list-disc" aria-label="Features built in fillxo">
                            {built.map((item) => (
                                <li key={item} className="my-3">
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <p className="my-4 text-[#b0b0b0]">
                            This isn&apos;t a dead project. It&apos;s a{" "}
                            <strong className="text-white">finished learning</strong>. The code is clean enough for
                            someone else to take it.
                        </p>
                    </section>

                    <aside
                        className="bg-[#1a1a1a] border-l-2 border-[#60a5fa] px-5 py-4 my-6 text-[#b0b0b0] text-[14px]"
                        aria-label="Open source notice"
                        role="note"
                    >
                        The repo is public. The code is open source. MIT licensed. If you want to fork this and make it
                        work, I&apos;ll be genuinely interested to see it happen.
                    </aside>

                    <section aria-labelledby="next-heading">
                        <h3 id="next-heading" className="font-comfortaa text-[20px] mt-10 mb-4 text-white font-normal">
                            What&apos;s next
                        </h3>
                        <p className="my-4 text-[#b0b0b0]">
                            I&apos;m focused on other projects and backend tooling. That&apos;s where my energy is.
                            Trying to split attention between projects and college doesn&apos;t work for me.
                        </p>
                        <p className="my-4 text-[#b0b0b0]">
                            But if someone wants to take fillxo forward? That would be cool to watch.
                        </p>
                    </section>

                    <nav aria-label="Project actions" className="flex flex-wrap gap-3 my-8">
                        <a
                            href="https://github.com/xcfio/fillxo"
                            className="inline-block border rounded-xl px-5 py-2.5 bg-[#60a5fa] text-[#0f0f0f] border-[#60a5fa] text-[13px] transition-all hover:bg-[#22d3ee] hover:border-[#22d3ee] focus:outline-none focus:ring-2 focus:ring-[#22d3ee] focus:ring-offset-2 focus:ring-offset-[#0f0f0f]"
                            rel="noopener noreferrer"
                            target="_blank"
                            aria-label="Fork the fillxo repo on GitHub (opens in new tab)"
                        >
                            Fork the repo
                            <span className="sr-only"> (opens in new tab)</span>
                        </a>
                    </nav>
                </article>

                <hr className="border-0 h-px bg-[#222] my-10" aria-hidden="true" />

                <section aria-labelledby="waitlist-heading">
                    <h2 id="waitlist-heading" className="font-comfortaa text-[20px] mt-10 mb-4 text-white font-normal">
                        For people on the waitlist
                    </h2>
                    <p className="my-4 text-[#b0b0b0]">
                        I sent an email. Check your inbox. It&apos;s honest about why this happened.
                    </p>
                    <p className="my-4 text-[#b0b0b0]">
                        If you still believe in this idea, the code is yours. Build it. Make it work. I genuinely want
                        to see what happens.
                    </p>
                </section>

                <footer
                    className="font-comfortaa mt-20 pt-10 border-t border-[#222] text-[#999] text-[0.875rem]"
                    role="contentinfo"
                >
                    <p>
                        Made with{" "}
                        <span aria-label="love" role="img">
                            ❤️
                        </span>{" "}
                        by{" "}
                        <a
                            href="https://github.com/xcfio"
                            className="font-comfortaa text-[#60a5fa] border-b border-dashed border-[#60a5fa] hover:text-[#22d3ee] hover:border-[#22d3ee] focus:outline-none focus:ring-1 focus:ring-[#22d3ee]"
                            rel="noopener noreferrer"
                            target="_blank"
                            aria-label="xcfio on GitHub (opens in new tab)"
                        >
                            xcfio
                        </a>
                    </p>
                </footer>
            </div>
        </main>
    )
}
