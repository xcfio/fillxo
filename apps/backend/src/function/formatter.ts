import { isDate } from "node:util/types"

export function Bytes(bytes: number) {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    if (bytes === 0) return "0 Byte"
    const i = parseInt(String(Math.floor(Math.log(bytes) / Math.log(1024))), 10)
    return `${(bytes / 1024 ** i).toFixed(2)} ${sizes[i]}`
}

export function Time(date: number | Date = new Date(), tz = "BST", format = "en-UK") {
    const options: Intl.DateTimeFormatOptions = {
        timeZone: tz,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
    }
    return new Intl.DateTimeFormat(format, options).format(date).replace(",", "").toLocaleUpperCase()
}

export function HexToColor(arg: string | number | bigint | null | undefined): number | null {
    switch (typeof arg) {
        case "string": {
            if (!/^(#|0x)?[A-Fa-f0-9]{6}$/i.test(arg)) return null
            const number = parseInt(arg.replace(/^#|0x/, ""), 16)
            if (isNaN(number)) return null
            return Math.round(number)
        }

        case "number": {
            if (arg < 0x000000 || arg > 0xffffff) return null
            if (isNaN(arg)) return null
            return Math.round(arg)
        }

        case "bigint": {
            if (arg < 0x000000n || arg > 0xffffffn) return null
            return Number(arg)
        }

        default: {
            return null
        }
    }
}

export function ObjectString(arg: Record<string, any>, separator = "\n", ColorConvert?: boolean) {
    const StringArray: Array<string> = []

    for (const key in arg) {
        const ReadableKey = key.slice(0, 1).toUpperCase() + key.slice(1).replaceAll("_", " ")

        const value =
            ColorConvert && typeof arg[key] === "number"
                ? ColorFormatter(arg[key])
                : isDate(arg[key])
                  ? arg[key].toUTCString()
                  : arg[key]

        StringArray.push(`${ReadableKey}: ${value}`)
    }

    return StringArray.join(separator)
}

export function ColorFormatter(color: number | null | undefined): `#${string}` | null {
    if (color === null || color === undefined) return null
    return `#${color.toString(16).padStart(6, "0")}`
}
