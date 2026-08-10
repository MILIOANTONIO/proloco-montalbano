/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Palette verde oliva ispirata agli ulivi dei Nebrodi.
        brand: {
          50: "#F3F5EA",
          100: "#E4E8CE",
          200: "#C7D19C",
          300: "#A6B86D",
          400: "#839645",
          500: "#66792F",
          600: "#556B2F",
          700: "#435423",
          800: "#333F1A",
          900: "#212912",
        },
        olive: {
          400: "#D9A441",
          500: "#C4872A",
          600: "#A66D1E",
        },
        cream: "#F6F4EF",
        ink: "#16241C",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 8px 30px -12px rgba(13, 36, 24, 0.2)",
      },
    },
  },
  plugins: [],
};
