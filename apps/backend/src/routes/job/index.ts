import { main } from "../.."
import DeleteJob from "./delete-job"
import GetJob from "./get-job"
import GetJobWithID from "./get-job-id"
import PostJob from "./post-job"
import UpdateJob from "./update-job"

export default function Job(fastify: Awaited<ReturnType<typeof main>>) {
    DeleteJob(fastify)
    GetJobWithID(fastify)
    GetJob(fastify)
    PostJob(fastify)
    UpdateJob(fastify)
}
