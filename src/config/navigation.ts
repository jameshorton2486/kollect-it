
import { Shield, Settings, Package, ShoppingCart, Home, Info, Mail, Store, User, FileText, HelpCircle, Truck, Book, History, BadgeCheck } from "lucide-react";

interface MenuItem {
  name: string;
  path: string;
  icon?: any;
  roles?: string[];
  children?: MenuItem[];
}

export const mainNavItems: MenuItem[] = [
  { name: "Home", path: "/", icon: Home },
  { name: "About Us", path: "/about", icon: Info },
  { name: "Contact", path: "/contact", icon: Mail },
  { 
    name: "Shop", 
    path: "/categories",
    icon: Store,
    children: [
      { name: "Categories", path: "/categories" },
      { name: "Featured", path: "/featured" },
      { name: "New Arrivals", path: "/new-arrivals" }
    ]
  }
];

export const userNavItems: MenuItem[] = [
  { name: "Profile Settings", path: "/profile-settings", icon: Settings },
  { name: "Purchase History", path: "/purchase-history", icon: History },
  { name: "Shopping Cart", path: "/cart", icon: ShoppingCart },
  { name: "Personal Collection", path: "/personal-collection", icon: Package }
];

export const sellerNavItems: MenuItem[] = [
  { name: "Seller Dashboard", path: "/seller-dashboard", icon: Store, roles: ["seller"] },
  { name: "Sales Analytics", path: "/seller/analytics", icon: Package, roles: ["seller"] },
  { name: "Seller Guidelines", path: "/seller-guidelines", icon: Book, roles: ["seller"] }
];

export const adminNavItems: MenuItem[] = [
  { name: "Admin Dashboard", path: "/admin-dashboard", icon: Shield, roles: ["admin"] },
  { name: "Category Management", path: "/category-management", icon: Package, roles: ["admin"] }
];

export const buyerNavItems: MenuItem[] = [
  { name: "Buyer Dashboard", path: "/buyer-dashboard", icon: User },
  { name: "Orders", path: "/purchase-history", icon: Package }
];

export const footerNavItems: MenuItem[] = [
  { name: "FAQ", path: "/faq", icon: HelpCircle },
  { name: "Privacy Policy", path: "/privacy-policy", icon: FileText },
  { name: "Terms of Service", path: "/terms-of-service", icon: FileText },
  { name: "Shipping & Returns", path: "/shipping-returns", icon: Truck }
];

export const authNavItems: MenuItem[] = [
  { name: "Login/Register", path: "/auth" },
  { name: "Password Recovery", path: "/password-recovery" },
  { name: "Verify Email", path: "/verify-email" },
  { name: "MFA Verification", path: "/mfa-verification" },
  { name: "Auth Documentation", path: "/auth-documentation" }
];

export const getAllNavItems = () => [
  ...mainNavItems,
  ...userNavItems,
  ...sellerNavItems,
  ...adminNavItems,
  ...buyerNavItems,
  ...footerNavItems,
  ...authNavItems
];
