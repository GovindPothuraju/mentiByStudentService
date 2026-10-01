/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: "#FF9F1A",
          yellowHover: "#FFB33D",
          yellowLight: "#FFB33D",
          yellowSubtle: "#FFF7ED",
          yellowBorder: "#FFE3B8",
          dark: "#0A0908",
          darkBg: "#131110",
          surface: "#FFFFFF",
          surfaceHover: "#F7F4F0",
          border: "#E5E0D8",
          canvas: "#F7F4F0",
          textPrimary: "#0A0908",
          textSecondary: "#635D54",
          muted: "#9E978E",
          success: "#16A34A",
          successSubtle: "#F0FDF4",
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(10, 9, 8, 0.05), 0 1px 2px -1px rgba(10, 9, 8, 0.05)",
        cardHover: "0 10px 25px -5px rgba(10, 9, 8, 0.08), 0 8px 10px -6px rgba(10, 9, 8, 0.04)",
      },
    },
  },
  plugins: [],
}
