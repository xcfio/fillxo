import { main } from "../../"
import GetProposalReceived from "./get-proposal-received"
import GetProposalSent from "./get-proposal-sent"
import DeleteProposal from "./delete-proposal"
import GetProposalID from "./get-proposal-id"
import EditProposal from "./edit-proposal"
import PostProposal from "./post-proposal"
import AcceptProposal from "./accept"
import RejectProposal from "./reject"

export default function Proposals(fastify: Awaited<ReturnType<typeof main>>) {
    GetProposalReceived(fastify)
    GetProposalSent(fastify)
    AcceptProposal(fastify)
    RejectProposal(fastify)
    DeleteProposal(fastify)
    GetProposalID(fastify)
    PostProposal(fastify)
    EditProposal(fastify)
}
