/** @type {import('tailwindcss').Config} */
const config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#FF9800", // Orange accent
                },
                secondary: {
                    DEFAULT: "#2196F3", // Blue
                },
                success: {
                    DEFAULT: "#4CAF50", // Green
                },
                background: {
                    DEFAULT: "#FFFFFF",
                },
                text: {
                    DEFAULT: "#333333",
                },
                ads: {
                    DEFAULT: "#0D47A1", // Dark blue for ads
                },
            },
        },
    },
    plugins: [],
};
export default config;
