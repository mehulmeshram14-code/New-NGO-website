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
        // Deep Green (replaces brown #3c160f), Leaf Green #66873b, Saffron #fa9f19, Sun #f5d000
        earth: {
          DEFAULT: "#173F30", // Rich Deep Forest Green (replaced brown)
          dark: "#0E291F",
          light: "#235743",
          subtle: "#EDF5F1",
        },
        leaf: {
          DEFAULT: "#66873b", // Olive / Growth Green
          dark: "#4e6a2b",
          light: "#7ea349",
          subtle: "#f1f6ea",
        },
        saffron: {
          DEFAULT: "#fa9f19", // Warm Saffron / Amber Orange
          dark: "#db8406",
          light: "#fcb548",
          subtle: "#fef6e8",
        },
        sun: {
          DEFAULT: "#f5d000", // Bright Sun / Harvest Gold
          dark: "#caa900",
          light: "#f8dc38",
          subtle: "#fefce6",
        },
        rust: {
          DEFAULT: "#B83A24", // Warm Red / Rust for Donate Buttons
          dark: "#962B18",    // Deep Rich Rust
          light: "#D84F35",   // Vibrant Red-Rust Accent
          hover: "#A02F1B",   // Focused Hover Rust
          subtle: "#FDF2F0",  // Light Rust Tint
        },

        // Semantic aliases
        forest: {
          DEFAULT: "#66873b", // #66873b Leaf Green
          dark: "#173F30",    // #173F30 Deep Forest Green
          light: "#7ea349",
          subtle: "#f1f6ea",
        },
        deepgreen: "#173F30", // #173F30 Deep Forest Green
        gold: {
          DEFAULT: "#fa9f19", // #fa9f19 Saffron Warm Gold
          dark: "#db8406",
          light: "#f5d000",   // #f5d000 Sun Yellow
        },
        darkText: {
          DEFAULT: "#173F30", // Deep green primary text
          muted: "#3D5A4D",
          light: "#5B7A6D",
        },
        ivory: {
          DEFAULT: "#FAF7F0",
          light: "#FFFFFF",
          dark: "#F4EFE6",
        },
        cream: {
          DEFAULT: "#F4EFE4",
          light: "#FAF7F1",
          dark: "#EAE0D0",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "DM Serif Display", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        samarkan: ["'Samarkan'", "var(--font-serif)", "Georgia", "serif"],
      },
      boxShadow: {
        subtle: "0 4px 20px -2px rgba(23, 63, 48, 0.08)",
        card: "0 10px 30px -4px rgba(23, 63, 48, 0.10)",
        hover: "0 20px 40px -6px rgba(23, 63, 48, 0.16)",
      },
    },
  },
  plugins: [],
};

export default config;
