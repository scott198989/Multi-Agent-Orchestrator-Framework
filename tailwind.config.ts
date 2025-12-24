import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        conductor: {
          DEFAULT: "#6366f1",
          light: "#818cf8",
          dark: "#4f46e5",
        },
        controls: {
          DEFAULT: "#f59e0b",
          light: "#fbbf24",
          dark: "#d97706",
        },
        process: {
          DEFAULT: "#10b981",
          light: "#34d399",
          dark: "#059669",
        },
        systems: {
          DEFAULT: "#8b5cf6",
          light: "#a78bfa",
          dark: "#7c3aed",
        },
        pragmatist: {
          DEFAULT: "#ef4444",
          light: "#f87171",
          dark: "#dc2626",
        },
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 8s linear infinite",
        "flow": "flow 2s ease-in-out infinite",
        "thinking": "thinking 1.5s ease-in-out infinite",
      },
      keyframes: {
        flow: {
          "0%, 100%": { strokeDashoffset: "0" },
          "50%": { strokeDashoffset: "20" },
        },
        thinking: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
