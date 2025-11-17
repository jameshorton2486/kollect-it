# 📊 Component Color Usage Map

**Kollect-It Component Color Reference**  
**Generated:** November 15, 2025  

---

## 🎯 **Core Layout Components**

### **Hero.tsx**
- **Background:** `bg-ink` (--ink-900) - Deep charcoal for premium feel
- **Primary Text:** `text-white` - High contrast on dark background  
- **Accent Text:** `text-gold` (--gold-500) - Brand highlighting
- **CTA Buttons:** `bg-gold hover:bg-gold-dark` - Primary actions
- **Trust Indicators:** `text-gold` - Gold accents for credibility

### **Header.tsx**  
- **Background:** `bg-surface` (--surface-0) - Clean white
- **Logo/Brand:** `text-gold` (--gold-500) - Brand consistency
- **Navigation Text:** `text-ink hover:text-gold` - Clear hierarchy
- **Borders:** `border-border` (--border-300) - Subtle separation

### **Footer.tsx**
- **Background:** `bg-surface-100` (--surface-100) - Warm cream
- **Text:** `text-ink-secondary` (--ink-700) - Readable on light
- **Links:** `text-ink hover:text-gold` - Interactive feedback
- **Dividers:** `border-border` - Section separation

---

## 🏠 **Home Page Components**

### **TrustStrip.tsx**
- **Background:** `bg-surface-100` - Alternating section
- **Icons:** `text-gold` - Brand accent consistency
- **Text:** `text-ink` - Primary readability
- **Subtle text:** `text-ink-secondary` - Supporting information

### **FeaturedCollection.tsx**
- **Card Backgrounds:** `bg-surface` - Clean white cards
- **Headings:** `text-ink` - Strong hierarchy
- **Descriptions:** `text-ink-secondary` - Supporting content
- **Price:** `text-gold` - Important information highlighting
- **CTA:** `bg-gold hover:bg-gold-dark` - Action buttons

### **LatestArrivalsClient.tsx**
- **Section Background:** `bg-surface-100` - Warm section
- **Product Cards:** `bg-surface` - Individual card contrast
- **Product Names:** `text-ink hover:text-gold` - Interactive titles
- **Prices:** `text-gold` - Value emphasis
- **Badges:** `bg-gold text-white` - New/featured indicators

---

## 🛍️ **Product Components**

### **ProductCard.tsx**
- **Card:** `bg-surface border-border` - Clean card design
- **Image Container:** `bg-surface-50` - Subtle image background
- **Title:** `text-ink hover:text-gold` - Interactive naming
- **Price:** `text-gold` - Value highlighting
- **Description:** `text-ink-secondary` - Supporting details
- **Badges:** `bg-gold text-white` - Status indicators

### **ProductDetails.tsx**
- **Background:** `bg-surface` - Clean content area
- **Headings:** `text-ink` - Strong hierarchy
- **Body Text:** `text-ink-secondary` - Readable content
- **Highlights:** `text-gold` - Key features
- **CTA Buttons:** `bg-cta text-white hover:bg-cta-hover` - Action buttons

---

## 📝 **Form Components**

### **ContactForm.tsx**
- **Form Background:** `bg-surface` - Clean form area
- **Labels:** `text-ink` - Clear field identification
- **Inputs:** `border-border focus:border-gold` - Interactive feedback
- **Error States:** `border-semantic-error text-semantic-error` - Clear error indication
- **Success:** `text-semantic-success` - Positive feedback
- **Submit Button:** `bg-gold hover:bg-gold-dark` - Primary action

### **SearchBar.tsx**  
- **Background:** `bg-surface border-border` - Clean search area
- **Placeholder:** `text-ink-muted` - Helpful guidance
- **Focus:** `focus:border-gold` - Active state indication
- **Results:** `bg-surface border-border` - Clean dropdown

---

## 🎨 **Admin Components**

### **DashboardOverview.tsx**
- **Background:** `bg-surface-50` - Light dashboard area
- **Cards:** `bg-surface border-border` - Clean metric cards
- **Headers:** `text-ink` - Strong data hierarchy
- **Values:** `text-gold` - Key metrics highlighting
- **Charts:** Uses semantic colors for data visualization

### **ApprovalTrendChart.tsx**
- **Container:** `border-gold bg-ink` - Branded chart container
- **Success Line:** `stroke-semantic-success` - Positive trend
- **Error Line:** `stroke-semantic-error` - Negative trend
- **Grid:** `stroke-border` - Subtle chart guidelines
- **Tooltips:** `bg-ink border-gold` - Branded information display

---

## 📧 **Email Components**

### **OrderConfirmationEmail.tsx**
- **Background:** `#FFFFFF` - Email-safe white
- **Header:** Brand gold `#B1874C` - Consistent branding
- **Text:** `#1E1E1E` - High contrast black
- **Links:** `#B1874C` - Brand accent for actions
- **Footer:** `#5A5A5A` - Muted footer text

*Note: Email components use hex values for compatibility across email clients*

---

## 🚨 **Interactive States**

### **Button States**
- **Default:** `bg-gold text-white`
- **Hover:** `hover:bg-gold-dark`  
- **Active:** `active:bg-gold-darker`
- **Disabled:** `bg-ink-muted text-ink-secondary cursor-not-allowed`
- **Loading:** `bg-gold opacity-75`

### **Form States**
- **Default:** `border-border text-ink`
- **Focus:** `focus:border-gold focus:ring-gold`
- **Error:** `border-semantic-error text-semantic-error`
- **Success:** `border-semantic-success`
- **Disabled:** `bg-surface-100 text-ink-muted`

### **Link States**
- **Default:** `text-ink`
- **Hover:** `hover:text-gold`
- **Visited:** `text-ink` (maintains consistency)
- **Active:** `text-gold-dark`

---

## 📱 **Responsive Considerations**

### **Mobile Adaptations**
- All colors maintain contrast ratios across screen sizes
- Touch targets use `bg-gold` for clear interaction areas
- Text remains readable with minimum 16px on mobile

### **Dark Mode Ready**
- `bg-surface-900` available for dark themes
- `text-white` for dark background text
- Gold accents work on both light and dark backgrounds

---

## 🎯 **Brand Consistency Rules**

### **Primary Brand Expression**
1. **Gold** (`--gold-500`) for all brand moments
2. **Ink** (`--ink-900`) for primary text hierarchy  
3. **Surface** (`--surface-0`, `--surface-100`) for clean backgrounds

### **Interactive Feedback**
1. All hover states use gold variations
2. Error states use semantic-error consistently
3. Success states use semantic-success
4. Focus states highlight with gold

### **Hierarchy Establishment**
1. **Primary:** `text-ink` (darkest, most important)
2. **Secondary:** `text-ink-secondary` (supporting information)  
3. **Muted:** `text-ink-muted` (least important, metadata)
4. **Accent:** `text-gold` (brand highlights, prices, CTAs)

---

**Last Updated:** November 15, 2025  
**Component Count:** 25+ consistently styled components