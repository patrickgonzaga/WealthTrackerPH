import type { Config } from "tailwindcss";

export default {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                card: "var(--card)",
                "card-foreground": "var(--card-foreground)",
                popover: "var(--popover)",
                "popover-foreground": "var(--popover-foreground)",
                primary: "var(--primary)",
                "primary-foreground": "var(--primary-foreground)",
                secondary: "var(--secondary)",
                "secondary-foreground": "var(--secondary-foreground)",
                muted: "var(--muted)",
                "muted-foreground": "var(--muted-foreground)",
                accent: "var(--accent)",
                "accent-foreground": "var(--accent-foreground)",
                positive: "var(--positive)",
                destructive: "var(--destructive)",
                "destructive-foreground": "var(--destructive-foreground)",
                border: "var(--border)",
                input: "var(--input)",
                ring: "var(--ring)",
                obsidian: "#080c14",
                "primary-accent": "#7c6fff",
                negative: "#ff6b6b",
            },
            fontFamily: {
                display: ["var(--font-dm-serif-display)", "serif"],
                mono: ["var(--font-space-mono)", "monospace"],
            },
        },
    },
    plugins: [],
} satisfies Config;
