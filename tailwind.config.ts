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
          secondary: "hsl(var(--ink-700))",
          muted: "hsl(var(--ink-500))",
        },
        
        /* Gold - Brand Accent */
        gold: {
          DEFAULT: "hsl(var(--gold-500))",
          light: "hsl(var(--gold-400))",
          dark: "hsl(var(--gold-600))",
          darker: "hsl(var(--gold-700))",
        },
        
        /* Surface - Backgrounds */
        surface: {
          DEFAULT: "hsl(var(--surface-0))",
          50: "hsl(var(--surface-50))",
          100: "hsl(var(--surface-100))",
          200: "hsl(var(--surface-200))",
          300: "hsl(var(--surface-300))",
          900: "hsl(var(--surface-900))",
        },
        
        /* CTA - Call to Action */
        cta: {
          DEFAULT: "hsl(var(--cta-600))",
          hover: "hsl(var(--cta-700))",
          active: "hsl(var(--cta-800))",
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
          error: "hsl(var(--semantic-error-500))",
          success: "hsl(var(--semantic-success-500))",
          warning: "hsl(var(--semantic-warning-500))",
          info: "hsl(var(--semantic-info-500))",
        },
        
        /* Borders & Dividers */
        border: "hsl(var(--border-300))",
        divider: "hsl(var(--border-200))",
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
