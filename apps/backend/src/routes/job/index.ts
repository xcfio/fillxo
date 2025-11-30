import { main } from "../../"
import GetJobWithID from "./get-job-id"
import DeleteJob from "./delete-job"
import UpdateJob from "./update-job"
import PostJob from "./post-job"
import GetJob from "./get-job"

export default function Job(fastify: Awaited<ReturnType<typeof main>>) {
    GetJobWithID(fastify)
    UpdateJob(fastify)
    DeleteJob(fastify)
    PostJob(fastify)
    GetJob(fastify)
}
