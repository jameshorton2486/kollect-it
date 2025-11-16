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
        ink: "hsl(var(--ink-900))",
        
        /* Gold - Brand Accent */
        gold: {
          DEFAULT: "hsl(var(--gold-500))",
          dark: "hsl(var(--gold-600))",
          light: "hsl(var(--gold-400))",
        },
        
        /* Surface - Backgrounds */
        surface: {
          1: "hsl(var(--surface-1))",
          2: "hsl(var(--surface-2))",
          3: "hsl(var(--surface-3))",
        },
        
        /* CTA - Call to Action */
        cta: {
          DEFAULT: "hsl(var(--gold-500))",
          hover: "hsl(var(--gold-600))",
        },
        
        /* Semantic Colors */
        success: "hsl(var(--success-500))",
        error: "hsl(var(--error-500))",
        warning: "hsl(var(--warning-500))",
        info: "hsl(var(--info-500))",
        
        /* Borders & Dividers */
        border: "hsl(var(--border))",
        divider: "hsl(var(--surface-2))",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "Georgia", "serif"],
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
