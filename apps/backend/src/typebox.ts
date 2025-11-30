import { Type } from "typebox"
import { v7 } from "uuid"

export const UUID = Type.String({
    examples: [v7()],
    pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$",
    description: "UUID Version 7"
})

export const amount = Type.Integer({
    minimum: 100,
    maximum: Number.MAX_SAFE_INTEGER,
    examples: [500, 1250],
    description: "Amount in cents (e.g., 50000 for $500.00)"
})
