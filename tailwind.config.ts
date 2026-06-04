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
        lumi: {
          white: "#FFFFFF",
          milk: "#FAFAF8",
          cream: "#F5F0EB",
          beige: "#EDE8E0",
          nude: "#E8D5C4",
          blush: "#F2C4C4",
          pink: "#E8A5A5",
          rose: "#D4848A",
          deeprose: "#B5636A",
          text: "#3D2B2B",
          muted: "#8C7B7B",
          border: "#E8E0D8",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Playfair Display", "Georgia", "serif"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        soft: "0 2px 20px rgba(61, 43, 43, 0.06)",
        card: "0 4px 30px rgba(61, 43, 43, 0.08)",
        hover: "0 8px 40px rgba(61, 43, 43, 0.12)",
        pink: "0 4px 20px rgba(212, 132, 138, 0.25)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
        "float": "float 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
