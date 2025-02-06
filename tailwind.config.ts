
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
          DEFAULT: "#222222", // Etsy's primary text color
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#595959", // Etsy's secondary text color
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#F1641E", // Etsy's primary orange
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#F5F5F5", // Etsy's background gray
          foreground: "#222222",
        },
        nav: {
          DEFAULT: "#FFFFFF",
        },
        shop: {
          50: "#F5F5F1",  // Light background
          100: "#E5E5E5", // Border color
          200: "#D3D3D3", // Lighter text
          300: "#595959", // Secondary text
          400: "#222222", // Primary text
          500: "#F1641E", // Primary orange
          600: "#D35400", // Darker orange
          700: "#222222", // Black text
          800: "#000000", // Pure black
          900: "#111111", // Dark background
          accent1: "#F1641E", // Primary orange
          accent2: "#D35400", // Darker orange
          accent3: "#FFFFFF", // White
          muted1: "#F5F5F1", // Light background
          muted2: "#E5E5E5", // Border color
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
