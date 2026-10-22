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
        uaf: {
          green: "#135835",
          emerald: "#0E6E3C",
          forest: "#093F23",
          darkgreen: "#072D19",
          navy: "#12345B",
          deep: "#0B2545",
          academic: "#1769AA",
          light: "#F4F7F6",
          surface: "#EAEFEF",
          gold: "#D4A017",
          amber: "#F59E0B",
          charcoal: "#1F2937",
          slate: "#334155",
        },
      },
      boxShadow: {
        neu: "8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff",
        "neu-sm": "4px 4px 8px #d6deeb, -4px -4px 8px #ffffff",
        "neu-inset": "inset 3px 3px 6px #d1d9e6, inset -3px -3px 6px #ffffff",
        "neu-pressed": "inset 4px 4px 8px #c8d2e0, inset -4px -4px 8px #ffffff",
        glass: "0 8px 32px 0 rgba(19, 88, 53, 0.08)",
        "glass-lg": "0 16px 40px 0 rgba(19, 88, 53, 0.12)",
        "glass-glow": "0 0 25px -5px rgba(14, 110, 60, 0.25)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};

export default config;
