/**
 * Formats a cent amount into a USD currency string
 * Examples: 100000 -> "$1,000", 150000 -> "$1,500"
 */
export function formatBudget(cents: number): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(cents / 100)
}
