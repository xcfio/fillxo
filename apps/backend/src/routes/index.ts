import { main } from "../"
import Notifications from "./notifications"
import Proposals from "./proposals"
import Contract from "./contracts"
import Payment from "./payment"
import Reviews from "./reviews"
import Search from "./search"
import User from "./user"
import Auth from "./auth"
import Job from "./job"

export default function Routes(fastify: Awaited<ReturnType<typeof main>>) {
    Notifications(fastify)
    Proposals(fastify)
    Contract(fastify)
    Payment(fastify)
    Reviews(fastify)
    Search(fastify)
    User(fastify)
    Auth(fastify)
    Job(fastify)
}
