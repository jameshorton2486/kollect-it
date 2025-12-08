// src/lib/fonts.ts
// ===========================================
// KOLLECT-IT FONT CONFIGURATION
// Using next/font for optimized Google Font loading
// ===========================================

import { Cormorant_Garamond, Inter } from 'next/font/google';

// Serif font for headings, hero titles, category titles
export const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-serif',
});

// Sans-serif font for body text, UI, navigation, buttons
export const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-sans',
});

// Export combined class string for use in layout.tsx
export const fontVariables = `${cormorantGaramond.variable} ${inter.variable}`;
