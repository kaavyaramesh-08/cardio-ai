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
        background: "var(--background)",
        foreground: "var(--foreground)",
        cardio: {
          primary: "#8FBF9F",
          "primary-hover": "#7CAE8E",
          light: "#EAF6EE",
          bg: "#F7FBF8",
          dark: "#1F3D2B",
          accent: "#B7DCC4",
          muted: "#4F6B58",
          subtle: "#718E7B",
          border: "#D3E8DA",
          card: "#FFFFFF",
          danger: "#C53030",
          warning: "#DD6B20",
          success: "#2F855A",
        },
      },
    },
  },
  plugins: [],
};
export default config;
