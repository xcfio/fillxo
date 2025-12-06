import { main } from "../../"
import GetReviewUser from "./get-reviews-user-id"
import DeleteReview from "./delete-reviews"
import GetReviewId from "./get-reviews-id"
import PatchReview from "./patch-reviews"
import PostReview from "./post-reviews"

export default function Reviews(fastify: Awaited<ReturnType<typeof main>>) {
    GetReviewUser(fastify)
    DeleteReview(fastify)
    GetReviewId(fastify)
    PatchReview(fastify)
    PostReview(fastify)
}
