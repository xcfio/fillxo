import { main } from "../../"
import GetContractId from "./get-contract-id"
import PostContract from "./post-contract"
import GetContract from "./get-contract"
import Complete from "./complete"
import Reject from "./reject"

export default function Contract(fastify: Awaited<ReturnType<typeof main>>) {
    GetContractId(fastify)
    PostContract(fastify)
    GetContract(fastify)
    Complete(fastify)
    Reject(fastify)
}
