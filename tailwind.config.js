/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0f0f12",
        surface: "#18181f",
        elev: "#20202a",
        accent: "#6c47ff",
        "accent-soft": "#8b6dff",
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
