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
        heading: ['Poppins', 'system-ui', 'sans-serif'],
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
          DEFAULT: "#000000", // Pure Black
          foreground: "#FFFFFF", // Crisp White
        },
        secondary: {
          DEFAULT: "#E0E0E0", // Cool Gray
          foreground: "#000000", // Pure Black
        },
        accent: {
          DEFAULT: "#008080", // Vibrant Teal
          foreground: "#FFFFFF", // Crisp White
        },
        muted: {
          DEFAULT: "#E0E0E0", // Cool Gray
          foreground: "#000000", // Pure Black
        },
        nav: {
          DEFAULT: "#000000", // Pure Black
        },
        shop: {
          50: "#F5F7F7",  // Lightest background
          100: "#E0E0E0", // Cool Gray
          200: "#CCCCCC", // Light Gray
          300: "#B3B3B3", // Medium Gray
          400: "#008080", // Vibrant Teal
          500: "#006666", // Darker Teal
          600: "#004C4C", // Darkest Teal
          700: "#000000", // Pure Black
          800: "#000000", // Pure Black
          900: "#000000", // Pure Black
          accent1: "#008080", // Vibrant Teal
          accent2: "#006666", // Darker Teal
          accent3: "#FFFFFF", // Crisp White
          muted1: "#E0E0E0", // Cool Gray
          muted2: "#CCCCCC", // Light Gray
        },
      },
      spacing: {
        section: "40px", // Consistent section spacing
        header: "40px", // Header spacing
        button: "12px", // Button padding
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