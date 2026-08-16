/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: "#0b0e11",
          card: "#181a20",
          cardHover: "#1e2329",
          border: "#2b2f36",
          accent: "#aeff00", // Electric Lime Green matching image 2
          accentHover: "#9df000",
          textPrimary: "#eaecef",
          textMuted: "#848e9c",
          up: "#0ecb81",
          down: "#f6465d",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
    },
  },
  plugins: [],
};
