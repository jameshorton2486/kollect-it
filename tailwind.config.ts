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
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#2C5F2D",
          foreground: "#F5E1DA",
        },
        secondary: {
          DEFAULT: "#A88C60",
          foreground: "#2C5F2D",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "#F5E1DA",
          foreground: "#333333",
        },
        accent: {
          DEFAULT: "#A88C60",
          foreground: "#2C5F2D",
        },
        popover: {
          DEFAULT: "#F5E1DA",
          foreground: "#333333",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#333333",
        },
        shop: {
          50: "#F5E1DA",
          100: "#E8D1C8",
          200: "#D1B3A6",
          300: "#BA9584",
          400: "#A88C60",
          500: "#2C5F2D",
          600: "#255026",
          700: "#1E411E",
          800: "#173217",
          900: "#10230F",
          accent1: "#2C5F2D",
          accent2: "#A88C60",
          accent3: "#F5E1DA",
          muted1: "#F5E1DA",
          muted2: "#E8D1C8",
        },
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
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: ".5" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200%" },
          "100%": { backgroundPosition: "200%" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        fadeIn: "fadeIn 0.5s ease-out",
        slideIn: "slideIn 0.3s ease-out",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 2s linear infinite",
        scaleIn: "scaleIn 0.2s ease-out",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "shimmer": "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;