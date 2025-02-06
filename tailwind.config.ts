
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
          DEFAULT: "#308cc0", // Blue
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#145da0", // Medium Blue
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#afd1de", // Light Blue
          foreground: "#0d2e49",
        },
        muted: {
          DEFAULT: "#fdfefe", // White
          foreground: "#0d2e49",
        },
        nav: {
          DEFAULT: "#0d2e49", // Dark Blue
        },
        shop: {
          50: "#fdfefe",  // White (Background)
          100: "#e6f1f6", // Lighter Blue
          200: "#afd1de", // Light Blue
          300: "#308cc0", // Blue
          400: "#145da0", // Medium Blue
          500: "#0d2e49", // Dark Blue
          600: "#0a2438", // Darker Blue
          700: "#071824", // Darkest Blue
          800: "#040f16",
          900: "#020709",
          accent1: "#308cc0", // Blue
          accent2: "#145da0", // Medium Blue
          accent3: "#FFFFFF", // White
          muted1: "#fdfefe", // White
          muted2: "#e6f1f6", // Lighter Blue
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
