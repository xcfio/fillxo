/** @type {import('tailwindcss').Config} */
export const content = [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
]
export const theme = {
    extend: {
        animation: {
            "fade-in-up": "fadeInUp 0.3s ease-out"
        }
    }
}

export const corePlugins = {
    preflight: false
}

export const plugins = {
    tailwindcss: {},
    autoprefixer: {}
}
