/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#4A90E2",
                secondary: "#E6F0FA",
                success: "#27AE60",
                "success-light": "#D4F4E2",
                "background-light": "#F8F9FA",
                "neutral-dark": "#1A1A1A",
                "neutral-muted": "#4A4A4A",
                error: "#E74C3C",
                background: "#F8F9FA",
                text: "#1A1A1A",
            },
            fontFamily: {
                display: ["Inter", "sans-serif"],
            },
        },
    },
    plugins: [],
};
