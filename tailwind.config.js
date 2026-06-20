/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}", "./site.config.ts"],
  theme: {
    extend: {
      colors: {
        bg: "#0f0f12",
        surface: "#18181f",
        elev: "#20202a",
        accent: "rgb(var(--accent) / <alpha-value>)",
        "accent-soft": "rgb(var(--accent-soft) / <alpha-value>)",
        like: "#ff4d6d",
        dim: "#a0a0ad",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
    },
  },
  plugins: [],
};
