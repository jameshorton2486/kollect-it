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
          DEFAULT: "#1A365D", // Rich navy blue
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#4A5568", // Sophisticated gray
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#2B6CB0", // Professional blue
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#F7FAFC", // Light gray background
          foreground: "#1A365D",
        },
        nav: {
          DEFAULT: "#FFFFFF",
        },
        shop: {
          50: "#F7FAFC",  // Light background
          100: "#EDF2F7", // Border color
          200: "#E2E8F0", // Lighter text
          300: "#4A5568", // Secondary text
          400: "#1A365D", // Primary text
          500: "#2B6CB0", // Primary blue
          600: "#2C5282", // Darker blue
          700: "#1A365D", // Navy blue
          800: "#162A4F", // Dark navy
          900: "#1A202C", // Almost black
          accent1: "#2B6CB0", // Primary blue
          accent2: "#2C5282", // Darker blue
          accent3: "#FFFFFF", // White
          muted1: "#F7FAFC", // Light background
          muted2: "#EDF2F7", // Border color
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
