/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],

  theme: {
    fontFamily: {
      inter: ["Inter", "sans-serif"],
      sora: ["Sora", "sans-serif"],
      mono: ["Roboto Mono", "monospace"],
    },

    colors: {
      white: "#fff",
  black: "#000000",
  transparent: "#ffffff00",

  richblack: {
    5: "#F4F3FF",
    25: "#E6E4FF",
    50: "#D1CEFF",
    100: "#B9B5FF",
    200: "#A29CFF",
    300: "#8B83FF",
    400: "#736BFF",
    500: "#5C52FF",
    600: "#4A42E6",
    700: "#3A33B4",
    800: "#2A2483",
    900: "#14142B", // main dark bg
  },

  richblue: {
    5: "#F5F3FF",
    25: "#EDE9FE",
    50: "#DDD6FE",
    100: "#C4B5FD",
    200: "#A78BFA",
    300: "#8B5CF6",
    400: "#7C3AED",
    500: "#6D28D9", // primary purple
    600: "#5B21B6",
    700: "#4C1D95",
    800: "#3B0764",
    900: "#240046",
  },

  blue: {
    5: "#EEF2FF",
    25: "#E0E7FF",
    50: "#C7D2FE",
    100: "#A5B4FC",
    200: "#818CF8",
    300: "#6366F1",
    400: "#4F46E5",
    500: "#4338CA",
    600: "#3730A3",
    700: "#312E81",
    800: "#1E1B4B",
    900: "#0F0C29",
  },

  caribbeangreen: {
    5: "#E6FFFA",
    25: "#B2F5EA",
    50: "#81E6D9",
    100: "#4FD1C5",
    200: "#38B2AC",
    300: "#319795",
    400: "#2C7A7B",
    500: "#285E61",
    600: "#234E52",
    700: "#1D4044",
    800: "#153E3E",
    900: "#0D2B2B",
  },

  brown: {
    5: "#FFF7ED",
    25: "#FFEDD5",
    50: "#FED7AA",
    100: "#FDBA74",
    200: "#FB923C",
    300: "#F97316",
    400: "#EA580C",
    500: "#C2410C",
    600: "#9A3412",
    700: "#7C2D12",
    800: "#431407",
    900: "#1C0A00",
  },

  pink: {
    5: "#FDF2F8",
    25: "#FCE7F3",
    50: "#FBCFE8",
    100: "#F9A8D4",
    200: "#F472B6",
    300: "#EC4899",
    400: "#DB2777",
    500: "#BE185D",
    600: "#9D174D",
    700: "#831843",
    800: "#500724",
    900: "#2A0015",
  },

  yellow: {
    5: "#FAF5FF",
    25: "#F3E8FF",
    50: "#E9D5FF",
    100: "#D8B4FE",
    200: "#C084FC",
    300: "#A855F7",
    400: "#9333EA",
    500: "#7E22CE",
    600: "#6B21A8",
    700: "#581C87",
    800: "#3B0764",
    900: "#240046",
  },

  pureGrey: {
    5: "#F9FAFB",
    25: "#F3F4F6",
    50: "#E5E7EB",
    100: "#D1D5DB",
    200: "#9CA3AF",
    300: "#6B7280",
    400: "#4B5563",
    500: "#374151",
    600: "#1F2937",
    700: "#111827",
    800: "#0F172A",
    900: "#020617",
  },
    },

    extend: {
      maxWidth: {
        maxContent: "1260px",
        maxContentTab: "650px",
      },

      boxShadow: {
        glow: "0 0 12px rgba(255,255,255,0.15)",
        blueGlow: "0 0 20px rgba(37,99,235,0.35)",
      },
    },
  },

  plugins: [],
};