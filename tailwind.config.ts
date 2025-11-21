import type { Config } from "tailwindcss";

/* ============================================
   KOLLECT-IT TAILWIND CONFIGURATION
   Colors sync with globals.css CSS variables
   ============================================ */

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1.25rem',
        sm: '1.5rem',
        md: '2rem',
        lg: '3rem',
      },
      screens: {
        '2xl': '1200px', // Limits max width on huge screens
      },
    },
    extend: {
      colors: {
        /* Ink - Primary Text */
        ink: {
          DEFAULT: "hsl(var(--ink-900))",
          900: "hsl(var(--ink-900))",
          800: "hsl(var(--ink-800))",
          700: "hsl(var(--ink-700))",
          600: "hsl(var(--ink-600))",
          500: "hsl(var(--ink-500))",
          400: "hsl(var(--ink-400))",
        },
        
        /* Gold - Brand Accent */
        gold: {
          DEFAULT: "hsl(var(--gold-500))",
          300: "hsl(var(--gold-300))",
          400: "hsl(var(--gold-400))",
          500: "hsl(var(--gold-500))",
          600: "hsl(var(--gold-600))",
          700: "hsl(var(--gold-700))",
        },
        
        /* Surface - Backgrounds */
        surface: {
          DEFAULT: "hsl(var(--surface-0))",
          0: "hsl(var(--surface-0))",
          50: "hsl(var(--surface-50))",
          100: "hsl(var(--surface-100))",
          200: "hsl(var(--surface-200))",
          300: "hsl(var(--surface-300))",
          800: "hsl(var(--surface-800))",
          900: "hsl(var(--surface-900))",
        },
        
        /* CTA - Call to Action */
        cta: {
          DEFAULT: "hsl(var(--cta-600))",
          400: "hsl(var(--cta-400))",
          500: "hsl(var(--cta-500))",
          600: "hsl(var(--cta-600))",
          700: "hsl(var(--cta-700))",
          800: "hsl(var(--cta-800))",
        },

        /* Shadcn Aliases */
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--cta-600))",
          foreground: "hsl(0 0% 100%)",
        },
        secondary: {
          DEFAULT: "hsl(var(--gold-500))",
          foreground: "hsl(var(--ink-900))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        
        /* Semantic Colors */
        semantic: {
          error: {
            DEFAULT: "hsl(var(--semantic-error-500))",
            500: "hsl(var(--semantic-error-500))",
            600: "hsl(var(--semantic-error-600))",
          },
          success: {
            DEFAULT: "hsl(var(--semantic-success-500))",
            500: "hsl(var(--semantic-success-500))",
            600: "hsl(var(--semantic-success-600))",
          },
          warning: {
            DEFAULT: "hsl(var(--semantic-warning-500))",
            500: "hsl(var(--semantic-warning-500))",
            600: "hsl(var(--semantic-warning-600))",
          },
          info: {
            DEFAULT: "hsl(var(--semantic-info-500))",
            500: "hsl(var(--semantic-info-500))",
            600: "hsl(var(--semantic-info-600))",
          },
        },
        
        /* Borders & Dividers */
        border: {
          DEFAULT: "hsl(var(--border-300))",
          200: "hsl(var(--border-200))",
          300: "hsl(var(--border-300))",
          400: "hsl(var(--border-400))",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
