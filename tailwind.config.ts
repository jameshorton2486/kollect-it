
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Guardian-EgypT', 'serif'],
        display: ['Guardian-EgypT', 'serif'],
      },
      fontSize: {
        'display': ['4rem', { lineHeight: '1.2' }],
        'h1': ['2.5rem', { lineHeight: '1.3' }],
        'h2': ['2rem', { lineHeight: '1.4' }],
        'h3': ['1.5rem', { lineHeight: '1.5' }],
        'body': ['1rem', { lineHeight: '1.6' }],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#27455D", // Dark Blue
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#497D74", // Muted Teal
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#71BBB2", // Light Teal
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#EFE9D5", // Light Beige
          foreground: "#27455D",
        },
        nav: {
          DEFAULT: "#FFFFFF",
        },
        shop: {
          50: "#EFE9D5",  // Light Beige (Background)
          100: "#E5DFC7", // Lighter Beige
          200: "#71BBB2", // Light Teal (Accent)
          300: "#497D74", // Muted Teal (Secondary)
          400: "#27455D", // Dark Blue (Primary)
          500: "#27455D", // Primary for actions
          600: "#1E3447", // Darker Blue
          700: "#27455D", // Dark Blue
          800: "#1E3447", // Darker shade
          900: "#152532", // Darkest shade
          accent1: "#71BBB2", // Light Teal
          accent2: "#497D74", // Muted Teal
          accent3: "#FFFFFF", // White
          muted1: "#EFE9D5", // Light Beige
          muted2: "#E5DFC7", // Lighter Beige
        },
      },
      spacing: {
        section: "40px",
        header: "40px",
        button: "12px",
      },
      borderRadius: {
        lg: "24px",
        md: "12px",
        sm: "6px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

