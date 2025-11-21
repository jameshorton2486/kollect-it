import type { Config } from "tailwindcss";

/* ============================================
   KOLLECT-IT TAILWIND CONFIGURATION
   Synced with globals.css CSS variables
   Full color scales for complete design flexibility
   ============================================ */

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Ink - Text Colors (Complete Scale) */
        ink: {
          400: "hsl(var(--ink-400))",
          500: "hsl(var(--ink-500))",
          600: "hsl(var(--ink-600))",
          700: "hsl(var(--ink-700))",
          800: "hsl(var(--ink-800))",
          900: "hsl(var(--ink-900))",
          DEFAULT: "hsl(var(--ink-900))", // Fallback
        },
        
        /* Gold - Brand Accent (Complete Scale) */
        gold: {
          300: "hsl(var(--gold-300))",
          400: "hsl(var(--gold-400))",
          500: "hsl(var(--gold-500))",
          600: "hsl(var(--gold-600))",
          700: "hsl(var(--gold-700))",
          DEFAULT: "hsl(var(--gold-500))", // Fallback
        },
        
        /* Surface - Backgrounds (Complete Scale) */
        surface: {
          0: "hsl(var(--surface-0))",
          50: "hsl(var(--surface-50))",
          100: "hsl(var(--surface-100))",
          200: "hsl(var(--surface-200))",
          300: "hsl(var(--surface-300))",
          800: "hsl(var(--surface-800))",
          900: "hsl(var(--surface-900))",
          DEFAULT: "hsl(var(--surface-0))", // Fallback
        },
        
        /* CTA - Call to Action Navy (Complete Scale) */
        cta: {
          400: "hsl(var(--cta-400))",
          500: "hsl(var(--cta-500))",
          600: "hsl(var(--cta-600))",
          700: "hsl(var(--cta-700))",
          800: "hsl(var(--cta-800))",
          DEFAULT: "hsl(var(--cta-600))", // Fallback
        },
        
        /* Semantic Colors */
        semantic: {
          error: {
            500: "hsl(var(--semantic-error-500))",
          },
          success: {
            500: "hsl(var(--semantic-success-500))",
          },
          warning: {
            500: "hsl(var(--semantic-warning-500))",
          },
          info: {
            500: "hsl(var(--semantic-info-500))",
          },
        },
        
        /* Borders & Dividers */
        border: {
          200: "hsl(var(--border-200))",
          300: "hsl(var(--border-300))",
          DEFAULT: "hsl(var(--border-300))", // Fallback
        },

        /* shadcn/ui compatibility */
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "'Times New Roman'", "serif"],
        logo: ["var(--font-logo)", "system-ui", "sans-serif"],
      },
      
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        full: "var(--radius-full)",
        DEFAULT: "var(--radius)", // Fallback
      },
      
      spacing: {
        xs: "var(--spacing-xs)",
        sm: "var(--spacing-sm)",
        md: "var(--spacing-md)",
        lg: "var(--spacing-lg)",
        xl: "var(--spacing-xl)",
        "2xl": "var(--spacing-2xl)",
        "3xl": "var(--spacing-3xl)",
      },
      
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
      },
      
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.6s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
