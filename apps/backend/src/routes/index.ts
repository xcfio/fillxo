import { main } from "../"
import Auth from "./auth"
import Job from "./job"
import Proposals from "./proposals"
import Reviews from "./reviews"
import User from "./user"

export default function Routes(fastify: Awaited<ReturnType<typeof main>>) {
    Auth(fastify)
    Job(fastify)
    Proposals(fastify)
    Reviews(fastify)
    User(fastify)
}
