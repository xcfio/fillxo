import { main } from "../.."
import AcceptProposal from "./accept"
import DeleteProposal from "./delete-proposal"
import EditProposal from "./edit-proposal"
import GetProposalID from "./get-proposal-id"
import GetProposalReceived from "./get-proposal-received"
import GetProposalSent from "./get-proposal-sent"
import PostProposal from "./post-proposal"
import RejectProposal from "./reject"

export default function Proposals(fastify: Awaited<ReturnType<typeof main>>) {
    AcceptProposal(fastify)
    DeleteProposal(fastify)
    EditProposal(fastify)
    GetProposalID(fastify)
    GetProposalReceived(fastify)
    GetProposalSent(fastify)
    PostProposal(fastify)
    RejectProposal(fastify)
}
