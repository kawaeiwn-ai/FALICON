import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: "#0B0F17",
        slate: {
          deep: "#111827",
          panel: "#161E2C",
        },
        champagne: {
          DEFAULT: "#D4AF37",
          soft: "#E4C766",
          dim: "#8A7128",
        },
        emerald: {
          gloss: "#1F9D6B",
          soft: "#3FBE8C",
        },
        ivory: "#EDEAE2",
        mute: "#8891A3",
        hairline: "rgba(255,255,255,0.08)",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      backgroundImage: {
        "radial-fade":
          "radial-gradient(circle at 15% 10%, rgba(212,175,55,0.10), transparent 45%)",
      },
    },
  },
  plugins: [],
};

export default config;
