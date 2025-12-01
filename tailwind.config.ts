import type { Config } from "tailwindcss";

/* ============================================
   KOLLECT-IT TAILWIND CONFIGURATION
   Updated with Luxury Color Palette
   Synced with globals.css CSS variables
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
        /* ==========================================
           LUX - Luxury Color Palette (NEW)
           Primary palette for refined design
           ========================================== */
        lux: {
          black: "hsl(var(--lux-black))",
          ink: "hsl(var(--lux-ink))",
          "ink-soft": "hsl(var(--lux-ink-soft))",
          charcoal: "hsl(var(--lux-charcoal))",
          white: "hsl(var(--lux-white))",
          pearl: "hsl(var(--lux-pearl))",
          cream: "hsl(var(--lux-cream))",
          "gray-light": "hsl(var(--lux-gray-light))",
          gray: "hsl(var(--lux-gray))",
          "gray-dark": "hsl(var(--lux-gray-dark))",
          silver: "hsl(var(--lux-silver))",
          "silver-soft": "hsl(var(--lux-silver-soft))",
          gold: "hsl(var(--lux-gold))",
          "gold-light": "hsl(var(--lux-gold-light))",
        },

        /* ==========================================
           LEGACY COLORS (kept for compatibility)
           Gradually migrate to lux palette
           ========================================== */
        
        /* Ink - Text Colors (Complete Scale) */
        ink: {
          400: "hsl(var(--ink-400))",
          500: "hsl(var(--ink-500))",
          600: "hsl(var(--ink-600))",
          700: "hsl(var(--ink-700))",
          800: "hsl(var(--ink-800))",
          900: "hsl(var(--ink-900))",
          DEFAULT: "hsl(var(--ink-900))",
          light: "hsl(var(--ink-600))", // Alias for lighter text
        },
        
        /* Gold - Brand Accent (Complete Scale) */
        gold: {
          300: "hsl(var(--gold-300))",
          400: "hsl(var(--gold-400))",
          500: "hsl(var(--gold-500))",
          600: "hsl(var(--gold-600))",
          700: "hsl(var(--gold-700))",
          DEFAULT: "hsl(var(--gold-500))",
        },
        
        /* Surface - Backgrounds (Complete Scale) */
        surface: {
          0: "hsl(var(--surface-0))",
          1: "hsl(var(--surface-50))", // Alias
          50: "hsl(var(--surface-50))",
          100: "hsl(var(--surface-100))",
          200: "hsl(var(--surface-200))",
          300: "hsl(var(--surface-300))",
          800: "hsl(var(--surface-800))",
          900: "hsl(var(--surface-900))",
          DEFAULT: "hsl(var(--surface-0))",
        },
        
        /* CTA - Call to Action (Complete Scale) */
        cta: {
          400: "hsl(var(--cta-400))",
          500: "hsl(var(--cta-500))",
          600: "hsl(var(--cta-600))",
          700: "hsl(var(--cta-700))",
          800: "hsl(var(--cta-800))",
          DEFAULT: "hsl(var(--cta-600))",
          hover: "hsl(var(--cta-700))",
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
          DEFAULT: "hsl(var(--border-300))",
        },

        /* Additional aliases */
        "ink-secondary": "hsl(var(--ink-600))",
        "ink-muted": "hsl(var(--ink-500))",
        "ink-light": "hsl(var(--ink-600))",

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

        /* Aesop-Inspired Earthy Palette (Legacy) */
        aesop: {
          cream: "hsl(var(--aesop-cream))",
          sand: "hsl(var(--aesop-sand))",
          olive: "hsl(var(--aesop-olive))",
          charcoal: "hsl(var(--aesop-charcoal))",
          "olive-foreground": "hsl(var(--aesop-olive-foreground))",
          "charcoal-foreground": "hsl(var(--aesop-charcoal-foreground))",
        },
      },
      
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "'Times New Roman'", "serif"],
        logo: ["var(--font-logo)", "system-ui", "sans-serif"],
      },
      
      fontSize: {
        /* Display sizes for heroes */
        "display-sm": ["2rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        "display-md": ["2.5rem", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        "display-lg": ["3rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-xl": ["3.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-2xl": ["4rem", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
      },
      
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        full: "var(--radius-full)",
        DEFAULT: "var(--radius)",
      },
      
      spacing: {
        xs: "var(--spacing-xs)",
        sm: "var(--spacing-sm)",
        md: "var(--spacing-md)",
        lg: "var(--spacing-lg)",
        xl: "var(--spacing-xl)",
        "2xl": "var(--spacing-2xl)",
        "3xl": "var(--spacing-3xl)",
        "section-small": "2rem",
        "section": "4rem",
        "section-large": "6rem",
      },
      
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
        card: "0 2px 8px rgba(0, 0, 0, 0.08)",
        "card-hover": "0 8px 24px rgba(0, 0, 0, 0.12)",
        elevated: "0 4px 16px rgba(0, 0, 0, 0.15)",
        cta: "0 4px 14px rgba(0, 0, 0, 0.25)",
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
        shimmer: {
          "0%": { "background-position": "-200px 0" },
          "100%": { "background-position": "calc(200px + 100%) 0" },
        },
        underlineSlide: {
          "0%": { transform: "scaleX(0)", transformOrigin: "left" },
          "100%": { transform: "scaleX(1)", transformOrigin: "left" },
        },
      },
      
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.6s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        shimmer: "shimmer 1.5s ease-in-out infinite",
        "underline-slide": "underlineSlide 0.3s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
