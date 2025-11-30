/**
 * Formats a cent amount into a USD currency string
 * Examples: 100000 -> "$1,000", 150000 -> "$1,500"
 */
export function formatBudget(cents: number): string {
    const digits = cents.toString().split("")
    const SecondFraction = digits.pop()
    const FirstFraction = digits.pop()
    const amount = `${digits.join("")}.${FirstFraction}${SecondFraction}`

    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(Number(amount))
}
