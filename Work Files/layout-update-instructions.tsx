// ===========================================
// LAYOUT.TSX UPDATE INSTRUCTIONS
// ===========================================
// 
// You need to modify your existing src/app/layout.tsx file.
// DO NOT replace the entire file - just make these specific changes:
//
// ===========================================
// STEP 1: Add this import at the top of layout.tsx
// ===========================================

import { fontVariables } from '@/lib/fonts';

// ===========================================
// STEP 2: Update the <html> or <body> tag to include font variables
// ===========================================

// BEFORE (your current code probably looks like this):
// <html lang="en">
//   <body className={someExistingClasses}>

// AFTER (add fontVariables to the className):
// <html lang="en" className={fontVariables}>
//   <body className={`${someExistingClasses} font-sans`}>

// ===========================================
// EXAMPLE: If your layout.tsx body looks like this:
// ===========================================

// BEFORE:
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-lux-pearl">
        {children}
      </body>
    </html>
  );
}

// AFTER:
import { fontVariables } from '@/lib/fonts';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVariables}>
      <body className="min-h-screen bg-lux-pearl font-sans antialiased">
        {children}
      </body>
    </html>
  );
}

// ===========================================
// NOTES:
// ===========================================
// - fontVariables adds CSS custom properties: --font-serif and --font-sans
// - font-sans on body sets Inter as the default font
// - antialiased improves font rendering
// - Headings will use font-serif (Cormorant Garamond) via the utility classes
