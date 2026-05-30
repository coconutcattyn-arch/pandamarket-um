import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        panda: {
          ink: "#2B2B2B",
          muted: "#6B7280",
          leaf: "#A3771C",
          mint: "#FFF4CF",
          lime: "#E9B949",
          paper: "#FFFDF7",
          line: "#F1E7C6"
        }
      },
      boxShadow: {
        soft: "0 18px 44px rgba(86, 66, 23, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
