
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
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
        heading: ['Playfair Display', 'serif'],
      },
      fontSize: {
        'display': ['4rem', { lineHeight: '1.2', letterSpacing: '0.5px' }],
        'h1': ['3rem', { lineHeight: '1.3', letterSpacing: '0.5px' }],
        'h2': ['2.25rem', { lineHeight: '1.4', letterSpacing: '0.5px' }],
        'h3': ['1.75rem', { lineHeight: '1.5' }],
        'body': ['1.125rem', { lineHeight: '1.6' }],
        'button': ['1.125rem', { lineHeight: '1.5', fontWeight: '700' }],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#333333", // Charcoal Black
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#F5F5F5", // Soft Gray
          foreground: "#222222",
        },
        accent: {
          DEFAULT: "#C6A961", // Gold
          foreground: "#222222",
        },
        muted: {
          DEFAULT: "#FFFFFF", // Pure White
          foreground: "#555555",
        },
        shop: {
          50: "#FFFFFF",    // Pure White
          100: "#F5F5F5",   // Soft Gray
          200: "#EEEEEE",   // Light Gray
          300: "#DDDDDD",   // Border Gray
          400: "#555555",   // Muted Text
          500: "#333333",   // Charcoal Black
          600: "#222222",   // Dark Text
          700: "#1C2833",   // Deep Navy
          800: "#111111",   // Darker Text
          900: "#000000",   // Black
          accent1: "#C6A961", // Gold
          accent2: "#1C2833", // Deep Navy
          accent3: "#FFFFFF", // White
          muted1: "#F5F5F5", // Soft Gray
          muted2: "#EEEEEE", // Light Gray
        },
      },
      spacing: {
        section: "40px",
        header: "40px",
        button: "12px",
        panel: "20px",
      },
      borderRadius: {
        lg: "8px",
        md: "6px",
        sm: "4px",
      },
      boxShadow: {
        card: "0 2px 4px rgba(224, 224, 224, 0.3)",
        'card-hover': "0 4px 8px rgba(224, 224, 224, 0.4)",
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
