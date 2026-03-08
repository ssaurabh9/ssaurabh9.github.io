import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        "text-primary": "var(--text-primary)",
        "text-muted": "var(--text-muted)",
        "text-ghost": "var(--text-ghost)",
        accent: "var(--accent)",
        border: "var(--border)",
        "chunk-bg": "var(--chunk-bg)",
      },
      fontFamily: {
        display: ["var(--font-dm-serif)", "serif"],
        mono: ["var(--font-dm-mono)", "monospace"],
        body: ["var(--font-dm-sans)", "sans-serif"],
      },
      maxWidth: {
        content: "1200px",
      },
      keyframes: {
        pulse_dot: {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.4)", opacity: "0.7" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        scanline: {
          "0%": { top: "0%" },
          "100%": { top: "100%" },
        },
        progress_fill: {
          "0%": { width: "0%" },
          "60%": { width: "80%" },
          "100%": { width: "100%" },
        },
        dash_draw: {
          to: { strokeDashoffset: "0" },
        },
      },
      animation: {
        pulse_dot: "pulse_dot 2s ease-in-out infinite",
        blink: "blink 1s step-end infinite",
        scanline: "scanline 2s ease-in-out infinite",
        progress_fill_80: "progress_fill 1.2s ease-out forwards",
        progress_fill_100: "progress_fill 1.6s ease-out forwards",
        dash_draw: "dash_draw 1s ease-out forwards",
      },
    },
  },
  plugins: [],
};
export default config;
