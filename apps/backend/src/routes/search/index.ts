import { main } from "../../"
import SearchUser from "./user"
import SearchJobs from "./jobs"

export default function Search(fastify: Awaited<ReturnType<typeof main>>) {
    SearchUser(fastify)
    SearchJobs(fastify)
}
