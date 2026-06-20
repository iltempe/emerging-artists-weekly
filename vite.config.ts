import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// `base` consente il deploy in sottocartella (es. GitHub Pages di progetto).
// Per dominio proprio / Vercel / Netlify lascia "/" (default).
export default defineConfig({
  base: process.env.VITE_BASE || "/",
  plugins: [react()],
  server: { port: 5173, host: true },
});
