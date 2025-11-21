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
          1: "hsl(var(--surface-1))",
          2: "hsl(var(--surface-2))",
          50: "hsl(var(--surface-50))",
          100: "hsl(var(--surface-100))",
          900: "hsl(var(--surface-900))",
        },
        
        /* CTA - Call to Action */
        cta: {
          DEFAULT: "hsl(var(--cta-primary))",
          hover: "hsl(var(--cta-hover))",
          active: "hsl(var(--cta-active))",
        },
        
        /* Semantic Colors */
        semantic: {
          error: "hsl(var(--semantic-error))",
          success: "hsl(var(--semantic-success))",
          warning: "hsl(var(--semantic-warning))",
          info: "hsl(var(--semantic-info))",
        },
        
        /* Borders & Dividers */
        border: "hsl(var(--border-300))",
        divider: "hsl(var(--surface-100))",
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
