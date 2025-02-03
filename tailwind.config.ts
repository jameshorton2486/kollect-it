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
          DEFAULT: "#156064", // Darker teal
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#D3D3D3", // Pale gray
          foreground: "#156064",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "#D8BCAB", // Cool beige
          foreground: "#156064",
        },
        accent: {
          DEFAULT: "#D4AF37", // Gold
          foreground: "#156064",
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#156064",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#156064",
        },
        nav: {
          DEFAULT: "#156064", // Darker teal
        },
        shop: {
          50: "#F5F7F7",  // Lightest background
          100: "#D3D3D3", // Pale gray
          200: "#C0C0C0", // Silver
          300: "#D8BCAB", // Cool beige
          400: "#D4AF37", // Gold
          500: "#156064", // Primary teal
          600: "#006C67", // Alternative teal
          700: "#5D2F27", // Chestnut brown
          800: "#0F4447", // Darker teal shade
          900: "#0A2D2F", // Darkest teal
          accent1: "#156064", // Primary teal
          accent2: "#D4AF37", // Gold
          accent3: "#FFFFFF", // White
          muted1: "#D3D3D3", // Pale gray
          muted2: "#C0C0C0", // Silver
        },
      },
      spacing: {
        section: "40px",
        header: "20px",
        button: "12px",
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