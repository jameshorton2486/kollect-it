
import { 
  Shield, Settings, Package, ShoppingCart, Home, Info, Mail, Store, 
  User, FileText, HelpCircle, Truck, Book, History, BadgeCheck,
  BarChart, Archive, LineChart, Users, Layout, ShoppingBag, CheckSquare,
  FileBox, ScrollText, BookOpen, ClipboardList, ShoppingBasket, CheckCircle
} from "lucide-react";

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
  { name: "Blog", path: "/blog", icon: ScrollText },
  { name: "Contact", path: "/contact", icon: Mail },
  { 
    name: "Shop", 
    path: "/categories",
    icon: Store,
    children: [
      { name: "Products", path: "/products", icon: ShoppingBag },
      { name: "Categories", path: "/categories", icon: Archive },
      { name: "Featured", path: "/featured", icon: BadgeCheck },
      { name: "New Arrivals", path: "/new-arrivals", icon: Package }
    ]
  }
];

export const userNavItems: MenuItem[] = [
  { name: "Profile Settings", path: "/profile-settings", icon: Settings },
  { name: "Shopping Cart", path: "/cart", icon: ShoppingCart },
  { name: "Checkout", path: "/checkout", icon: CheckSquare },
  { name: "Order Confirmation", path: "/order-confirmation", icon: CheckCircle },
  { name: "Personal Collection", path: "/personal-collection", icon: FileBox },
  { name: "Purchase History", path: "/purchase-history", icon: History },
  { name: "Orders", path: "/purchase-history", icon: Package },
  { name: "Auth Documentation", path: "/auth-documentation", icon: FileText },
];

export const sellerNavItems: MenuItem[] = [
  { name: "Seller Dashboard", path: "/seller-dashboard", icon: Store, roles: ["seller"] },
  { name: "Sales Analytics", path: "/seller/analytics", icon: BarChart, roles: ["seller"] },
  { name: "Seller Guidelines", path: "/seller-guidelines", icon: Book, roles: ["seller"] }
];

export const adminNavItems: MenuItem[] = [
  { name: "Admin Dashboard", path: "/admin-dashboard", icon: Shield, roles: ["admin"] },
  { name: "Analytics Dashboard", path: "/admin-dashboard/analytics", icon: LineChart, roles: ["admin"] },
  { name: "User Management", path: "/admin-dashboard/users", icon: Users, roles: ["admin"] },
  { name: "Content Management", path: "/admin-dashboard/content", icon: Layout, roles: ["admin"] },
  { name: "Category Management", path: "/category-management", icon: Package, roles: ["admin"] }
];

export const buyerNavItems: MenuItem[] = [
  { name: "Buyer Dashboard", path: "/buyer-dashboard", icon: ShoppingBasket },
  { name: "Orders", path: "/purchase-history", icon: ClipboardList }
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
